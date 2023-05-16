import { useMemo } from "react";
import { Field } from "../abstractions/doppler-rest-api-client";
import { isDefined, nameComparison, spliceBy } from "../utils";

const allowFieldTypes = [
  "boolean",
  "number",
  "string",
  "date",
  "email",
  "gender",
  "country",
  "phone",
];
const firstNameFieldName = "firstname"; // cspell:disable-line
const lastNameFieldName = "lastname"; // cspell:disable-line
const encloseFieldName = (x: Field) => `[[[${x.name}]]]`;
const isAllowedField = (x: Field) =>
  allowFieldTypes.includes(x.type.toLowerCase());

// TODO: translate the name for predefined fields
export function useCustomFields(fields: Field[] | undefined) {
  const mergeTags = useMemo(() => {
    if (!fields) {
      return fields;
    }

    const basicFields = fields.filter((x) => x.predefined).sort(nameComparison);

    const firstNameField = spliceBy(
      basicFields,
      (x) => x.name.toLowerCase() === firstNameFieldName
    );
    const lastNameField = spliceBy(
      basicFields,
      (x) => x.name.toLowerCase() === lastNameFieldName
    );

    const customFields = fields
      .filter((x) => !x.predefined)
      .sort(nameComparison);

    return [firstNameField, lastNameField, ...basicFields, ...customFields]
      .filter(isDefined)
      .filter(isAllowedField)
      .map((x) => ({
        name: x.name,
        value: encloseFieldName(x),
      }));
  }, [fields]);

  return mergeTags;
}
