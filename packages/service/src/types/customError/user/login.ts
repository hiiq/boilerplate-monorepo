import { ApolloError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { InternalErrorMessage, PublicErrorMessage } from 'types/errorMessage';
import { ErrorProperties } from 'types/errorProperties';
import { ErrorType } from 'types/errorType';

const toSafeError = (error: GraphQLError) => {
  delete error.extensions!.username;

  error.message = PublicErrorMessage.INVALID_LOGIN;

  return error;
};

const appendSafeError = (props: ErrorProperties | undefined) => ({
  ...props,
  toSafeError,
});

export class InvalidLoginError extends ApolloError {
  constructor(properties?: ErrorProperties) {
    super(
      PublicErrorMessage.INVALID_LOGIN,
      ErrorType.FAILED_LOGIN,
      appendSafeError(properties)
    );

    Object.defineProperty(this, 'name', { value: InvalidLoginError.name });
  }
}

export class InvalidLoginUserNotFoundError extends ApolloError {
  constructor(properties?: ErrorProperties) {
    super(
      InternalErrorMessage.USER_NOT_FOUND,
      ErrorType.FAILED_LOGIN_USER_NOT_FOUND,
      appendSafeError(properties)
    );

    Object.defineProperty(this, 'name', {
      value: InvalidLoginUserNotFoundError.name,
    });
  }
}

export class InvalidLoginPasswordMismatchError extends ApolloError {
  constructor(properties?: ErrorProperties) {
    super(
      InternalErrorMessage.PASSWORD_MISMATCH,
      ErrorType.FAILED_LOGIN_PASSWORD_MISMATCH,
      appendSafeError(properties)
    );

    Object.defineProperty(this, 'name', {
      value: InvalidLoginPasswordMismatchError.name,
    });
  }
}
