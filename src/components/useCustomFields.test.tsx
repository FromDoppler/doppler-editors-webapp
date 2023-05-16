import { useState } from "react";
import { Field } from "../abstractions/doppler-rest-api-client";
import { useCustomFields } from "./useCustomFields";
import { act, render } from "@testing-library/react";

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
    render(<TestComponent />);

    // Assert
    const result = getResult();
    expect(result).toBeUndefined();
  });

  it("should return undefined when fields is set as undefined", () => {
    // Arrange
    const { TestComponent, getResult, setFields } = createTestContext();
    render(<TestComponent />);

    // Act
    setFields(undefined);

    // Assert
    const result = getResult();
    expect(result).toBeUndefined();
  });

  it("should return an empty array when fields is set as empty array", () => {
    // Arrange
    const { TestComponent, getResult, setFields } = createTestContext();
    render(<TestComponent />);

    // Act
    setFields([]);

    // Assert
    const result = getResult();
    expect(result).toEqual([]);
  });

  it("should sort names, basic fields alphabetically, custom fields alphabetically", () => {
    // Arrange
    const { TestComponent, getResult, setFields } = createTestContext();
    render(<TestComponent />);

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
      { name: "FirstName", value: "[[[FirstName]]]" },
      { name: "LastName", value: "[[[LastName]]]" },
      { name: "AAA Basic", value: "[[[AAA Basic]]]" },
      { name: "ZZZ Basic", value: "[[[ZZZ Basic]]]" },
      { name: "AAA Custom", value: "[[[AAA Custom]]]" },
      { name: "ZZZ Custom", value: "[[[ZZZ Custom]]]" },
    ]);
  });
});
