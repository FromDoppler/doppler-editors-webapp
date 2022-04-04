import { useAppServices } from "./AppServicesContext";
import { useAppSessionState } from "./AppSessionStateContext";

export const SessionDemo = () => {
  const { appSessionStateAccessor } = useAppServices();
  const sessionState = useAppSessionState();
  return (
    <>
      <code>
        <pre>
          SessionStateStatus from context: {sessionState.status}
          <br />
          SimplifiedSessionState from context: {JSON.stringify(sessionState)}
          <br />
          SessionState from AppServices:{" "}
          {JSON.stringify(appSessionStateAccessor.getCurrentSessionState())}
        </pre>
      </code>
      <p>
        SessionState from AppServices could be not rendered updated because
        React does not know when it changes. If we need updated in a React
        component, we can use <code>useAppSessionState()</code>
      </p>
    </>
  );
};
