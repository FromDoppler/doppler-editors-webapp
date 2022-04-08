import { DopplerIntlProvider } from "./DopplerIntlProvider";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { FormattedMessage } from "react-intl";

describe("DopplerIntlProvider", () => {
  it("should render Campaign in English", () => {
    const { getByText } = render(
      <DopplerIntlProvider locale="en">
        <FormattedMessage id="campaign" />
      </DopplerIntlProvider>
    );
    getByText("Campaign");
  });

  it("should render Campaign in Spanish", () => {
    const { getByText } = render(
      <DopplerIntlProvider locale="es">
        <FormattedMessage id="campaign" />
      </DopplerIntlProvider>
    );
    getByText("Campaña");
  });

  it("should render Campaign in Spanish when language is unexpected", () => {
    const { getByText } = render(
      <DopplerIntlProvider locale="fr">
        <FormattedMessage id="campaign" />
      </DopplerIntlProvider>
    );
    getByText("Campaña");
  });
});
