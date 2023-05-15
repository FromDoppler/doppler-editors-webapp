import {
  EditorConfig,
  Features,
  ToolConfig,
  UnlayerOptions,
} from "react-email-editor";

export interface ExtendedUnlayerOptions extends UnlayerOptions {
  features: ExtendedFeatures;
  mergeTagsConfig: {
    sort: boolean; // https://docs.unlayer.com/docs/merge-tags#sorting-merge-tags
  };
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
  icon: string; // https://docs.unlayer.com/docs/tools#change-icon
}

export interface ExtendedUnlayerTabOptions {
  enabled?: boolean; // https://docs.unlayer.com/docs/tabs#enable--disable-tabs
  active?: boolean; // https://docs.unlayer.com/docs/tabs#default-active-tab
  position?: number; // https://docs.unlayer.com/docs/tabs#reposition-tabs
}

export interface ExtendedEditorConfig extends EditorConfig {
  autoSelectOnDrop?: boolean; // https://docs.unlayer.com/docs/auto-select-on-drop
  confirmOnDelete?: boolean; // https://docs.unlayer.com/docs/confirm-on-delete
}

export interface ExtendedFeatures extends Features {
  sendTestEmail?: boolean; // https://docs.unlayer.com/docs/features#send-test-email
  preheaderText?: boolean; // https://docs.unlayer.com/docs/features#preheader-text
}
