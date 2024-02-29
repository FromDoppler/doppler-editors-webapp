import { SortingProductsCriteria } from "../../components/product-gallery/HeaderSortProductsDropdown";

export type DopplerEditorSettings = Readonly<{
  abandonedCartCampaign: boolean;
  visitedProductsCampaign: boolean;
  confirmationOrderCampaign: boolean;
  pendingOrderCampaign: boolean;
  stores: Readonly<DopplerEditorStore[]>;
}>;

export type DopplerEditorStore = Readonly<{
  name: string;
  promotionCodeEnabled: boolean;
  productsEnabled: boolean;
  sortingProductsCriteria: Readonly<SortingProductsCriteria[]>;
}>;
