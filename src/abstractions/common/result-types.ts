export type UnexpectedError = { success: false; unexpectedError: any };

export type ErrorResult<TError> =
  | { success: false; expectedError: TError }
  | UnexpectedError;

export type Result<TResult, TError> =
  | { success: true; value: TResult }
  | ErrorResult<TError>;

export type ResultWithoutExpectedErrors<TResult> =
  | { success: true; value: TResult }
  | UnexpectedError;

export type EmptyResult<TError> = { success: true } | ErrorResult<TError>;
// It does not work:
// type EmptyResult = { success: true } | UnexpectedError;
// Duplicate identifier 'EmptyResult'.ts(2300)
// TODO: Research how to fix it and rename EmptyResultWithoutExpectedErrors as EmptyResult
export type EmptyResultWithoutExpectedErrors =
  | { success: true }
  | UnexpectedError;
