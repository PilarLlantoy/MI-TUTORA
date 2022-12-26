import { PureLightTheme } from './schemes/PureLightTheme';
import { GreyGooseTheme } from './schemes/GreyGooseTheme';
import { PurpleFlowTheme } from './schemes/PurpleFlowTheme';
import { AimTheme } from './schemes/AimTheme';

const themeMap = {
  PureLightTheme,
  GreyGooseTheme,
  PurpleFlowTheme,
  AimTheme
};

export function themeCreator(theme) {
  return themeMap[theme];
}
