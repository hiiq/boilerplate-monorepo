import { config } from 'config';
import { isNil, reject, values as ramdaValues } from 'ramda';

export const Enumeration = {
  ENGLISH: 'en',
  FAKE: config.isDevelopment ? 'dev' : undefined,
};

export const values = reject(isNil, ramdaValues(Enumeration));