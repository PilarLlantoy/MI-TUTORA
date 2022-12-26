import { Box, Button, Dialog, Grid, Slide, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { forwardRef } from "react";

const DialogWrapper = styled(Dialog)(
    () => `
        .MuiDialog-paper {
          overflow: visible;
        }
  `
);

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

function DeleteModal ({
    openConfirmDelete, 
    closeConfirmDelete,
    title,
    itemName,
    handleDeleteCompleted,
    children = null
}){
    return (
        <DialogWrapper
            open={openConfirmDelete}
            keepMounted
            TransitionComponent={Transition}
            onClose={closeConfirmDelete}
            maxWidth="sm"
        >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={3}
        >

            <Typography
            width="100%"
                align="left"
                variant="h3"
            >
                {title}
            </Typography>

            <Typography
                width="100%"
                align="left"
                sx={{
                pt: 1,
                pb: 1,
                // px: 6
                }}
                fontWeight="normal"
                color="text.secondary"
                variant="h4"
            >
                {`¿Seguro que desea eliminar ${itemName}?`}
            </Typography>
            <Typography
                width="100%"
                align="left"
                sx={{
                pb: 1,
                // px: 6
                }}
                fontWeight="normal"
                color="text.secondary"
            >
                {children}
            </Typography>
            <Grid
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    pt: 2
                }}
                container
                margin="auto"
                item
                xs={12}
            >
            <Grid item>
                <Button
                variant="outlined"
                size="small"
                sx={{  
                    mx: 1,
                    color:"red",
                    borderColor: "red"
                }}
                onClick={closeConfirmDelete}
                >
                Cancelar
                </Button>
            </Grid>
            <Grid item>
                <Button
                color="secondary"
                variant="outlined"
                onClick={handleDeleteCompleted}
                size="small"
                sx={{
                    ml: 1,
                    px: 2
                }}
                >
                Aceptar
                </Button>
            </Grid>
            </Grid>
        </Box>
      </DialogWrapper>
    )
}

export default DeleteModal;