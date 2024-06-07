import { createMarketplaceKey } from "../procedures/create-marketplace-keys";
import { createProduct } from "../procedures/create-product";
import { getMarketplaceCategories } from "../procedures/get-marketplace-categories";
import { getMarketplaceKeys } from "../procedures/get-marketplace-keys";
import { getSettingsByCategory } from "../procedures/get-settings-by-category";
import { getSettingValues } from "../procedures/get-setting-values";
import { removeMarkeplaceKeys } from "../procedures/remove-markeplace-keys";
import { router } from "../shared/trpc";

export const appRouter = router({
  getMarketplaceKeys,
  createMarketplaceKey,
  removeMarkeplaceKeys,

  getMarketplaceCategories,
  getSettingsByCategory,
  getSettingValues,

  createProduct,
});

export type Router = typeof appRouter;
