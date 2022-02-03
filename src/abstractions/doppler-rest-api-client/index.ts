import { Result } from "../common/result-types";

export type Field = {
  name: string;
  predefined: boolean;
  type:
    | "string"
    | "boolean"
    | "number"
    | "date"
    | "phone"
    | "email"
    | "gender"
    | "country"
    | "consent";
};

export interface DopplerRestApiClient {
  getFields: () => Promise<Result<Field[]>>;
}
