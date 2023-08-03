import { AppServices } from "../../abstractions";
import { DopplerLegacyClient } from "../../abstractions/doppler-legacy-client";
import { EditorExtensionsBridge } from "../../abstractions/editor-extensions-bridge";
import { EditorExtensionsListeners } from "../../abstractions/editor-extensions-listeners";

export class EditorExtensionsListenersImplementation
  implements EditorExtensionsListeners
{
  editorExtensionsBridge: EditorExtensionsBridge;
  dopplerLegacyClient: DopplerLegacyClient;

  constructor({ editorExtensionsBridge, dopplerLegacyClient }: AppServices) {
    this.editorExtensionsBridge = editorExtensionsBridge;
    this.dopplerLegacyClient = dopplerLegacyClient;
  }

  // TODO: support unregister the listeners

  registerListeners(): void {
  }
}
