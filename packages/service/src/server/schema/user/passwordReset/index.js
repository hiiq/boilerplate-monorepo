import { UserPasswordResetInput } from '@boilerplate-monorepo/common';
import { gql } from 'apollo-server-express';
import { isAfter, parseISO } from 'date-fns/fp';
import { log } from 'log';
import { logFactory } from 'log/logFactory';
import { Auth } from 'types/auth';
import {
  DatabaseError,
  UserPasswordResetTokenExpiredError,
  UserPasswordResetTokenMismatchError,
} from 'types/customError';
import { InternalErrorMessage } from 'types/errorMessage';
import { Password } from 'types/password';
import { RateLimit } from 'types/rateLimit';

const MUTATION_NAME = 'userPasswordReset';

const debugLog = logFactory({
  method: MUTATION_NAME,
  module: 'resolvers/user',
});

// eslint-disable-next-line complexity, max-statements
const resolver = async (_parent, { input }, context) => {
  debugLog(`👾 ${MUTATION_NAME}`, input);

  const { db } = context;

  await UserPasswordResetInput.validationSchemaServer.validate(input);

  const { id, passwordNew: clearTextPassword, token } = input;

  let user = null;

  try {
    user = await db.user.readRaw({ id });
  } catch (error) {
    log.error(InternalErrorMessage.USER_FETCH_FAILED, {
      error,
      mutation: MUTATION_NAME,
    });

    throw new DatabaseError();
  }

  if (!user) {
    const errorData = {
      input,
      mutation: MUTATION_NAME,
    };

    log.error(InternalErrorMessage.USER_FETCH_FAILED, errorData);

    return true;
  }

  if (!Auth.isUserActive(user)) {
    log.error(InternalErrorMessage.USER_IS_DELETED, {
      deletedAt: user.deletedAt,
      query: MUTATION_NAME,
      username: user.username,
    });

    return true;
  }

  const { passwordResetToken, passwordResetTokenExpiration } = user;

  if (passwordResetToken !== token) {
    log.error(InternalErrorMessage.USER_PASSWORD_RESET_FAILED_TOKEN_MISMATCH, {
      query: MUTATION_NAME,
      username: user.username,
    });

    throw new UserPasswordResetTokenMismatchError();
  }

  const now = new Date();
  const isResetTokenExpired =
    !passwordResetTokenExpiration ||
    isAfter(parseISO(passwordResetTokenExpiration), now);

  if (isResetTokenExpired) {
    log.error(InternalErrorMessage.USER_PASSWORD_RESET_FAILED_TOKEN_MISMATCH, {
      query: MUTATION_NAME,
      username: user.username,
    });

    throw new UserPasswordResetTokenExpiredError();
  }

  const passwordHash = await Password.hash(clearTextPassword);

  try {
    await db.user.save({
      id,
      passwordHash,
      passwordResetToken: null,
      passwordResetTokenExpiration: null,
    });
  } catch (error) {
    log.error(InternalErrorMessage.USER_SELF_UPDATE_FAILED, {
      error,
      query: MUTATION_NAME,
    });

    throw new DatabaseError();
  }

  return true;
};

const { burst: Burst, window: Window } = RateLimit.USER_PASSWORD_RESET;

const typeDefs = gql`
  "The user password reset input"
  input UserPasswordResetInput {
    "The user's unique identifier"
    id: ID!
    "The user's new password"
    passwordNew: String!
    "The user's reset password token"
    token: String!
  }

  "Mutations"
  type Mutation {
    "The user password reset mutation to update the user's password"
    ${MUTATION_NAME}(input: UserPasswordResetInput!): Boolean!
      @rateLimitWindow(limit: ${Window.limit}, duration: ${Window.duration})
      @rateLimitBurst(limit: ${Burst.limit}, duration: ${Burst.duration})
  }
`;

export { resolver, typeDefs };
