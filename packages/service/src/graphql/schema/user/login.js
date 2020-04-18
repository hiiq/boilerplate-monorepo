import { gql } from 'apollo-server-express';
import { userReadRaw } from 'db/user/userReadRaw';
import { log } from 'log';
import { logFactory } from 'log/logFactory';
import { Auth } from 'types/auth';
import {
  UserInvalidLoginError,
  UserInvalidLoginPasswordMismatchError,
  UserInvalidLoginUserDeletedError,
  UserInvalidLoginUserNotFoundError,
} from 'types/customError/user/login';
import { InternalErrorMessage } from 'types/errorMessage';
import { Password } from 'types/password';
import { RateLimit } from 'types/rateLimit';

const MUTATION_NAME = 'userLogin';

const debugLog = logFactory({
  method: MUTATION_NAME,
  module: 'resolvers/user',
});

// eslint-disable-next-line complexity,max-statements
const resolver = async (_parent, { input }, context) => {
  const { username, password: clearTextPassword } = input;
  const { res } = context;

  const criteria =
    username.indexOf('@') > -1 ? { email: username } : { username };

  let user = null;

  debugLog(`👾 ${MUTATION_NAME}`, { username });

  try {
    user = await userReadRaw(criteria, context);
  } catch (error) {
    log.error(InternalErrorMessage.USER_NOT_FOUND, {
      error,
      mutation: MUTATION_NAME,
      username,
    });

    throw new UserInvalidLoginError();
  }

  if (!user) {
    debugLog(`🤷 ${InternalErrorMessage.USER_NOT_FOUND}`, { username });

    throw new UserInvalidLoginUserNotFoundError({ username });
  }

  if (!Auth.isUserActive(user)) {
    log.error(InternalErrorMessage.USER_IS_DELETED, {
      deletedAt: user.deletedAt,
      query: MUTATION_NAME,
      username: user.username,
    });

    throw new UserInvalidLoginUserDeletedError({
      deletedAt: user.deletedAt,
      username: user.username,
    });
  }

  const isPasswordMatch = await Password.compare(
    clearTextPassword,
    user.passwordHash
  );

  if (!isPasswordMatch) {
    debugLog(`🔏 ${InternalErrorMessage.PASSWORD_MISMATCH}`, { username });

    throw new UserInvalidLoginPasswordMismatchError({ username });
  }

  Auth.writeRefreshToken(res, user);

  debugLog(`✅ User logged in successfully`, { username });

  return Auth.encryptAccessToken(user);
};

const { burst: Burst, window: Window } = RateLimit.USER_LOGIN;
const { duration, limit } = RateLimit.USER_LOGIN_USERNAME;

const typeDefs = gql`
  "The user login input"
  input UserLoginInput {
    "The user provided clear text password"
    password: String!
    "The user provided username"
    username: String!
  }

  "Mutations"
  type Mutation {
    "The user login mutation"
    ${MUTATION_NAME}(input: UserLoginInput!): String!
      @rateLimitWindow(limit: ${Window.limit}, duration: ${Window.duration})
      @rateLimitBurst(limit: ${Burst.limit}, duration: ${Burst.duration})
      @rateLimitUsername(limit: ${limit}, duration: ${duration})
  }
`;

export { resolver, typeDefs };
