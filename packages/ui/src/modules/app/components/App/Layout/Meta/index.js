import { Color } from '@boilerplate-monorepo/common';
import { config } from 'config';
import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = () => {
  const { RELEASE } = config;

  return (
    <Helmet>
      <meta name="theme-color" content={Color.PRIMARY} />
      <meta name="version" content={RELEASE} />
    </Helmet>
  );
};

export { Meta };
