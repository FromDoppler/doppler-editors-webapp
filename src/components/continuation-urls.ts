import { useSearchParams } from "react-router-dom";
import { useAppServices } from "./AppServicesContext";

export function useTemplatesContinuationUrls() {
  const defaultUrls = useDefaultTemplateContinuationUrls();
  const nextAndExitUrls = useNextAndExitParametersContinuationUrls();
  return { ...defaultUrls, ...nextAndExitUrls };
}

export function useCampaignContinuationUrls(idCampaign: string) {
  const defaultUrls = useDefaultCampaignContinuationUrls();
  const legacyResolvedUrls = useLegacyCampaignContinuationUrls(idCampaign);
  const nextAndExitUrls = useNextAndExitParametersContinuationUrls();
  return {
    ...defaultUrls,
    ...legacyResolvedUrls,
    ...nextAndExitUrls,
  };
}

export function useContinueUrl({ fallback }: { fallback: string }) {
  const {
    appConfiguration: { dopplerUrlRegex },
  } = useAppServices();
  const [searchParams] = useSearchParams();

  var continueUrl = searchParams.get("continue");

  return continueUrl && dopplerUrlRegex.test(continueUrl)
    ? { continueUrl }
    : { continueUrl: fallback };
}

function useNextAndExitParametersContinuationUrls() {
  const {
    appConfiguration: { dopplerUrlRegex },
  } = useAppServices();
  const [searchParams] = useSearchParams();

  const result: { nextUrl?: string; exitUrl?: string } = {};

  var exitUrl = searchParams.get("exit");
  var nextUrl = searchParams.get("next") || exitUrl;

  if (nextUrl && dopplerUrlRegex.test(nextUrl)) {
    result.nextUrl = nextUrl;
  }

  if (exitUrl && dopplerUrlRegex.test(exitUrl)) {
    result.exitUrl = exitUrl;
  }

  return result;
}

/** Obsolete: we are tending to use exit and next querystring parameters, see DE-932 */
function useLegacyCampaignContinuationUrls(idCampaign: string) {
  const [searchParams] = useSearchParams();

  const {
    appConfiguration: { dopplerLegacyBaseUrl },
  } = useAppServices();

  const redirectedFromSummary =
    searchParams.get("redirectedFromSummary")?.toUpperCase() === "TRUE";

  const idABTest = searchParams.get("idABTest");
  const fixedIdCampaign = idABTest ? idABTest : idCampaign;
  const testABIndexSegment = idABTest ? "TestAB" : "Index";

  const nextUrl = redirectedFromSummary
    ? `${dopplerLegacyBaseUrl}/Campaigns/Summary/${testABIndexSegment}?IdCampaign=${fixedIdCampaign}`
    : `${dopplerLegacyBaseUrl}/Campaigns/Recipients/${testABIndexSegment}?IdCampaign=${fixedIdCampaign}` +
      `&RedirectedFromSummary=False&RedirectedFromTemplateList=False`;

  return { nextUrl };
}

function useDefaultCampaignContinuationUrls() {
  const {
    appConfiguration: { dopplerExternalUrls },
  } = useAppServices();

  return {
    nextUrl: dopplerExternalUrls.campaigns,
    exitUrl: dopplerExternalUrls.campaigns,
  };
}

function useDefaultTemplateContinuationUrls() {
  const {
    appConfiguration: {
      dopplerExternalUrls: { templates: templatesUrl },
    },
  } = useAppServices();

  return { nextUrl: templatesUrl, exitUrl: templatesUrl };
}
