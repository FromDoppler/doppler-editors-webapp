export type DopplerEditorSettings = Readonly<{
  stores: Readonly<DopplerEditorStore[]>;
}>;

type DopplerEditorStore = Readonly<{
  name: string;
  promotionCodeEnabled: boolean;
}>;
