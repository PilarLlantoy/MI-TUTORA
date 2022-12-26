import * as React from 'react';
import { 
  List,
  ListItem,
  ListItemText,
  Popover, IconButton
} from '@mui/material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export default function LevelPopper(props) {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => { 
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleTallerOpen = (e) => {
    props.setSelectedLevel(props.index)
    props.handleCreateTallerOpen(0, -1, {}, () => {
      handleClose(e)
    })
  }

  const removerNivelPopper = (e) => {
      props.removerNivel(props.index, () => {
        handleClose(e)
      })
  }

  const handleOpenExamPopper = (e) => {
    props.setSelectedLevel(props.index)
    props.handleOpenExamen(() => {
      handleClose(e)
    })
}

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  return (
    <div>
      <IconButton size="small" onClick={handleClick}>
          <MoreVertIcon/>
      </IconButton>
      <Popover
        id={id}
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List
          sx={{
            p: 1
          }}
          component="nav"
        >
          <ListItem
            button
            onClick={handleTallerOpen}
          >
            <PlayCircleOutlineRoundedIcon fontSize="small" />
            <ListItemText primary="Agregar nuevo taller" />
          </ListItem>
          { props.examLength === 0 && 
            <ListItem
              button
              onClick={handleOpenExamPopper}
            >
              <ContentPasteRoundedIcon fontSize="small" />
              <ListItemText primary="Agregar prueba final" />
            </ListItem>
          }
          <ListItem
            button
            onClick={removerNivelPopper}
          >
            <DeleteRoundedIcon fontSize="small" />
            <ListItemText primary="Eliminar nivel" />
          </ListItem>
        </List>
        
      </Popover>
    </div>
  );
}
