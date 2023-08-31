import { ToolConfig, Tabs, Theme } from "state/types/index";
import { UnlayerOptions } from "react-email-editor";

export type ExtendedUnlayerOptions = Omit<UnlayerOptions, "appearance"> & {
  // interface Config in module "embed/Config" has object the type for this property
  features: ExtendedFeatures;
  // interface Config in module "embed/Config" has no predefined-names for the tabs
  tabs?: {
    body?: ExtendedUnlayerTabOptions;
    content?: ExtendedUnlayerTabOptions;
    blocks?: ExtendedUnlayerTabOptions;
    images?: ExtendedUnlayerTabOptions;
    uploads?: ExtendedUnlayerTabOptions;
    row?: ExtendedUnlayerTabOptions;
    audit?: ExtendedUnlayerTabOptions;
  };
  tools?: {
    readonly [key: string]: ExtendedToolConfig;
  };
  // interface Config in module "embed/Config" has object the type for this property
  editor?: ExtendedEditorConfig;
  appearance?: ExtendedAppearanceConfig;
};

export interface ExtendedToolConfig extends ToolConfig {
  icon: string; // https://docs.unlayer.com/docs/tools#change-icon
}

export type ExtendedUnlayerTabOptions = Tabs[string];

export interface ExtendedEditorConfig {
  autoSelectOnDrop?: boolean; // https://docs.unlayer.com/docs/auto-select-on-drop
  confirmOnDelete?: boolean; // https://docs.unlayer.com/docs/confirm-on-delete
}

export interface ExtendedFeatures {
  sendTestEmail?: boolean; // https://docs.unlayer.com/docs/features#send-test-email
  preheaderText?: boolean; // https://docs.unlayer.com/docs/features#preheader-text
  smartMergeTags?: boolean; // https://docs.unlayer.com/docs/features#smart-merge-tags
  undoRedo?: boolean; // https://docs.unlayer.com/docs/features#undo--redo
}

export type ExtendedAppearanceConfig = {
  theme?: Theme;
  panels?: {
    tools?: {
      dock?: "left" | "right";
      collapsible?: boolean;
      tabs?: {
        body?: {
          visible?: boolean;
        };
      };
    };
  };
  features?: {
    preview?: boolean;
  };
};
