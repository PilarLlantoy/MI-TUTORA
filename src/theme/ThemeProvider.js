import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { StylesProvider } from '@mui/styles';
import { themeCreator } from './base';

// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';
// import stylisRTLPlugin from 'stylis-plugin-rtl';

// const cacheRtl = createCache({
//   key: 'bloom-ui',
// prepend: true,
//
//   stylisPlugins: [stylisRTLPlugin]
// });

export const ThemeContext = React.createContext();

const ThemeProviderWrapper = function (props) {
  localStorage.setItem('appTheme', 'AimTheme')
  const curThemeName = localStorage.getItem('appTheme') || 'AimTheme';
  // const curThemeName = 'AimTheme';
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeName) => {
    localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <StylesProvider injectFirst>
      {/* <CacheProvider value={cacheRtl}> */}
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </ThemeContext.Provider>
      {/* </CacheProvider> */}
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;
