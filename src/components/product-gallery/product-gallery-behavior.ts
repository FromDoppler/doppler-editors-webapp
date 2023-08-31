// TODO: implement it
export const useProductGalleryBehavior = <TValue>({
  cancel,
  selectItem,
  ...rest
}: { cancel: () => void; selectItem: (item: TValue) => void } & Record<
  string,
  any
>) => {
  console.log("useProductGalleryBehavior", { selectItem, ...rest });
  // TODO: implement it
  const selectCheckedItem = null;
  return {
    cancel,
    selectItem,
    selectCheckedItem,
    ...rest,
  };
};
