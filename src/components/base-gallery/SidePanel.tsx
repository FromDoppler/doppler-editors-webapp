import { useEffect, useState } from "react";

import { DopplerEditorStore } from "../../abstractions/domain/DopplerEditorSettings";
import { useGetEditorSettings } from "../../queries/editor-settings-queries";
import { ContentLoading } from "./ContentLoading";
import { FormattedMessage } from "react-intl";

export const SidePanel = ({
  setValue,
  value,
}: {
  value: string;
  setValue: (store: string) => void;
}) => {
  const liStyle = {
    cursor: "pointer",
    padding: "15px 0",
    borderBottom: "1px solid #E5E5E5",
    color: "#999",
  } as const;
  const liStyleActive = {
    color: "#262626",
    cursor: "pointer",
    padding: "15px 0",
    borderBottom: "1px solid #E5E5E5",
  } as const;
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<DopplerEditorStore[]>([]);
  const editorSettings = useGetEditorSettings();

  // TODO resolve missing dependency for useEffect
  useEffect(() => {
    setLoading(true);
    setStores(
      editorSettings.data?.stores.filter(
        (store) => store.productsEnabled === true,
      ) || [],
    ); // eslint-disable-line react-hooks/exhaustive-deps
    setLoading(false);
  }, [editorSettings.data?.stores]);
  return loading ? (
    <ContentLoading />
  ) : (
    <div
      className="dp-product-gallery-side-panel"
      style={{ width: "12%", paddingRight: "2%" }}
    >
      <strong>
        <FormattedMessage id="my_integrations" />
      </strong>
      <ul className="p-t-30">
        {stores.map((store) => (
          <li
            key={store.name}
            style={store.name === value ? liStyleActive : liStyle}
            onClick={() => setValue(store.name)}
          >
            {store.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
