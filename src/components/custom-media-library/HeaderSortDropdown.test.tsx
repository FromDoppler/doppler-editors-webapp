import { render, screen, waitFor } from "@testing-library/react";
import { TestDopplerIntlProvider } from "../i18n/TestDopplerIntlProvider";
import { HeaderSortDropdown, SortDropdownProps } from "./HeaderSortDropdown";
import { noop } from "../../utils";
import userEvent from "@testing-library/user-event";

const createBaseProps: () => SortDropdownProps = () => ({
  value: { criteria: "DATE", direction: "DESCENDING" },
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

const renderSUT = (sortDropdownProps: SortDropdownProps) => {
  const testId = "sort-dropdown";

  render(
    <TestDopplerIntlProvider>
      <HeaderSortDropdown data-testid={testId} {...sortDropdownProps} />
    </TestDopplerIntlProvider>,
  );

  const dropdown = screen.getByTestId<HTMLSelectElement>(testId);
  return dropdown;
};

describe(HeaderSortDropdown.name, () => {
  it("should have 4 items with the right values and labels", () => {
    // Arrange
    const baseProps = createBaseProps();

    // Act
    const dropdown = renderSUT(baseProps);

    // Assert
    expect(dropdown.value).not.toBeFalsy();
    expect(dropdown.childNodes).toHaveLength(4);
    expectToHaveOptionWith(dropdown, {
      value: "DATE_DESCENDING",
      label: "sort_criteria_DATE_DESCENDING",
    });
    expectToHaveOptionWith(dropdown, {
      value: "DATE_ASCENDING",
      label: "sort_criteria_DATE_ASCENDING",
    });
    expectToHaveOptionWith(dropdown, {
      value: "FILENAME_DESCENDING",
      label: "sort_criteria_FILENAME_DESCENDING",
    });
    expectToHaveOptionWith(dropdown, {
      value: "FILENAME_ASCENDING",
      label: "sort_criteria_FILENAME_ASCENDING",
    });
  });

  it("should select value based on sortingCriteria and sortingDirection", async () => {
    // Arrange
    const baseProps = createBaseProps();
    const sortingCriteria = "FILENAME";
    const sortingDirection = "ASCENDING";
    const expectedValue = "FILENAME_ASCENDING";

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
    const optionLabel = "sort_criteria_FILENAME_ASCENDING";
    const expectedSetCriteria = "FILENAME";
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
