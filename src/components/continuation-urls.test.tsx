import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppServices } from "../abstractions";
import { AppServicesProvider } from "./AppServicesContext";
import {
  useCampaignContinuationUrls,
  useTemplatesContinuationUrls,
} from "./continuation-urls";

type ContinuationUrlsResult = { nextUrl?: string; exitUrl?: string };

function buildTestScenario({
  currentRouterEntry,
  dopplerLegacyBaseUrl,
  campaignsExternalUrl,
  useHookUnderTesting,
}: {
  currentRouterEntry: string;
  dopplerLegacyBaseUrl: string;
  campaignsExternalUrl: string;
  useHookUnderTesting: () => ContinuationUrlsResult;
}) {
  let result: ContinuationUrlsResult = {};

  const TestComponent = () => {
    result = useHookUnderTesting();
    return <>TestComponent</>;
  };

  const renderAndGetContinuationUrls = () => {
    render(
      <MemoryRouter initialEntries={[currentRouterEntry]}>
        <AppServicesProvider
          appServices={
            {
              appConfiguration: {
                dopplerLegacyBaseUrl,
                dopplerExternalUrls: { campaigns: campaignsExternalUrl },
              },
            } as AppServices
          }
        >
          <TestComponent />
        </AppServicesProvider>
      </MemoryRouter>
    );
    return result;
  };

  return {
    renderAndGetContinuationUrls,
  };
}

const dopplerLegacyBaseUrl = "https://app.legacyBaseUrl.fromdoppler.net";
const idCampaign = "123";
const campaignsExternalUrl =
  "https://app.legacyBaseUrl.fromdoppler.net/Campaigns/Draft/";

describe(useTemplatesContinuationUrls.name, () => {
  it.each([
    {
      scenario: "querystring is empty",
      currentRouterEntry: "https://webapp.formdoppler.net/editor",
      expectedNextUrl:
        "https://app.legacyBaseUrl.fromdoppler.net/Templates/Main",
      expectedExitUrl:
        "https://app.legacyBaseUrl.fromdoppler.net/Templates/Main",
    },
  ])(
    "should return continuation URLs based on querystring parameters when $scenario",
    ({ currentRouterEntry, expectedNextUrl, expectedExitUrl }) => {
      // Arrange
      const { renderAndGetContinuationUrls } = buildTestScenario({
        currentRouterEntry,
        dopplerLegacyBaseUrl,
        campaignsExternalUrl,
        useHookUnderTesting: useTemplatesContinuationUrls,
      });

      // Act
      const { nextUrl, exitUrl } = renderAndGetContinuationUrls();

      // Assert
      expect(nextUrl).toBe(expectedNextUrl);
      expect(exitUrl).toBe(expectedExitUrl);
    }
  );
});

describe(useCampaignContinuationUrls.name, () => {
  it.each([
    {
      scenario: "querystring is empty",
      currentRouterEntry: "https://webapp.formdoppler.net/editor",
      expectedNextUrl:
        "https://app.legacyBaseUrl.fromdoppler.net/Campaigns/Recipients/Index" +
        "?IdCampaign=123&RedirectedFromSummary=False&RedirectedFromTemplateList=False",
      expectedExitUrl: campaignsExternalUrl,
    },
    {
      scenario: "redirectedFromSummary is true",
      currentRouterEntry:
        "https://webapp.formdoppler.net/editor?redirectedFromSummary=true",
      expectedNextUrl:
        "https://app.legacyBaseUrl.fromdoppler.net/Campaigns/Summary/Index?IdCampaign=123",
      expectedExitUrl: campaignsExternalUrl,
    },
    {
      scenario: "redirectedFromSummary is true and idABTest is set",
      currentRouterEntry:
        "https://webapp.formdoppler.net/editor?redirectedFromSummary=true&idABTest=456",
      expectedNextUrl:
        "https://app.legacyBaseUrl.fromdoppler.net/Campaigns/Summary/TestAB?IdCampaign=456",
      expectedExitUrl: campaignsExternalUrl,
    },
    {
      scenario: "idABTest is set",
      currentRouterEntry: "https://webapp.formdoppler.net/editor?idABTest=456",
      expectedNextUrl:
        "https://app.legacyBaseUrl.fromdoppler.net/Campaigns/Recipients/TestAB" +
        "?IdCampaign=456&RedirectedFromSummary=False&RedirectedFromTemplateList=False",
      expectedExitUrl: campaignsExternalUrl,
    },
  ])(
    "should return continuation URLs based on querystring parameters when $scenario",
    ({ currentRouterEntry, expectedNextUrl, expectedExitUrl }) => {
      // Arrange
      const { renderAndGetContinuationUrls } = buildTestScenario({
        currentRouterEntry,
        dopplerLegacyBaseUrl,
        campaignsExternalUrl,
        useHookUnderTesting: () => useCampaignContinuationUrls(idCampaign),
      });

      // Act
      const { nextUrl, exitUrl } = renderAndGetContinuationUrls();

      // Assert
      expect(nextUrl).toBe(expectedNextUrl);
      expect(exitUrl).toBe(expectedExitUrl);
    }
  );
});
