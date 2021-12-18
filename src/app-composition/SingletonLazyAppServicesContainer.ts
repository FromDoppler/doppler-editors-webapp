import { AppServices } from "../app-services";

type FactoriesObject<Type> = {
  [Property in keyof Type as `${string & Property}Factory`]: (
    appServices: AppServices
  ) => Type[Property];
};

export class SingletonLazyAppServicesContainer implements AppServices {
  private readonly _instances: Partial<AppServices> = {};
  private readonly _factories: FactoriesObject<AppServices>;

  constructor(factories: FactoriesObject<AppServices>) {
    this._factories = { ...factories };
  }

  private singleton<N extends keyof AppServices, T extends AppServices[N]>(
    name: N
  ): T {
    if (!this._instances[name]) {
      this._instances[name] = this._factories[`${name}Factory`](this) as T; // I know that this is the same type
    }
    return this._instances[name] as T;
  }

  // TODO: generate these properties automatically
  get window() {
    return this.singleton("window");
  }

  get appConfiguration() {
    return this.singleton("appConfiguration");
  }
}
