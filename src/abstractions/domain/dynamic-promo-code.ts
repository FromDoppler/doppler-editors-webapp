type PromoCodeTypes = "percent" | "money" | "shipping";

export type DynamicPromoCodeParams = {
  dynamic_id: string;
  type: PromoCodeTypes;
  amount: string;
  expire_days: string;
  min_price: string;
  prefixe_code: string;
  includes_shipping: boolean;
  first_consumer_purchase: boolean;
  combines_with_other_discounts: boolean;
};
