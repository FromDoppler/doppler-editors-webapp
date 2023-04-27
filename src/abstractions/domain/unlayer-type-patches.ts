import {
  EditorConfig,
  Features,
  ToolConfig,
  UnlayerOptions,
} from "react-email-editor";

export interface ExtendedUnlayerOptions extends UnlayerOptions {
  features: ExtendedFeatures;
  mergeTagsConfig: { sort: boolean };
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
  editor?: ExtendedEditorConfig;
}

export interface ExtendedToolConfig extends ToolConfig {
  icon: string;
}

export interface ExtendedUnlayerTabOptions {
  enabled?: boolean;
  active?: boolean;
  position?: number;
}

export interface ExtendedEditorConfig extends EditorConfig {
  autoSelectOnDrop?: boolean;
}

export interface ExtendedFeatures extends Features {
  sendTestEmail?: boolean;
  preheaderText?: boolean;
}
