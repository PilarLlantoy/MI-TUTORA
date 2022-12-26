// import { Box, Tooltip, Badge, styled, useTheme } from '@mui/material';
// import { Box, Tooltip, Badge, styled, useTheme } from '@mui/material';
// import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import { Typography } from '@mui/material';

// const LogoWrapper = styled(Link)(
//   ({ theme }) => `
//         color: ${theme.colors.alpha.trueWhite[100]};
//         padding: ${theme.spacing(0, 1, 0, 0)};
//         display: flex;
//         text-decoration: none;
//         font-weight: ${theme.typography.fontWeightBold};
// `
// );

// const LogoSignWrapper = styled(Box)(
//   ({ theme }) => `
//         width: 52px;
//         height: 38px;
//         transform: scale(.8);
//         transition: ${theme.transitions.create(['transform'])};

//         &:hover {
//         transform: scale(1);
//         }
// `
// );

// const LogoSign = styled(Box)(
//   ({ theme }) => `
//         background: ${theme.colors.alpha.trueWhite[70]};
//         width: 18px;
//         height: 18px;
//         border-radius: ${theme.general.borderRadiusSm};
//         position: relative;
//         transform: rotate(45deg);
//         top: 3px;
//         left: 17px;

//         &:after, 
//         &:before {
//             content: "";
//             display: block;
//             width: 18px;
//             height: 18px;
//             position: absolute;
//             top: -1px;
//             right: -20px;
//             transform: rotate(0deg);
//             border-radius: ${theme.general.borderRadiusSm};
//         }

//         &:before {
//             background: ${theme.colors.alpha.trueWhite[50]};
//             right: auto;
//             left: 0;
//             top: 20px;
//         }

//         &:after {
//             background: ${theme.colors.alpha.trueWhite[30]};
//         }
// `
// );

// const LogoSignInner = styled(Box)(
//   ({ theme }) => `
//         width: 16px;
//         height: 16px;
//         position: absolute;
//         top: 12px;
//         left: 12px;
//         z-index: 5;
//         border-radius: ${theme.general.borderRadiusSm};
//         background: ${theme.header.background};
// `
// );

function Logo() {
  // const theme = useTheme();

  return (
    <Typography>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        color: 'white'
      }}>
        <SchoolIcon sx={{ mr: 1 }} />
        <span>MI TUTORA</span>
      </div>
    </Typography>
  );
  // return (
  //   <LogoWrapper to="/aim/">
  //     <Tooltip
  //       arrow
  //       placement="right"
  //       title="MI TUTORA"
  //     >
  //       <Badge
  //         sx={{
  //           '.MuiBadge-badge': {
  //             fontSize: theme.typography.pxToRem(11),
  //             right: -2,
  //             top: 8,
  //             background: theme.colors.alpha.black[30],
  //             color: theme.colors.alpha.trueWhite[100]
  //           }
  //         }}
  //         overlap="circular"
  //         badgeContent="1.0"
  //       >
  //         <LogoSignWrapper>
  //           <LogoSign>
  //             <LogoSignInner />
  //           </LogoSign>
  //         </LogoSignWrapper>

  //       </Badge>
  //       <SchoolIcon />
  //       MI TUTORA
  //     </Tooltip>
  //   </LogoWrapper>
  // );
}

export default Logo;
