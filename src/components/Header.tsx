import { PortalComponent } from "./PortalComponent";

export const Header = ({ children }: any) => {
  return <PortalComponent id="root-header">{children}</PortalComponent>;
};
