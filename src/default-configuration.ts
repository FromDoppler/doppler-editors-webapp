import { AppConfiguration } from "./abstractions";

export const defaultAppConfiguration: AppConfiguration = {
  basename: undefined,
  keepAliveMilliseconds: 300000,
  // Original WebApp shares the same domain than Editors WebApp. So, it is not
  // necessary to specify the domain, and the path is shared across environments
  loginPageUrl: "/login",
  unlayerProjectId:
    (process.env.REACT_APP_PROJECT_ID &&
      parseInt(process.env.REACT_APP_PROJECT_ID, 10)) ||
    0,
};
