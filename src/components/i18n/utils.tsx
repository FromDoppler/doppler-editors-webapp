export function flattenMessages(nestedMessages: any, prefix = "") {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    let value: string[] = nestedMessages[key];
    let prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      messages[prefixedKey as keyof typeof messages] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}
