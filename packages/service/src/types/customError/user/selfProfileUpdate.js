import { ApolloError } from 'apollo-server-express';
import { InternalErrorMessage, PublicErrorMessage } from 'types/errorMessage';
import { ErrorType } from 'types/errorType';

const toSafeError = (error) => {
  delete error.extensions.email;
  delete error.extensions.username;

  error.message = PublicErrorMessage.USER_SELF_PROFILE_UPDATE_FAILED;

  return error;
};

const appendSafeError = (props) => ({
  ...props,
  toSafeError,
});

class UserSelfProfileUpdateEmailInUserError extends ApolloError {
  constructor(properties) {
    super(
      InternalErrorMessage.USER_SELF_PROFILE_UPDATE_FAILED_EMAIL_IN_USE,
      ErrorType.USER_SELF_PROFILE_UPDATE_FAILED_EMAIL_IN_USE,
      appendSafeError(properties)
    );

    Object.defineProperty(this, 'name', {
      value: UserSelfProfileUpdateEmailInUserError.name,
    });
  }
}

class UserSelfProfileUpdateNotFoundError extends ApolloError {
  constructor(properties) {
    super(
      InternalErrorMessage.USER_SELF_PROFILE_UPDATE_FAILED_NOT_FOUND,
      ErrorType.USER_SELF_PROFILE_UPDATE_FAILED,
      appendSafeError(properties)
    );

    Object.defineProperty(this, 'name', {
      value: UserSelfProfileUpdateNotFoundError.name,
    });
  }
}

export {
  UserSelfProfileUpdateEmailInUserError,
  UserSelfProfileUpdateNotFoundError,
};
