import { MfeLoaderAssetManifestClientImpl } from "./MfeLoaderAssetManifestClientImpl";

describe(MfeLoaderAssetManifestClientImpl.name, () => {
  describe("getEntrypoints", () => {
    it("should use assetServices as it is", async () => {
      // Arrange
      const manifestURL = "a";
      const assetServicesResult = ["a.js", "b.css", "c", "d.js"];
      const expectedResult = {
        js: ["a.js", "d.js"],
      };

      const windowDouble = {
        assetServices: {
          getEntrypoints: jest.fn(),
        },
      };
      windowDouble.assetServices.getEntrypoints.mockResolvedValue(
        assetServicesResult
      );

      const sut = new MfeLoaderAssetManifestClientImpl({
        window: windowDouble,
      });

      // Act
      const result = await sut.getEntrypoints({ manifestURL });

      // Assert
      expect(windowDouble.assetServices.getEntrypoints).toBeCalledWith({
        manifestURL,
      });
      expect(result).toEqual({ success: true, value: expectedResult });
    });
  });
});
