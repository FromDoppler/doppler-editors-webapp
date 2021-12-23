import { AppServices } from "../abstractions";
import { InjectAppServices } from "./AppServicesContext";
import { useAppSessionStateStatus } from "./AppSessionStateContext";

export const SessionDemo = InjectAppServices(
  ({
    appServices: { appSessionStateAccessor },
  }: {
    appServices: AppServices;
  }) => {
    const sessionStateStatus = useAppSessionStateStatus();
    return (
      <>
        <code>
          <pre>
            SessionStateStatus from context: {sessionStateStatus}
            <br />
            SessionState from AppServices:{" "}
            {JSON.stringify(appSessionStateAccessor.current)}
          </pre>
        </code>
        <p>
          SessionState from AppServices could be not rendered updated because
          React does not know when it changes. If we need updated in a React
          component, we can use <code>useAppSessionState()</code>
        </p>
      </>
    );
  }
);
