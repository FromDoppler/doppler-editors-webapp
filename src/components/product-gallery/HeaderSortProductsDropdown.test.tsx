import { render, screen, waitFor } from "@testing-library/react";
import { TestDopplerIntlProvider } from "../i18n/TestDopplerIntlProvider";
import {
  HeaderSortProductsDropdown,
  SortProductsDropdownProps,
} from "./HeaderSortProductsDropdown";
import { noop } from "../../utils";
import userEvent from "@testing-library/user-event";

const createBaseProps: () => SortProductsDropdownProps = () => ({
  value: { criteria: "PRICE", direction: "DESCENDING" },
  storeSelected: {
    name: `TiendaNube`,
    promotionCodeEnabled: false,
    productsEnabled: true,
    sortingProductsCriteria: ["PRICE"],
  },
  setValue: noop,
});

const expectToHaveOptionWith = (
  select: HTMLSelectElement,
  { value, label }: { value: string; label: string },
) => {
  const option = select.querySelector<HTMLOptionElement>(
    `option[value=${value}]`,
  );
  expect(option).not.toBeNull();
  expect(option?.label).toBe(label);
};

const renderSUT = (sortDropdownProps: SortProductsDropdownProps) => {
  const testId = "sort-dropdown";

  render(
    <TestDopplerIntlProvider>
      <HeaderSortProductsDropdown data-testid={testId} {...sortDropdownProps} />
    </TestDopplerIntlProvider>,
  );

  const dropdown = screen.getByTestId<HTMLSelectElement>(testId);
  return dropdown;
};

describe(HeaderSortProductsDropdown.name, () => {
  it("should have 4 items with the right values and labels", () => {
    // Arrange
    const baseProps = createBaseProps();

    // Act
    const dropdown = renderSUT(baseProps);

    // Assert
    expect(dropdown.value).not.toBeFalsy();
    expect(dropdown.childNodes).toHaveLength(2);
    expectToHaveOptionWith(dropdown, {
      value: "PRICE__ASCENDING",
      label: "sort_criteria_PRICE__ASCENDING",
    });
    expectToHaveOptionWith(dropdown, {
      value: "PRICE__DESCENDING",
      label: "sort_criteria_PRICE__DESCENDING",
    });
  });

  it("should select value based on sortingCriteria and sortingDirection", async () => {
    // Arrange
    const baseProps = createBaseProps();
    const sortingCriteria = "PRICE";
    const sortingDirection = "ASCENDING";
    const expectedValue = "PRICE__ASCENDING";

    // Act
    const dropdown = renderSUT({
      ...baseProps,
      value: { criteria: sortingCriteria, direction: sortingDirection },
    });

    // Assert
    await waitFor(() => {
      expect(dropdown.value).toBe(expectedValue);
    });
  });

  it("should execute setSortingCriteria and setSortingDirection based on selected option", async () => {
    // Arrange
    const baseProps = createBaseProps();
    const setValue = jest.fn();
    const optionLabel = "sort_criteria_PRICE__ASCENDING";
    const expectedSetCriteria = "PRICE";
    const expectedSetDirection = "ASCENDING";

    const dropdown = renderSUT({
      ...baseProps,
      setValue,
    });
    const filenameAscendingOption = dropdown.querySelector<HTMLOptionElement>(
      `option[label=${optionLabel}]`,
    );

    // Act
    await userEvent.selectOptions(dropdown, filenameAscendingOption!);

    // Assert
    expect(setValue).toBeCalledWith({
      criteria: expectedSetCriteria,
      direction: expectedSetDirection,
    });
  });
});
