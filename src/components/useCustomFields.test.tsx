import { ReactNode, useState } from "react";
import { Field } from "../abstractions/doppler-rest-api-client";
import { useCustomFields } from "./useCustomFields";
import { act, render } from "@testing-library/react";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { IntlProvider } from "react-intl";

const createTestContext = () => {
  let currentSetFields: (_: Field[] | undefined) => void;
  let currentResult:
    | {
        name: string;
        value: string;
      }[]
    | undefined;

  const TestComponent = () => {
    const [fields, setFields] = useState<Field[] | undefined>();
    currentSetFields = setFields;

    currentResult = useCustomFields(fields);
    return <></>;
  };

  return {
    TestComponent,
    setFields: (fields: Field[] | undefined) =>
      act(() => currentSetFields(fields)),
    getResult: () => currentResult,
  };
};

describe(useCustomFields.name, () => {
  it("should return undefined when fields not set", () => {
    // Arrange
    const { TestComponent, getResult } = createTestContext();

    // Act
    render(
      <TestDopplerIntlProvider>
        <TestComponent />
      </TestDopplerIntlProvider>
    );

    // Assert
    const result = getResult();
    expect(result).toBeUndefined();
  });

  it("should return undefined when fields is set as undefined", () => {
    // Arrange
    const { TestComponent, getResult, setFields } = createTestContext();
    render(
      <TestDopplerIntlProvider>
        <TestComponent />
      </TestDopplerIntlProvider>
    );

    // Act
    setFields(undefined);

    // Assert
    const result = getResult();
    expect(result).toBeUndefined();
  });

  it("should return an empty array when fields is set as empty array", () => {
    // Arrange
    const { TestComponent, getResult, setFields } = createTestContext();
    render(
      <TestDopplerIntlProvider>
        <TestComponent />
      </TestDopplerIntlProvider>
    );

    // Act
    setFields([]);

    // Assert
    const result = getResult();
    expect(result).toEqual([]);
  });

  it("should sort names, basic fields alphabetically, custom fields alphabetically", () => {
    // Arrange
    const { TestComponent, getResult, setFields } = createTestContext();
    render(
      <TestDopplerIntlProvider>
        <TestComponent />
      </TestDopplerIntlProvider>
    );

    // Act
    setFields([
      { name: "ZZZ Basic", predefined: true, type: "boolean" },
      { name: "ZZZ Custom", predefined: false, type: "boolean" },
      { name: "AAA Custom", predefined: false, type: "boolean" },
      { name: "AAA Basic", predefined: true, type: "boolean" },
      { name: "LastName", predefined: true, type: "string" },
      { name: "FirstName", predefined: true, type: "string" },
    ]);

    // Assert
    const result = getResult();
    expect(result).toEqual([
      { name: "field_name_firstname", value: "[[[FirstName]]]" },
      { name: "field_name_lastname", value: "[[[LastName]]]" },
      { name: "AAA Basic", value: "[[[AAA Basic]]]" },
      { name: "ZZZ Basic", value: "[[[ZZZ Basic]]]" },
      { name: "AAA Custom", value: "[[[AAA Custom]]]" },
      { name: "ZZZ Custom", value: "[[[ZZZ Custom]]]" },
    ]);
  });

  it("should sort fields based on translated names", () => {
    // Arrange
    const { TestComponent, getResult, setFields } = createTestContext();

    const messages = {
      field_name_gender: "A_gender",
      field_name_birthday: "B_birthday",
      field_name_firstname: "C_firstName",
      field_name_lastname: "D_lastName",
      field_name_email: "E_email",
      field_name_country: "F_country",
    };

    const CustomIntlProvider = ({ children }: { children: ReactNode }) => {
      return (
        <IntlProvider locale="en" messages={messages}>
          {children}
        </IntlProvider>
      );
    };

    render(
      <CustomIntlProvider>
        <TestComponent />
      </CustomIntlProvider>
    );

    // Act
    setFields([
      { name: "birthday", predefined: true, type: "date" },
      { name: "country", predefined: true, type: "country" },
      { name: "firstname", predefined: true, type: "string" },
      { name: "lastname", predefined: true, type: "string" },
      { name: "email", predefined: true, type: "email" },
      { name: "gender", predefined: true, type: "gender" },
    ]);

    // Assert
    const result = getResult();
    expect(result).toEqual([
      {
        name: "C_firstName",
        value: "[[[firstname]]]",
      },
      {
        name: "D_lastName",
        value: "[[[lastname]]]",
      },
      {
        name: "A_gender",
        value: "[[[gender]]]",
      },
      {
        name: "B_birthday",
        value: "[[[birthday]]]",
      },
      {
        name: "E_email",
        value: "[[[email]]]",
      },
      {
        name: "F_country",
        value: "[[[country]]]",
      },
    ]);
  });

  it("should filter fields by type", () => {
    // Arrange
    const { TestComponent, getResult, setFields } = createTestContext();
    render(
      <TestDopplerIntlProvider>
        <TestComponent />
      </TestDopplerIntlProvider>
    );

    // Act
    setFields([
      { name: "consent", predefined: true, type: "cOnsent" },
      { name: "gender", predefined: true, type: "gEnder" },
      { name: "number", predefined: true, type: "nUmber" },
      { name: "permission", predefined: true, type: "pErmission" },
      { name: "phone", predefined: true, type: "pHone" },
      { name: "score", predefined: true, type: "SCORE" },
      { name: "string", predefined: true, type: "STRING" },
      { name: "unknown", predefined: true, type: "unknown" },
      { name: "boolean", predefined: false, type: "boolean" },
      { name: "country", predefined: false, type: "country" },
      { name: "date", predefined: false, type: "date" },
      { name: "email", predefined: false, type: "email" },
      { name: "gdpr", predefined: false, type: "gdpr" },
      { name: "origin", predefined: false, type: "origin" },
      { name: "phone", predefined: false, type: "phone" },
      { name: "real", predefined: false, type: "real" },
    ] as Field[]);

    // Assert
    const result = getResult();
    expect(result).toEqual([
      { name: "field_name_gender", value: "[[[gender]]]" },
      { name: "number", value: "[[[number]]]" },
      { name: "phone", value: "[[[phone]]]" },
      { name: "string", value: "[[[string]]]" },
      { name: "boolean", value: "[[[boolean]]]" },
      { name: "country", value: "[[[country]]]" },
      { name: "date", value: "[[[date]]]" },
      { name: "email", value: "[[[email]]]" },
      { name: "phone", value: "[[[phone]]]" },
    ]);
  });
});
