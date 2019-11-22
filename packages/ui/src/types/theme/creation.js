import { DisplayMode } from 'types/displayMode';

const prefersDarkMode = Boolean(
  window.matchMedia('(prefers-color-scheme: dark)').matches
);

export const initial = prefersDarkMode ? DisplayMode.DARK : DisplayMode.LIGHT;
