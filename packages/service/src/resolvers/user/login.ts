import { compare } from 'bcryptjs';
import { User } from 'entity/User';
import { log } from 'log';
import { logFactory } from 'log/logFactory';
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { Auth } from 'types/auth';
import { Context } from 'types/context';
import {
  InvalidLoginError,
  InvalidLoginPasswordMismatchError,
  InvalidLoginUserNotFoundError,
} from 'types/customError/user/login';
import { InternalErrorMessage } from 'types/errorMessage';

const debugLog = logFactory({ method: 'login', module: 'resolvers/user' });
const LOGIN_USER_INPUT_DESCRIPTION = 'The user login input';

@InputType({ description: LOGIN_USER_INPUT_DESCRIPTION })
class LoginInput {
  @Field({ description: `The user's username` })
  username: string;

  @Field({ description: `The user's clear text password` })
  password: string;
}

@Resolver()
export class Login {
  @Mutation(() => String, { description: 'Login a given user' })
  async login(
    @Arg('input', { description: LOGIN_USER_INPUT_DESCRIPTION })
    input: LoginInput,
    @Ctx() { res }: Context
  ): Promise<String> {
    const { username, password: clearTextPassword } = input;
    let user;

    debugLog('👾 LoginInput', { username });

    try {
      user = await User.findOne({ where: { username } });
    } catch (error) {
      log.error(InternalErrorMessage.FAILED_DB_REQUEST, error);

      throw new InvalidLoginError();
    }

    if (!user) {
      debugLog(`🤷 ${InternalErrorMessage.USER_NOT_FOUND}`, { username });

      throw new InvalidLoginUserNotFoundError({ username });
    }

    const isPasswordMatch = await compare(clearTextPassword, user.passwordHash);

    if (!isPasswordMatch) {
      debugLog(`🔏 ${InternalErrorMessage.PASSWORD_MISMATCH}`, { username });

      throw new InvalidLoginPasswordMismatchError({ username });
    }

    debugLog(`✅ User logged in successfully`, { username });
    Auth.writeRefreshToken(res, user);

    return Auth.encryptAccessToken(user);
  }
}
