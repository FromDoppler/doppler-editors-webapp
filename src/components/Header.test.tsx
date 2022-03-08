import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe(Header.name, () => {
  it("should rendering", async () => {
    // Arrange
    const componentToRender = document.createElement("header");
    componentToRender.id = "root-header";

    // Act
    render(
      <Header>
        <div>Header rendered</div>
      </Header>,
      {
        container: document.body.appendChild(componentToRender),
      }
    );

    // Assert
    screen.getByText("Header rendered");
  });
});
