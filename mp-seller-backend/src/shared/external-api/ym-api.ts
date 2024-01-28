import axios from "axios";
import { YM_CATEGORIES } from "./ym-categories";
import { LoadCategorySettings, LoadPlacesFromYMRequest } from "./ym-types";

export const loadPlacesFromYM = async (token: string) =>
  axios.get<LoadPlacesFromYMRequest>(
    "https://api.partner.market.yandex.ru/campaigns",
    {
      data: { page: 1, pageSize: 100 },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const loadYMCategories = () => YM_CATEGORIES;

export const loadSettingsByCategory = async (
  token: string,
  categoryId: string
) =>
  axios.get<LoadCategorySettings>(
    `https://api.partner.market.yandex.ru/category/${categoryId}/parameters`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
