import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe(Footer.name, () => {
  it("should disable button when selectImage is null", () => {
    // Arrange
    const selectImage = null;

    // Act
    render(<Footer selectImage={selectImage} />);

    // Assert
    const selectButton = screen.getByText("Select Image");
    expect(selectButton).toBeDisabled();
    expect(selectButton.onclick).toBeNull();
  });

  it("should enable button when selectImage is a function and call it on click", () => {
    // Arrange
    const selectImage = jest.fn();

    // Act
    render(<Footer selectImage={selectImage} />);

    // Assert
    const selectButton = screen.getByText("Select Image");
    expect(selectButton).not.toBeDisabled();
    expect(selectImage).not.toBeCalled();

    // Act
    selectButton.click();

    // Assert
    expect(selectImage).toBeCalled();
  });
});
