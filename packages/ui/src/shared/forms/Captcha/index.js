import { Theme } from '@boilerplate-monorepo/ui-common';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { config } from 'config';
import { string } from 'prop-types';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTheme } from 'shared/useTheme';
import { useTranslate } from 'shared/useTranslate';
import styled from 'styled-components';
import { CustomProperty } from 'types/customProperties';
import { HiddenInput } from '../HiddenInput';
import { ValidationError } from '../ValidationError';
import { styles as themeStyles } from './theme';

const { CAPTCHA_SITE_KEY: siteKey } = config;

const NAME = 'captchaToken';

const Container = styled.label`
  display: grid;
  margin-bottom: ${CustomProperty.BASE_UNIT};
`;

const StyledInputLabel = styled.div`
  font-weight: bold;
  margin-bottom: calc(0.25 * ${CustomProperty.BASE_UNIT});

  ${({ hasError }) => hasError && themeStyles.error}
`;

const Captcha = ({ name }) => {
  const t = useTranslate({
    component: 'common',
    namespace: 'common',
  });

  const [captchaToken, setCaptchaToken] = useState();
  const { errors, setValue } = useFormContext();
  const { theme } = useTheme();

  const displayMode = Theme.displayMode(theme);
  const error = errors[name]?.message;

  const onVerify = token => {
    setValue(name, token);
    setCaptchaToken(token);
  };

  if (!siteKey) return null;

  const errorMessage = error ? t('REQUIRED') : null;

  return (
    <Container>
      <StyledInputLabel hasError={Boolean(error)}>
        {t('proveYouAreNotARobot')}
      </StyledInputLabel>
      <HCaptcha
        error={error}
        onVerify={onVerify}
        sitekey={siteKey}
        theme={displayMode}
      />
      <HiddenInput name={name} value={captchaToken} />
      <ValidationError message={errorMessage} />
    </Container>
  );
};

Captcha.defaultProps = {
  name: NAME,
};

Captcha.propTypes = {
  name: string,
};

export { Captcha };