import { Utils } from '@boilerplate-monorepo/common';
import { lazy } from 'react';

const Lazy = lazy(() =>
  import(
    /* webpackChunkName: "profile" */
    './component'
  ).then(Utils.renameKeys({ Profile: 'default' }))
);

export { Lazy as Profile };