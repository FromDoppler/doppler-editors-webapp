import { Result } from "../abstractions/common/result-types";
import { AppServices } from "../abstractions";
import {
  PromoCodeItem,
  DopplerLegacyClient,
  SortingImagesCriteria,
  SortingImagesDirection,
  UploadImageResult,
  SetImageCampaign,
  UploadCampaignImageResult,
  PromoCodeType,
} from "../abstractions/doppler-legacy-client";
import { ImageItem } from "../abstractions/domain/image-gallery";
import {
  DopplerEditorSettings,
  DopplerEditorStore,
} from "../abstractions/domain/DopplerEditorSettings";
import {
  SortingProductsCriteria,
  SortingProductsDirection,
} from "../components/product-gallery/HeaderSortProductsDropdown";
import { ProductGalleryValue } from "../abstractions/domain/product-gallery";

export class DopplerLegacyClientImpl implements DopplerLegacyClient {
  private axios;
  private window;

  constructor({
    axiosStatic,
    appConfiguration: { dopplerLegacyBaseUrl },
    window,
  }: AppServices) {
    this.window = window;
    this.axios = axiosStatic.create({
      baseURL: dopplerLegacyBaseUrl,
      withCredentials: true,
    });
  }

  async getImageGallery({
    searchTerm,
    sortingCriteria,
    sortingDirection,
    continuation,
  }: {
    searchTerm: string;
    sortingCriteria: SortingImagesCriteria;
    sortingDirection: SortingImagesDirection;
    continuation?: string | undefined;
  }): Promise<
    Result<{ items: ImageItem[]; continuation: string | undefined }>
  > {
    const take = 50;
    const position = continuation ? parseInt(continuation) : 0;
    const queryString = new URLSearchParams({
      isAscending: sortingDirection === "ASCENDING" ? "true" : "false",
      offset: `${take}`,
      position: `${position}`,
      query: searchTerm,
      sortingCriteria: sortingCriteria,
    });
    const path = "/Campaigns/Editor/GetImageGallery";
    const response = await this.axios.get(`${path}?${queryString}`);

    const items = response.data.images.map(parseImageItem);
    const total = parseInt(response.data.count);
    const end = position + items.length;
    const newContinuation = total > end ? `${end}` : undefined;

    return {
      success: true,
      value: {
        items,
        continuation: newContinuation,
      },
    };
  }

  async uploadImage(file: File): Promise<UploadImageResult> {
    // TODO: deal with server errors for example:
    //   {"success":false,"error":"Tamaño inválido","maxSize":3145728}
    // TODO: do client side validations like this:
    //   https://github.com/MakingSense/MSEditor/blob/v1.4.0/app/controllers/mseditorImageGalleryCtrl.js
    //   Lines #L95-L105

    try {
      const result = await this.axios.postForm(
        "/Campaigns/Editor/UploadImage",
        {
          file,
        },
      );

      if (result.data?.success) {
        return { success: true };
      }

      if (result.data && "maxSize" in result.data) {
        return {
          success: false,
          error: {
            reason: "maxSizeExceeded",
            currentSize: file.size,
            maxSize: result.data.maxSize,
          },
        };
      }

      return {
        success: false,
        error: { reason: "unexpected", details: result.data },
      };
    } catch (e) {
      return { success: false, error: { reason: "unexpected", details: e } };
    }
  }

  async deleteImage({ name }: { name: string }): Promise<Result<void, any>> {
    try {
      // Using postForm to avoid the preflight request
      const result = await this.axios.postForm(
        "/Campaigns/Editor/RemoveImage",
        {
          fileName: name,
        },
      );
      if (!result.data.success) {
        return { success: false, error: { cause: result.data } };
      }
    } catch (e) {
      return { success: false, error: { cause: e } };
    }
    return { success: true };
  }

  async deleteImages(items: readonly { name: string }[]): Promise<Result> {
    for (const { name } of items) {
      const result = await this.deleteImage({ name });
      if (!result.success) {
        // Ignoring individual errors
        this.window.console.error("Error deleting image", result.error);
      }
    }
    return {
      success: true,
    };
  }

  async updateCampaignThumbnail(
    idCampaign: string,
  ): Promise<Result<void, any>> {
    try {
      // Using postForm to avoid the preflight request
      const result = await this.axios.postForm(
        "/Campaigns/Editor/GenerateCampaignThumbnail",
        {
          idCampaign: idCampaign,
        },
      );
      if (!result.data.success) {
        return { success: false, error: { cause: result.data } };
      }
    } catch (e) {
      return { success: false, error: { cause: e } };
    }
    return { success: true };
  }

  async updateTemplateThumbnail(
    idTemplate: string,
  ): Promise<Result<void, any>> {
    try {
      // Using postForm to avoid the preflight request
      const result = await this.axios.postForm(
        "/Campaigns/Editor/GenerateTemplateThumbnail",
        {
          idTemplate: idTemplate,
        },
      );
      if (!result.data.success) {
        return { success: false, error: { cause: result.data } };
      }
    } catch (e) {
      return { success: false, error: { cause: e } };
    }
    return { success: true };
  }

  async selectGalleryImage(fileName: string): Promise<SetImageCampaign> {
    try {
      const result = await this.axios.postForm(
        "/Campaigns/Editor/selectGalleryImage",
        {
          imageName: fileName,
        },
      );
      if (result.data?.success) {
        return {
          success: true,
          value: {
            url: result.data?.imageUrl || "",
          },
        };
      }
      return {
        success: false,
        error: { reason: "unexpected", details: result.data },
      };
    } catch (e) {
      return { success: false, error: { reason: "unexpected", details: e } };
    }
  }

  async uploadImageCampaign(file: File): Promise<UploadCampaignImageResult> {
    try {
      const result = await this.axios.postForm(
        "/Campaigns/Editor/UploadImageCampaign",
        {
          file,
        },
      );
      if (result.data?.success) {
        return {
          success: true,
          value: {
            url: result.data?.imageUrl || "",
          },
        };
      }

      if (result.data && "maxSize" in result.data) {
        return {
          success: false,
          error: {
            reason: "maxSizeExceeded",
            currentSize: file.size,
            maxSize: result.data.maxSize,
          },
        };
      }

      return {
        success: false,
        error: { reason: "unexpected", details: result.data },
      };
    } catch (e) {
      return { success: false, error: { reason: "unexpected", details: e } };
    }
  }

  async getEditorSettings(idCampaign?: string, idTemplate?: string) {
    // fix to resolve call GetSettings with both parameter
    const _idTemplate = idCampaign && idCampaign !== "0" ? "0" : idTemplate;
    const queryString = new URLSearchParams({
      idCampaign: idCampaign || "0",
      idTemplate: _idTemplate || "0",
    });

    const response = await this.axios.get(
      `/MSEditor/Editor/GetSettings?${queryString}`,
    );
    const value = parseDopplerEditorSettings(response.data);
    return { success: true, value } as const;
  }

  async getPromoCodes({
    store,
  }: {
    store: string;
  }): Promise<Result<PromoCodeItem[]>> {
    const response = await this.axios.get(
      `/MSEditor/Editor/GetPromoCodesByStore?store=${store}`,
    );

    const value = arrayOrEmptyArray(response.data.promoCodes).map(
      parsePromoCodeItem,
    );
    return { success: true, value } as const;
  }

  async getProducts({
    storeSelected,
    searchTerm,
    sortingCriteria,
    sortingDirection,
    continuation,
  }: {
    storeSelected: DopplerEditorStore;
    searchTerm: string;
    sortingCriteria: SortingProductsCriteria;
    sortingDirection: SortingProductsDirection;
    continuation?: string | undefined;
  }): Promise<
    Result<{
      // TODO: update this type because it is what we need to send to Unlayer Extensions,
      // but probably it is not what we need for the gallery. For example, we need the
      // thumbnail URL.
      items: ProductGalleryValue[];
      continuation: string | undefined;
    }>
  > {
    const take = 20;
    const queryString = new URLSearchParams({
      store: storeSelected.name,
      query: searchTerm,
      continuationToken: !!continuation ? continuation : "",
      itemsQuantity: `${take}`,
      sortingCriteria: sortingCriteria,
      isAscending: sortingDirection === "ASCENDING" ? "true" : "false",
    });

    const path = "/MSEditor/Editor/GetProducts";
    const response = await this.axios.get(`${path}?${queryString}`);

    const items = arrayOrEmptyArray(response.data.products).map(product => ({
      ...parseProductItem(product),
      store: storeSelected.name,
    }));

    const newContinuation = response.data.paging.continuationToken
      ? response.data.paging.continuationToken
      : undefined;

    return {
      success: true as const,
      value: {
        items,
        continuation: newContinuation,
      },
    };
  }
}

// Hard flag, TODO: remove when is ready the flag by store
const TIENDA_NUBE_SHOPS_STORE_NAME = "Tiendanube";
const INTEGRATIONS_WITH_DYNAMIC_PROMOTIONS = [TIENDA_NUBE_SHOPS_STORE_NAME];

function parseDopplerEditorSettings(data: unknown): DopplerEditorSettings {
  // See:
  // Doppler.Application.ControlPanelModule.DTO/DtoEditorSetting.cs
  // Doppler.Presentation.MVC/Areas/MSEditor/Controllers/EditorController.cs #GetSettings
  // Doppler.Application.ControlPanelModule/Services/Classes/AccountPreferencesService.cs #GetEditorSettings
  // Doppler.Application.ActionsModule/Services/CampaignService.cs #GetEditorSettings
  // https://github.com/MakingSense/Doppler/pull/10148
  const d = objectOrEmptyObject(data);
  const abandonedCartCampaign = !!d.abandonedCartCampaign;
  const visitedProductsCampaign = !!d.visitedProductsCampaign;
  const confirmationOrderCampaign = !!d.confirmationOrderCampaign;
  const pendingOrderCampaign = !!d.pendingOrderCampaign;
  const bestSellingEnabled = !!d.bestSellingEnabled;
  const newProductsEnabled = !!d.newProductsEnabled;
  const crossSellingEnabled = !!d.crossSellingEnabled;
  const rssCampaign = !!d.rssCampaign;
  const rssShowPreview = !!d.rssShowPreview;
  const isUnlayerExportHTMLEnabled = !!d.isUnlayerExportHTMLEnabled;
  // TODO: analyze to use a store parse
  const stores =
    arrayOrEmptyArray(d.stores)
      .filter(hasName)
      .map((x) => ({
        name: x.name,
        promotionCodeEnabled: x.promotionCodeEnabled || false,
        promotionCodeDynamicEnabled:
          x.promotionCodeDynamicEnabled ||
          (x.promotionCodeEnabled &&
            INTEGRATIONS_WITH_DYNAMIC_PROMOTIONS.includes(x.name)) ||
          false,
        productsEnabled: x.productsEnabled,
        dynamicProductsEnabled: x.dynamicProductsEnabled || false,
        sortingProductsCriteria: x.sortingProductsCriteria,
      })) ?? [];
  const productDynamic = stores.some(
    ({ dynamicProductsEnabled }) => dynamicProductsEnabled,
  );
  return {
    stores,
    abandonedCartCampaign,
    visitedProductsCampaign,
    confirmationOrderCampaign,
    pendingOrderCampaign,
    bestSellingEnabled,
    newProductsEnabled,
    crossSellingEnabled,
    rssCampaign,
    rssShowPreview,
    isUnlayerExportHTMLEnabled,
    productDynamic,
  };
}

function objectOrEmptyObject(value: any): { [key: string]: unknown } {
  return value && typeof value === "object" ? value : {};
}

function arrayOrEmptyArray(
  value: any,
): ({ [key: string]: unknown } | undefined | null)[] {
  return Array.isArray(value) ? value : [];
}

function hasName(x: unknown): x is {
  name: any;
  productsEnabled: boolean;
  dynamicProductsEnabled: boolean;
  DopplerEditorStore: boolean;
  promotionCodeEnabled: boolean;
  promotionCodeDynamicEnabled: boolean;
  sortingProductsCriteria: [];
} {
  return !!(x && (x as any).name);
}

function parsePromoCodeItem({
  code,
  formattedValue,
  type,
  currency,
  value,
}: any = {}): PromoCodeItem {
  return {
    code: `${code}`,
    formattedValue: `${formattedValue}`,
    type: `${type}` as PromoCodeType,
    currency: `${currency}`,
    value: parseFloat(`${value}`),
  };
}

function parseImageItem({
  name,
  lastModifiedDate,
  size,
  type,
  url,
  thumbnailUrl,
  thumbnailUrl150,
}: any) {
  return {
    name: `${name}`,
    lastModifiedDate: parseDate(`${lastModifiedDate}`),
    size: parseInt(size),
    extension: `${type}`,
    url: `${url}`,
    thumbnailUrl: `${thumbnailUrl}`,
    thumbnailUrl150: `${thumbnailUrl150}`,
  };
}

// Based on current response format of Campaigns/Editor/GetImageGallery
// ie. "10/13/2022 02:56:55 PM"
const dateRegex = /^(\d\d)\/(\d\d)\/(\d\d\d\d) (\d\d):(\d\d):(\d\d) (AM|PM)$/;

function parseDate(value: string) {
  const match = value.match(dateRegex);
  if (!match) {
    return new Date();
  }

  const [, month, day, year, hour, minute, second, meridiem] = match;

  const parsedMonth = parseInt(month) - 1;
  const parsedYear = parseInt(year);
  let parsedHour = parseInt(hour);

  if (meridiem === "PM" && parsedHour < 12) {
    parsedHour += 12;
  }

  const asNumber = Date.UTC(
    parsedYear,
    parsedMonth,
    parseInt(day),
    parsedHour,
    parseInt(minute),
    parseInt(second),
  );

  return new Date(asNumber);
}

function parseProductItem({
  ProductUrl,
  ImageUrl,
  Title,
  DefaultPriceText,
  DiscountPriceText,
  DiscountText,
  DescriptionHtml,
  Reference,
  Info,
}: any) {
  return {
    productUrl: `${ProductUrl}`,
    imageUrl: `${ImageUrl}`,
    title: `${Title}`,
    defaultPriceText: `${DefaultPriceText}`,
    discountPriceText: `${DiscountPriceText}`,
    discountText: `${DiscountText}`,
    descriptionHtml: `${DescriptionHtml}`,
    reference: `${Reference}`,
    info: `${Info}`,
  };
}
