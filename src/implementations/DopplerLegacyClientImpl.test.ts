import { AppConfiguration } from "../abstractions";
import { AxiosStatic } from "axios";
import { DopplerLegacyClientImpl } from "./DopplerLegacyClientImpl";
import {
  SortingImagesCriteria,
  SortingImagesDirection,
} from "../abstractions/doppler-legacy-client";

const baseUrl = "https://app2.dopplerfiles.com/Users/88469/Originals";

function createTestContext({
  dopplerLegacyBaseUrl = "",
}: { dopplerLegacyBaseUrl?: string } = {}) {
  const windowDouble = {
    console: {
      error: jest.fn(),
    },
  };

  const appConfiguration = {
    dopplerLegacyBaseUrl,
  } as AppConfiguration;

  const get = jest.fn(() =>
    Promise.resolve({
      data: { images: [] } as any,
    }),
  );

  const postForm = jest.fn((_url: string, _data?: any) =>
    Promise.resolve({ data: { success: true } }),
  );

  const create = jest.fn(() => ({
    get,
    postForm,
  }));

  const axiosStatic = {
    create,
  } as unknown as AxiosStatic;

  const sut = new DopplerLegacyClientImpl({
    axiosStatic,
    appConfiguration,
    window: windowDouble as any,
  } as any);
  return {
    sut,
    axiosCreate: create,
    axiosGet: get,
    axiosPostForm: postForm,
    windowDouble,
  };
}

describe(DopplerLegacyClientImpl.name, () => {
  describe("getImageGallery", () => {
    it("Should request backend and parse response", async () => {
      // Arrange
      const dopplerLegacyBaseUrl = "dopplerLegacyBaseUrl";
      const searchTerm = "searchTerm";
      const sortingCriteria = "DATE";
      const sortingDirection = "DESCENDING";
      const continuation = "5";
      const expectedUrl =
        "/Campaigns/Editor/GetImageGallery" +
        "?isAscending=false&offset=50&position=5&query=searchTerm&sortingCriteria=DATE";

      // cSpell:disable
      const getApiResponse = {
        images: [
          {
            name: "sombrerito(1).jpg",
            lastModifiedDate: "03/09/2023 05:57:07 PM",
            size: "132165",
            type: ".jpg",
            url: `${baseUrl}/sombrerito(1).jpg`,
            thumbnailUrl: `${baseUrl}/mcith/mcith_sombrerito(1).jpg`,
            thumbnailUrl150: `${baseUrl}/mcith/sombrerito(1).jpg`,
          },
          {
            name: "sombrerito.jpg",
            lastModifiedDate: "10/13/2022 02:56:55 AM",
            size: "111745",
            type: ".jpg",
            url: `${baseUrl}/sombrerito.jpg`,
            thumbnailUrl: `${baseUrl}/mcith/mcith_sombrerito.jpg`,
            thumbnailUrl150: `${baseUrl}/mcith/sombrerito.jpg`,
          },
          {
            name: "2022-02-22_15-49-20.png",
            lastModifiedDate: "02/22/2022 06:50:03 PM",
            size: "2640",
            type: ".png",
            url: `${baseUrl}/2022-02-22_15-49-20.png`,
            thumbnailUrl: `${baseUrl}/mcith/mcith_2022-02-22_15-49-20.png`,
            thumbnailUrl150: `${baseUrl}/mcith/2022-02-22_15-49-20.png`,
          },
        ],
        count: 8,
      };

      const expectedResultValue = {
        items: [
          {
            extension: ".jpg",
            lastModifiedDate: new Date("2023-03-09T17:57:07.000Z"),
            name: "sombrerito(1).jpg",
            size: 132165,
            thumbnailUrl: `${baseUrl}/mcith/mcith_sombrerito(1).jpg`,
            thumbnailUrl150: `${baseUrl}/mcith/sombrerito(1).jpg`,
            url: `${baseUrl}/sombrerito(1).jpg`,
          },
          {
            extension: ".jpg",
            lastModifiedDate: new Date("2022-10-13T02:56:55.000Z"),
            name: "sombrerito.jpg",
            size: 111745,
            thumbnailUrl: `${baseUrl}/mcith/mcith_sombrerito.jpg`,
            thumbnailUrl150: `${baseUrl}/mcith/sombrerito.jpg`,
            url: `${baseUrl}/sombrerito.jpg`,
          },
          {
            extension: ".png",
            lastModifiedDate: new Date("2022-02-22T18:50:03.000Z"),
            name: "2022-02-22_15-49-20.png",
            size: 2640,
            thumbnailUrl: `${baseUrl}/mcith/mcith_2022-02-22_15-49-20.png`,
            thumbnailUrl150: `${baseUrl}/mcith/2022-02-22_15-49-20.png`,
            url: `${baseUrl}/2022-02-22_15-49-20.png`,
          },
        ],
        continuation: undefined,
      };
      // cSpell:enable

      const { sut, axiosCreate, axiosGet } = createTestContext({
        dopplerLegacyBaseUrl,
      });

      axiosGet.mockResolvedValue({ data: getApiResponse });

      // Act
      const result = await sut.getImageGallery({
        searchTerm,
        sortingCriteria,
        sortingDirection,
        continuation,
      });

      // Assert
      expect(axiosCreate).toBeCalledWith({
        baseURL: dopplerLegacyBaseUrl,
        withCredentials: true,
      });
      expect(axiosGet).toBeCalledWith(expectedUrl);

      expect(result).toEqual({
        success: true,
        value: expectedResultValue,
      });
    });

    it.each<{
      searchTerm: string;
      sortingCriteria: SortingImagesCriteria;
      sortingDirection: SortingImagesDirection;
      expectedQueryString: string;
    }>([
      {
        searchTerm: '%search "term"!',
        sortingCriteria: "DATE",
        sortingDirection: "DESCENDING",
        expectedQueryString:
          "?isAscending=false&offset=50&position=0&query=%25search+%22term%22%21&sortingCriteria=DATE",
      },
      {
        searchTerm: "",
        sortingCriteria: "DATE",
        sortingDirection: "DESCENDING",
        expectedQueryString:
          "?isAscending=false&offset=50&position=0&query=&sortingCriteria=DATE",
      },
      {
        searchTerm: "",
        sortingCriteria: "DATE",
        sortingDirection: "ASCENDING",
        expectedQueryString:
          "?isAscending=true&offset=50&position=0&query=&sortingCriteria=DATE",
      },
      {
        searchTerm: "",
        sortingCriteria: "FILENAME",
        sortingDirection: "DESCENDING",
        expectedQueryString:
          "?isAscending=false&offset=50&position=0&query=&sortingCriteria=FILENAME",
      },
      {
        searchTerm: "",
        sortingCriteria: "FILENAME",
        sortingDirection: "ASCENDING",
        expectedQueryString:
          "?isAscending=true&offset=50&position=0&query=&sortingCriteria=FILENAME",
      },
    ])(
      "Should accept parameters",
      async ({ expectedQueryString, ...parameters }) => {
        const { sut, axiosGet } = createTestContext();

        // Act
        await sut.getImageGallery(parameters);

        // Assert
        expect(axiosGet).toBeCalledWith(
          expect.stringContaining(expectedQueryString),
        );
      },
    );

    it("Should calculate next continuation based on current continuation, items and count", async () => {
      // Arrange
      const continuation = "20";
      const responseImages = [{}, {}, {}];
      const responseCount = 50;
      const apiResponse = {
        images: responseImages,
        count: responseCount,
      };
      const expectedContinuation = "23";

      const { sut, axiosGet } = createTestContext();

      axiosGet.mockResolvedValue({ data: apiResponse });

      // Act
      const result = await sut.getImageGallery({
        searchTerm: "searchTerm",
        sortingCriteria: "DATE",
        sortingDirection: "DESCENDING",
        continuation,
      });

      expect(result.value).toEqual(
        expect.objectContaining({
          continuation: expectedContinuation,
        }),
      );
    });

    it("Should accept undefined continuation", async () => {
      // Arrange
      const searchTerm = "searchTerm";
      const sortingCriteria = "DATE";
      const sortingDirection = "DESCENDING";
      const expectedUrl =
        "/Campaigns/Editor/GetImageGallery" +
        "?isAscending=false&offset=50&position=0&query=searchTerm&sortingCriteria=DATE";

      const { sut, axiosGet } = createTestContext();

      // Act
      await sut.getImageGallery({
        searchTerm,
        sortingCriteria,
        sortingDirection,
      });

      // Assert
      expect(axiosGet).toBeCalledWith(expectedUrl);
    });
  });

  describe("uploadFile", () => {
    it("Should request backend", async () => {
      // Arrange
      const dopplerLegacyBaseUrl = "dopplerLegacyBaseUrl";
      const { sut, axiosCreate, axiosPostForm } = createTestContext({
        dopplerLegacyBaseUrl,
      });
      const file = { my: "file" } as any;

      // Act
      const result = await sut.uploadImage(file);

      // Assert
      expect(axiosCreate).toBeCalledWith({
        baseURL: dopplerLegacyBaseUrl,
        withCredentials: true,
      });
      expect(axiosPostForm).toBeCalledWith("/Campaigns/Editor/UploadImage", {
        file,
      });
      expect(result).toEqual({
        success: true,
      });
    });
  });

  describe("uploadImageCampaign", () => {
    it("Should request backend", async () => {
      // Arrange
      const dopplerLegacyBaseUrl = "dopplerLegacyBaseUrl";
      const { sut, axiosCreate, axiosPostForm } = createTestContext({
        dopplerLegacyBaseUrl,
      });
      const file = new File(["file content"], "test.png", {
        type: "image/png",
      }) as File;

      // Act
      const result = await sut.uploadImageCampaign(file);

      // Assert
      expect(axiosCreate).toBeCalledWith({
        baseURL: dopplerLegacyBaseUrl,
        withCredentials: true,
      });
      expect(axiosPostForm).toBeCalledWith(
        "/Campaigns/Editor/UploadImageCampaign",
        {
          file,
        },
      );
      expect(result).toEqual({
        success: true,
        value: {
          url: "",
        },
      });
    });
  });

  describe("deleteImages", () => {
    it("should request backend", async () => {
      // Arrange
      const dopplerLegacyBaseUrl = "dopplerLegacyBaseUrl";
      const { sut, axiosCreate, axiosPostForm } = createTestContext({
        dopplerLegacyBaseUrl,
      });
      const items = [{ name: "file1" }, { name: "file2" }, { name: "file3" }];
      const expectedRequestsURL = "/Campaigns/Editor/RemoveImage";
      const expectedRequestBody1 = { fileName: "file1" };
      const expectedRequestBody2 = { fileName: "file2" };
      const expectedRequestBody3 = { fileName: "file3" };

      // Act
      const result = await sut.deleteImages(items);

      // Assert
      expect(axiosCreate).toBeCalledWith({
        baseURL: dopplerLegacyBaseUrl,
        withCredentials: true,
      });
      expect(axiosPostForm).toBeCalledTimes(3);
      expect(axiosPostForm).toBeCalledWith(
        expectedRequestsURL,
        expectedRequestBody1,
      );
      expect(axiosPostForm).toBeCalledWith(
        expectedRequestsURL,
        expectedRequestBody2,
      );
      expect(axiosPostForm).toBeCalledWith(
        expectedRequestsURL,
        expectedRequestBody3,
      );
      expect(result).toEqual({
        success: true,
      });
    });

    it("should continue on errors", async () => {
      // Arrange
      const dopplerLegacyBaseUrl = "dopplerLegacyBaseUrl";
      const { sut, axiosCreate, axiosPostForm, windowDouble } =
        createTestContext({
          dopplerLegacyBaseUrl,
        });
      const items = [{ name: "file1" }, { name: "file2" }, { name: "file3" }];
      const filenameOk = "file3";

      axiosPostForm.mockImplementation((_url, data) =>
        data.fileName === filenameOk
          ? Promise.resolve({ data: { success: true } })
          : Promise.reject(),
      );

      // Act
      const result = await sut.deleteImages(items);

      // Assert
      expect(axiosCreate).toBeCalledWith({
        baseURL: dopplerLegacyBaseUrl,
        withCredentials: true,
      });
      expect(axiosPostForm).toBeCalledTimes(3);
      expect(windowDouble.console.error).toBeCalledTimes(2);
      expect(result).toEqual({
        success: true,
      });
    });
  });

  describe("getEditorSettings", () => {
    it("Should do the right request", async () => {
      // Arrange
      const dopplerLegacyBaseUrl = "dopplerLegacyBaseUrl";

      const { sut, axiosCreate, axiosGet } = createTestContext({
        dopplerLegacyBaseUrl,
      });

      axiosGet.mockResolvedValue({ data: {} });

      // Act
      await sut.getEditorSettings();

      // Assert
      expect(axiosCreate).toBeCalledWith({
        baseURL: dopplerLegacyBaseUrl,
        withCredentials: true,
      });
      expect(axiosGet).toBeCalledWith(
        "/MSEditor/Editor/GetSettings?idCampaign=0&idTemplate=0",
      );
    });

    it.each([
      { data: undefined },
      { data: null },
      { data: {} },
      { data: false },
      { data: 5 },
      { data: "ERROR" },
    ])("Should parse invalid responses", async ({ data }) => {
      // Arrange
      const dopplerLegacyBaseUrl = "dopplerLegacyBaseUrl";

      const { sut, axiosGet } = createTestContext({
        dopplerLegacyBaseUrl,
      });

      axiosGet.mockResolvedValue({ data });

      // Act
      const result = await sut.getEditorSettings();

      // Assert
      expect(result).toEqual({
        success: true,
        value: {
          stores: [],
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
        },
      });
    });

    it.each([
      {
        data: {
          stores: [],
          promotionCodeEnabled: false,
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
        },
        expectedResult: {
          stores: [],
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
        },
      },
      {
        data: {
          abandonedCartCampaign: true,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
          stores: [
            {
              name: "MercadoShops",
              accessToken: "123",
              storeId: "456",
              productsEnabled: true,
              sortingProductsCriteria: [],
            },
            {
              name: "Tiendanube",
              accessToken: "789",
              storeId: "101112",
              productsEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
          promotionCodeEnabled: false,
        },
        expectedResult: {
          abandonedCartCampaign: true,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
          stores: [
            {
              name: "MercadoShops",
              productsEnabled: true,
              promotionCodeEnabled: false,
              sortingProductsCriteria: [],
            },
            {
              name: "Tiendanube",
              productsEnabled: false,
              promotionCodeEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
        },
      },
      {
        data: {
          abandonedCartCampaign: false,
          visitedProductsCampaign: true,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
          stores: [
            {
              name: "MercadoShops",
              accessToken: "123",
              storeId: "456",
              productsEnabled: true,
              sortingProductsCriteria: [],
            },
            {
              name: "Tiendanube",
              accessToken: "789",
              storeId: "101112",
              productsEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
          promotionCodeEnabled: false,
        },
        expectedResult: {
          abandonedCartCampaign: false,
          visitedProductsCampaign: true,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
          stores: [
            {
              name: "MercadoShops",
              productsEnabled: true,
              promotionCodeEnabled: false,
              sortingProductsCriteria: [],
            },
            {
              name: "Tiendanube",
              productsEnabled: false,
              promotionCodeEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
        },
      },
      {
        data: {
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: true,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
          stores: [
            {
              name: "Tiendanube",
              accessToken: "789",
              storeId: "101112",
              productsEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
          promotionCodeEnabled: false,
        },
        expectedResult: {
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: true,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
          stores: [
            {
              name: "Tiendanube",
              productsEnabled: false,
              promotionCodeEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
        },
      },
      {
        data: {
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: true,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
          stores: [
            {
              name: "Tiendanube",
              accessToken: "789",
              storeId: "101112",
              productsEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
          promotionCodeEnabled: false,
        },
        expectedResult: {
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: true,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
          stores: [
            {
              name: "Tiendanube",
              productsEnabled: false,
              promotionCodeEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
        },
      },
      {
        data: {
          stores: [
            {
              name: "MercadoShops",
              accessToken: "123",
              storeId: "456",
              productsEnabled: true,
              sortingProductsCriteria: [],
            },
            {
              name: "Tiendanube",
              accessToken: "789",
              storeId: "101112",
              productsEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
          promotionCodeEnabled: true,
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
        },
        expectedResult: {
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: false,
          rssShowPreview: false,
          stores: [
            {
              name: "MercadoShops",
              promotionCodeEnabled: true,
              productsEnabled: true,
              sortingProductsCriteria: [],
            },
            {
              name: "Tiendanube",
              promotionCodeEnabled: false,
              productsEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
        },
      },
      {
        data: {
          stores: [
            {
              name: "MercadoShops",
              accessToken: "123",
              storeId: "456",
              productsEnabled: true,
              sortingProductsCriteria: [],
            },
            {
              name: "Tiendanube",
              accessToken: "789",
              storeId: "101112",
              productsEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
          promotionCodeEnabled: true,
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: true,
          rssShowPreview: false,
        },
        expectedResult: {
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: true,
          rssShowPreview: false,
          stores: [
            {
              name: "MercadoShops",
              promotionCodeEnabled: true,
              productsEnabled: true,
              sortingProductsCriteria: [],
            },
            {
              name: "Tiendanube",
              promotionCodeEnabled: false,
              productsEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
        },
      },
      {
        data: {
          stores: [
            {
              name: "MercadoShops",
              accessToken: "123",
              storeId: "456",
              productsEnabled: true,
              sortingProductsCriteria: [],
            },
            {
              name: "Tiendanube",
              accessToken: "789",
              storeId: "101112",
              productsEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
          promotionCodeEnabled: true,
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: true,
          rssShowPreview: true,
        },
        expectedResult: {
          abandonedCartCampaign: false,
          visitedProductsCampaign: false,
          pendingOrderCampaign: false,
          confirmationOrderCampaign: false,
          bestSellingEnabled: false,
          newProductsEnabled: false,
          crossSellingEnabled: false,
          rssCampaign: true,
          rssShowPreview: true,
          stores: [
            {
              name: "MercadoShops",
              promotionCodeEnabled: true,
              productsEnabled: true,
              sortingProductsCriteria: [],
            },
            {
              name: "Tiendanube",
              promotionCodeEnabled: false,
              productsEnabled: false,
              sortingProductsCriteria: [],
            },
          ],
        },
      },
    ])("Should parse valid responses", async ({ data, expectedResult }) => {
      // Arrange
      const dopplerLegacyBaseUrl = "dopplerLegacyBaseUrl";

      const { sut, axiosGet } = createTestContext({
        dopplerLegacyBaseUrl,
      });

      axiosGet.mockResolvedValue({ data });

      // Act
      const result = await sut.getEditorSettings();

      // Assert
      expect(result).toEqual({ success: true, value: expectedResult });
    });
  });

  describe("getPromoCodes", () => {
    it("should return empty result without calling backend when store is not MercadoShops", async () => {
      // Arrange
      const { sut, axiosGet } = createTestContext();
      const store = "Tiendanube";

      // Act
      const result = await sut.getPromoCodes({ store });

      // Assert
      expect(result).toEqual({ success: true, value: [] });
      expect(axiosGet).not.toBeCalled();
    });

    it("should call backend when store is MercadoShops", async () => {
      // Arrange
      const { sut, axiosGet } = createTestContext();
      const store = "MercadoShops";

      // Act
      await sut.getPromoCodes({ store });

      // Assert
      expect(axiosGet).toBeCalledWith(
        "/MSEditor/Editor/GetMercadoShopsPromotions",
      );
    });

    it("should map the backend result", async () => {
      // Arrange
      const { sut, axiosGet } = createTestContext();
      const store = "MercadoShops";
      const serverResponse = [
        {
          Id: "10591761",
          Name: "NombrePromoción",
          Status: "ACTIVE",
          Type: "coupon",
          StartDate: "2023-08-01T17:56:36.000+00:00",
          EndDate: "2023-09-02T02:59:59.000+00:00",
          Target: "ALL_PRODUCTS",
          DiscountType: "percent",
          Value: "30",
          shop_id: "196181385",
          Code: "CODE",
          use_limit: "1",
          MinPaymentAmount: "10000",
        },
        {
          Name: "Mínimo",
          Type: "coupon",
          Value: "10",
          Code: "min-data",
        },
      ] as const;
      const expectedResult = [
        {
          code: "CODE",
          endDate: new Date("2023-09-02T02:59:59.000Z"),
          isActive: true,
          minPaymentAmount: 10000,
          promotionName: "NombrePromoción",
          startDate: new Date("2023-08-01T17:56:36.000Z"),
          type: "percent",
          useLimit: 1,
          value: 30,
        },
        {
          code: "min-data",
          endDate: undefined,
          isActive: false,
          minPaymentAmount: 0,
          promotionName: "Mínimo",
          startDate: undefined,
          type: "money",
          useLimit: undefined,
          value: 10,
        },
      ] as const;
      axiosGet.mockResolvedValue({ data: serverResponse });

      // Act
      const result = await sut.getPromoCodes({ store });

      // Assert
      expect(result).toEqual({ success: true, value: expectedResult });
    });
  });
});
