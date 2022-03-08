import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe(Footer.name, () => {
  it("should rendering", async () => {
    // Arrange
    const componentToRender = document.createElement("footer");
    componentToRender.id = "root-footer";

    // Act
    render(
      <Footer>
        <div>Footer rendered</div>
      </Footer>,
      {
        container: document.body.appendChild(componentToRender),
      }
    );

    // Assert
    screen.getByText("Footer rendered");
  });
});
