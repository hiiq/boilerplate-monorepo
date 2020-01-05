import { User } from 'entity/User';
import {
  Arg,
  Authorized,
  Query,
  Resolver,
  InputType,
  Field,
  ObjectType,
} from 'type-graphql';
import { paginate } from 'types/pagination/paginate';
import { UserRole } from 'types/userRole';
import { Page } from 'types/pagination/page';
import { logFactory } from 'log/logFactory';
import { DatabaseError } from 'types/customError/database';
import { log } from 'log';
import { InternalErrorMessage } from 'types/errorMessage';

const debugLog = logFactory({
  method: 'users',
  module: 'resolvers/user',
});

@InputType({ description: 'The filters for searching users' })
class UsersInput {
  @Field({
    description:
      'The starting cursor. E.g test@test.com if indexed by email or test_user if indexed by username',
    nullable: true,
  })
  after: string;

  @Field({ description: 'The desired page size', nullable: true })
  first: number;
}

@ObjectType({ description: 'A User page' })
class UserPage extends Page(User) {}

@Resolver()
export class Users {
  @Query(() => UserPage, { description: 'Fetch all users' })
  @Authorized([UserRole.ADMIN])
  async users(
    @Arg('input', { description: 'The filters for searching users' })
    input: UsersInput
  ) {
    debugLog('👾', input);

    let page = null;
    try {
      page = await paginate(User, input, 'username');
    } catch (error) {
      log.error(InternalErrorMessage.FAILED_TO_RETRIEVE_USERS, error);

      throw new DatabaseError();
    }

    debugLog(`💁 Successfully found ${page.edges.length} user(s)`);

    return page;
  }
}
