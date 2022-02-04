import { timeout } from "../../utils";
import {
  DopplerRestApiClient,
  Field,
} from "../../abstractions/doppler-rest-api-client";
import sampleUserFields from "./sample-user-fields.json";
import { Result } from "../../abstractions/common/result-types";

export class DummyDopplerRestApiClient implements DopplerRestApiClient {
  getFields: () => Promise<Result<Field[]>> = async () => {
    console.log("Begin getFields...");
    await timeout(1000);

    const value = JSON.parse(JSON.stringify(sampleUserFields)) as any;

    const result: Result<Field[]> = {
      success: true,
      value,
    };

    console.log("End getFields", { result });
    return result;
  };
}
