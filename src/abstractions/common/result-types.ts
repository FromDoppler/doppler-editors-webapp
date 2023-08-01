type SuccessResult<TResult> = TResult extends void
  ? { success: true }
  : { success: true; value: Readonly<TResult> };

type ErrorResult<TExpectedError> = {
  success: false;
  error: Readonly<TExpectedError>;
};

export type Result<
  TResult = void,
  TExpectedError = void,
> = TExpectedError extends void
  ? SuccessResult<TResult>
  : SuccessResult<TResult> | ErrorResult<TExpectedError>;
