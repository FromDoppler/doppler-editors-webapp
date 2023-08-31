import { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
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
const firstNameFieldName = "firstname";
const lastNameFieldName = "lastname";
const encloseFieldName = (x: Field) => `[[[${x.name}]]]`;
const isAllowedField = (x: Field) =>
  allowFieldTypes.includes(x.type.toLowerCase());
const translateFieldName = (intl: IntlShape, fieldName: string) =>
  intl.formatMessage({
    id: `field_name_${fieldName.toLowerCase()}`,
    defaultMessage: fieldName,
  });

export function useCustomFields(fields: readonly Field[] | undefined) {
  const intl = useIntl();

  const mergeTags = useMemo(() => {
    if (!fields) {
      return fields;
    }

    const allowedFields = fields.filter(isAllowedField);
    const basicFields = allowedFields.filter((x) => x.predefined);

    const firstFields = [
      spliceBy(basicFields, (x) => x.name.toLowerCase() === firstNameFieldName),
      spliceBy(basicFields, (x) => x.name.toLowerCase() === lastNameFieldName),
    ]
      .filter(isDefined)
      .map((x) => ({
        name: translateFieldName(intl, x.name),
        value: encloseFieldName(x),
      }));

    const sortedBasicFields = basicFields
      .map((x) => ({
        name: translateFieldName(intl, x.name),
        value: encloseFieldName(x),
      }))
      .sort(nameComparison);

    const customFields = allowedFields
      .filter((x) => !x.predefined)
      .map((x) => ({
        name: x.name,
        value: encloseFieldName(x),
      }))
      .sort(nameComparison);

    return [...firstFields, ...sortedBasicFields, ...customFields];
  }, [intl, fields]);

  return mergeTags;
}
