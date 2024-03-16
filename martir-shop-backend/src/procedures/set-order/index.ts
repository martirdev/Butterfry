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
      });

      if (existingOrder) {
        return await prisma.orderVersion.create({
          data: {
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
        return await prisma.$transaction([
          prisma.productCountHistory.createMany({
            data: input.products.map((product) => ({
              value: -1 * product.amount,
              productId: product.id,
            })),
          }),
          prisma.order.create({
            data: {
              id: input.id,
              userId: ctx.user.id,
              customerId: input.customer,
              orderVersions: {
                create: {
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
          }),
        ]);
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
