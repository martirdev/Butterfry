import { first, mergeWith, sum, trimEnd } from "lodash";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma, procedure } from "../../shared/trpc";

const paramsValidator = z.object({
  id: z.string(),
  status: z.enum([
    "CREATED",
    "IN_PROCESS",
    "NEED_INFO",
    "READY_TO_DELIVERY",
    "IN_DELIVERY",
    "COMPLETED",
    "CANCELED",
    "REFUND",
  ]),
  products: z.array(
    z.object({
      id: z.string(),
      amount: z.number().positive(),
    })
  ),
  address: z.string(),
  customer: z.string(),
});

export const setOrder = procedure
  .input(paramsValidator)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const existingOrder = await prisma.order.findUnique({
        where: {
          id: input.id,
        },
        include: {
          orderVersions: {
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
            include: {
              products: true,
            },
          },
        },
      });

      const previousOrderProducts = (
        first(existingOrder?.orderVersions)?.products ?? []
      ).reduce<Record<string, number>>((acc, product) => {
        acc[product.productId] = product.amount;
        return acc;
      }, {});
      const nextProducts = input.products.reduce<Record<string, number>>(
        (acc, product) => {
          acc[product.id] = -product.amount;
          return acc;
        },
        {}
      );
      const diffProducts = mergeWith(previousOrderProducts, nextProducts, sum);

      const productPrices = await prisma.productVersion.findMany({
        where: {
          id: {
            in: Object.keys(diffProducts),
          },
          product: {
            userId: ctx.user.id,
          },
        },
        select: {
          id: true,
          productId: true,
          price: true,
        },
      });
      const productByVersionId = productPrices.reduce<
        Record<string, (typeof productPrices)[number]>
      >((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {});

      const productCountHistory = Object.entries(diffProducts).map(
        ([versionId, value]) => ({
          productId: productByVersionId[versionId].productId,
          value,
        })
      );

      await prisma.productCountHistory.createMany({
        data: productCountHistory,
      });

      const productPricesMap = productPrices.reduce<Record<string, number>>(
        (acc, product) => {
          acc[product.id] = product.price;
          return acc;
        },
        {}
      );
      const totalPrice = input.products.reduce(
        (acc, product) =>
          acc + (productPricesMap[product.id] ?? 0) * product.amount,
        0
      );

      console.log({ totalPrice, productPricesMap });

      if (existingOrder) {
        return await prisma.orderVersion.create({
          data: {
            total: totalPrice,
            orderId: input.id,
            status: input.status,
            products: {
              create: input.products.map((product) => ({
                amount: product.amount,
                product: {
                  connect: {
                    id: product.id,
                  },
                },
              })),
            },
            address: input.address,
          },
        });
      } else {
        return await prisma.order.create({
          data: {
            id: input.id,
            userId: ctx.user.id,
            customerId: input.customer,
            orderVersions: {
              create: {
                total: totalPrice,
                status: input.status,
                products: {
                  create: input.products.map((product) => ({
                    amount: product.amount,
                    product: {
                      connect: {
                        id: product.id,
                      },
                    },
                  })),
                },
                address: input.address,
              },
            },
          },
        });
      }
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Error creating product or version`,
        cause: error,
      });
    }
  });
