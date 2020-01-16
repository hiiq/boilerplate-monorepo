import { defaultTo, map, mergeRight, pipe } from 'ramda';
import { Route } from 'types/route';
import { About } from 'modules/about';
import { Dashboard } from 'modules/dashboard';
import { Login } from 'modules/login';
import { Logout } from 'modules/logout';
import { NotFound } from 'modules/notFound';
import { Profile } from 'modules/profile';
import { Signup } from 'modules/signup';
import { TestPage } from 'modules/testPage';

const componentMap = {
  about: About,
  dashboard: Dashboard,
  login: Login,
  logout: Logout,
  notFound: NotFound,
  profile: Profile,
  root: Dashboard,
  signup: Signup,
  testPage: TestPage,
};

const addComponent = route => {
  const component = defaultTo(Dashboard, componentMap[route.name]);

  return mergeRight(route, { component });
};

const navRoutes = pipe(
  Route.filterToNavigation,
  map(addComponent)
)(Route.values);

const routes = map(addComponent, Route.values);

export { navRoutes, routes };
