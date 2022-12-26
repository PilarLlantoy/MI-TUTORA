import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars-2';

import { Box, useTheme } from '@mui/material';

const Scrollbar = ({ className, children, autoHide = true, ...rest }) => {
  const theme = useTheme();

  return (
    <Scrollbars
      autoHide = {autoHide}
      renderThumbVertical={() => {
        return (
          <Box
            sx={{
              width: 5,
              marginBottom:"20px",
              background: `${theme.colors.alpha.black[10]}`,
              borderRadius: `${theme.general.borderRadiusLg}`,
              transition: `${theme.transitions.create(['background'])}`,

              '&:hover': {
                background: `${theme.colors.alpha.black[30]}`
              }
            }}
          />
        );
      }}
      {...rest}
    >
      {children}
    </Scrollbars>
  );
};

Scrollbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Scrollbar;
