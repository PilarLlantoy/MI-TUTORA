import { Box, List, styled } from '@mui/material';
import { useLocation, matchPath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import NavigationMenuItem from './item';
import menuItems from './items';

const MenuWrapper = styled(Box)(
  () => `
  .MuiList-root {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    & > .MuiList-root {
      display: flex;
      flex-direction: row;
    }
  }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {
      padding: 0;
      display: flex;
      flex-direction: row;
      
      .MuiList-root .MuiList-root .MuiListItem-root .MuiIconButton-root {
        font-weight: normal !important;
      }

      .MuiListItem-root {
        padding: 0 2px;
        justify-content: center;
    
        .MuiIconButton-root {
          display: flex;
          background-color: transparent;
          width: 58px;
          border-radius: ${theme.general.borderRadiusLg};
          height: 58px;
          justify-content: center;
          font-size: ${theme.typography.pxToRem(13)};
          padding: 0;
          position: relative;

          .name-wrapper {
            display: none;
            transition: ${theme.transitions.create(['color'])};
          }

          .MuiBadge-root {
            position: absolute;
            right: 8px;
            top: 12px;

            .MuiBadge-standard {
              background: ${theme.colors.alpha.white[70]};
              font-size: ${theme.typography.pxToRem(11)};
              font-weight: bold;
              text-transform: uppercase;
              color: ${theme.colors.alpha.black[100]};
            }
          }
  
          .MuiSvgIcon-root {
            transition: ${theme.transitions.create(['color'])};
            font-size: ${theme.typography.pxToRem(32)};
            color: ${theme.colors.alpha.trueWhite[70]};
          }

          &.Mui-active,
          &:hover {
            background-color: ${theme.colors.alpha.trueWhite[10]};

            .MuiSvgIcon-root {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }
      }
    }
`
);

const renderNavigationMenuItems = ({ items, path }) => (
  <SubMenuWrapper>
    <List component="div">
      {items.reduce((ev, item) => reduceChildRoutes({ ev, item, path }), [])}
    </List>
  </SubMenuWrapper>
);

const reduceChildRoutes = ({ ev, path, item }) => {
  const key = uuidv4();

  const exactMatch = item.link
    ? !!matchPath(
        {
          path: item.link,
          end: true
        },
        path
      )
    : false;

  if (item.items) {
    const partialMatch = item.link
      ? !!matchPath(
          {
            path: item.link,
            end: false
          },
          path
        )
      : false;

    ev.push(
      <NavigationMenuItem
        key={key}
        active={partialMatch}
        open={partialMatch}
        name={item.name}
        icon={item.icon}
        link={item.link}
        badge={item.badge}
      >
        {renderNavigationMenuItems({
          path,
          items: item.items
        })}
      </NavigationMenuItem>
    );
  } else {
    ev.push(
      <NavigationMenuItem
        key={key}
        active={exactMatch}
        name={item.name}
        link={item.link}
        badge={item.badge}
        icon={item.icon}
      />
    );
  }

  return ev;
};

function NavigationMenu() {
  const location = useLocation();

  return (
    <>
      {menuItems.map((section) => (
        <MenuWrapper key={uuidv4()}>
          <List component="div">
            {renderNavigationMenuItems({
              items: section.items,
              path: location.pathname
            })}
          </List>
        </MenuWrapper>
      ))}
    </>
  );
}

export default NavigationMenu;
