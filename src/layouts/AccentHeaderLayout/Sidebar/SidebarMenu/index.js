import { useEffect, useState } from 'react';
import { ListSubheader, Box, List, styled } from '@mui/material';
import { useLocation, matchPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from 'src/hooks/useAuth';
import certifyAxios from 'src/utils/aimAxios';

import SidebarMenuItem from './item';
// import menuItems from './studentItems';
import studentItems from './studentItems';
import memberItems from './memberItems';
import associatedItems from './associatedItems';
import associatedRestrictedItems from './associatedRestrictedItems';
import adminItems from './adminItems';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {
      margin-bottom: ${theme.spacing(1.5)};
      padding: 0;

      & > .MuiList-root {
        padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
      }
    }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.sidebar.menuItemIconColor};
      padding: ${theme.spacing(1, 3.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 2px 0;
        padding-left: ${theme.spacing(0)};
        padding-right: ${theme.spacing(2)};

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.5)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.sidebar.menuItemColor};
          background-color: ${theme.sidebar.menuItemBg};
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1, 3, 1, 4)};
          border-bottom-left-radius: 0;
          border-top-left-radius: 0;
          border-bottom-right-radius: 50px;
          border-top-right-radius: 50px;
    
          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
            color: ${theme.sidebar.menuItemIconColor};
          }
          
          .MuiButton-endIcon {
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.Mui-active,
          &:hover {
            background-color: ${theme.sidebar.menuItemBgActive};
            color: ${theme.sidebar.menuItemColorActive};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
                color: ${theme.sidebar.menuItemIconColorActive};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7.5)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 0;
            padding-left: ${theme.spacing(1.2)};

            .MuiListItem-root {
              padding: 0;
            }

            .MuiButton-root {
              .MuiBadge-root {
                right: ${theme.spacing(3.5)};
              }
            }

            .MuiButton-root {
              padding: ${theme.spacing(0.7, 3, 0.7, 5.5)};

              &.Mui-active,
              &:hover {
                background-color: ${theme.sidebar.menuItemBg};
              }
            }
          }
        }
      }
    }
`
);

const renderSidebarMenuItems = ({ items, path }) => (
  <SubMenuWrapper>
    <List component="div">
      {items.reduce((ev, item) => reduceChildRoutes({ ev, item, path }), [])}
    </List>
  </SubMenuWrapper>
);

const reduceChildRoutes = ({ ev, path, item }) => {
  const key = item.name;

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
      <SidebarMenuItem
        key={key}
        active={partialMatch}
        open={partialMatch}
        name={item.name}
        icon={item.icon}
        link={item.link}
        badge={item.badge}
        badgeTooltip={item.badgeTooltip}
      >
        {renderSidebarMenuItems({
          path,
          items: item.items
        })}
      </SidebarMenuItem>
    );
  } else {
    ev.push(
      <SidebarMenuItem
        key={key}
        active={exactMatch}
        name={item.name}
        link={item.link}
        badge={item.badge}
        badgeTooltip={item.badgeTooltip}
        icon={item.icon}
      />
    );
  }

  return ev;
};

function SidebarMenu() {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      if (user.person.role === 0) setItems(studentItems);
      if (user.person.role === 1) setItems(memberItems);
      if (user.person.role === 2){
        const isEnable = await isEnableAssociated()
        if(isEnable){
          setItems(associatedItems);
        } else {
          setItems(associatedRestrictedItems)
        }
      } 
      if (user.person.role === 3) setItems(adminItems);
    }
    initialize()
  }, []);

  const isEnableAssociated = async () => {
    try {
      const reqObj = {
        "id": user.person.id 
      }
      const response = await certifyAxios.post(`/trainingModule/partner/isDone`, reqObj);
      if(response.data){
        // 0 cuando no termina capacitaciones o no hay
        if (response.data.isDone === 0 || response.data.isDone === null){
          return false
        }
        return true
      }
    } catch (error) {
      // ignore
    }
    // Por defecto solo se mostrará SOLO la opción de "Capacitaciones"
    return false
  }

  return (
    <>
      {items.map((section) => (
        <MenuWrapper key={section.heading}>
          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                {t(section.heading)}
              </ListSubheader>
            }
          >
            {renderSidebarMenuItems({
              items: section.items,
              path: location.pathname
            })}
          </List>
        </MenuWrapper>
      ))}
    </>
  );
}

export default SidebarMenu;
