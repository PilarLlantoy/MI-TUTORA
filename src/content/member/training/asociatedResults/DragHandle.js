import { IconButton } from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

function DragHandle (props){
    return(
        <IconButton {...props} 
            sx={{
                borderRadius:30, 
                color:"#979797", 
                "&:hover": {
                    backgroundColor: "rgba(151, 151, 151, 0.04)"
                }
            }}>
            <DragIndicatorIcon />
        </IconButton>
    )
}
export default DragHandle;