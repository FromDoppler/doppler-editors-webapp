import { render, screen } from "@testing-library/react";
import { PortalComponent } from "./PortalComponent";

describe(PortalComponent.name, () => {
  it("should render a component using portal", async () => {
    // Arrange

    const componentToRender = document.createElement("div");
    componentToRender.id = "container-test-id";

    // Act
    render(
      <PortalComponent id="container-test-id">
        <div>Component rendered</div>
      </PortalComponent>,
      {
        container: document.body.appendChild(componentToRender),
      }
    );

    // Assert
    screen.getByText("Component rendered");
  });

  it("show error if container id doesn't exist", async () => {
    // Arrange
    const error = new Error(
      `The element with id=container-test-id wasn't found`
    );
    // Act
    const renderPortal = () =>
      render(
        <PortalComponent id="container-test-id">
          <div>Component rendered</div>
        </PortalComponent>
      );

    // Assert
    expect(renderPortal).toThrow(error);
  });
});
