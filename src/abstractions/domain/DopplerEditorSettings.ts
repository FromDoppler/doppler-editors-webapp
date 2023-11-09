export type DopplerEditorSettings = Readonly<{
  stores: Readonly<DopplerEditorStore[]>;
}>;

export type DopplerEditorStore = Readonly<{
  name: string;
  promotionCodeEnabled: boolean;
  productsEnabled: boolean;
}>;
