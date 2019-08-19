import { number } from 'prop-types';
import React from 'react';
import { ScreenReaderNotification } from 'shared/ScreenReaderNotification';
import { useTranslate } from 'shared/useTranslate';
import styled from 'styled-components/macro';
import { Color } from 'types/color';

const Styled = styled.div`
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Ring = styled.div`
  display: inline-block;
  height: ${({ size }) => size}px;
  position: relative;
  width: ${({ size }) => size}px;

  div {
    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border: ${({ size }) => size / 10}px solid ${Color.primary};
    border-color: ${Color.primary} transparent transparent transparent;
    border-radius: 50%;
    box-sizing: border-box;
    display: block;
    height: ${({ size }) => size}px;
    position: absolute;
    width: ${({ size }) => size}px;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }
  div:nth-child(2) {
    animation-delay: -0.3s;
  }
  div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Loader = ({ size }) => {
  const t = useTranslate({
    component: 'common',
    namespace: 'common',
  });

  return (
    <Styled>
      <Ring size={size}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </Ring>
      <ScreenReaderNotification>
        {t('loadingScreenReader')}
      </ScreenReaderNotification>
    </Styled>
  );
};

Loader.defaultProps = {
  size: 24,
};

Loader.propTypes = {
  size: number,
};

export { Loader };
