type SuccessResult<TResult> = TResult extends void
  ? { success: true }
  : { success: true; value: TResult };

type UnexpectedError = { success: false; unexpectedError: any };

type ErrorResult<TExpectedError> = { success: false; error: TExpectedError };

export type Result<
  TResult = void,
  TExpectedError = void
> = TExpectedError extends void
  ? SuccessResult<TResult> | UnexpectedError
  : SuccessResult<TResult> | ErrorResult<TExpectedError> | UnexpectedError;
