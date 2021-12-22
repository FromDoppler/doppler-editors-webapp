import { AppServices } from "../abstractions/services";
import { InjectAppServices } from "./AppServicesContext";

export const ConfigurationDemo = InjectAppServices(
  ({
    appServices: { appConfigurationRenderer },
  }: {
    appServices: AppServices;
  }) => {
    const configurationAsJson = appConfigurationRenderer.render();
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Configuration content</h2>
        <code>
          <pre>{configurationAsJson}</pre>
        </code>
      </main>
    );
  }
);
