import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Avatar,
    ListItem,
    Alert,
    List
} from '@mui/material';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

const AvatarWrapper = styled(Avatar)(
    ({ theme }) => `
    background: ${theme.colors.primary.lighter};
    color: ${theme.colors.primary.main};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarSuccess = styled(Avatar)(
    ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = styled(Avatar)(
    ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const BoxUploadWrapper = styled(Box)(
    ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(3)};
    background: ${theme.colors.alpha.black[5]};
    border: 1px dashed ${theme.colors.alpha.black[30]};
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(['border', 'background'])};

    &:hover {
      background: ${theme.colors.alpha.white[100]};
      border-color: ${theme.colors.primary.main};
    }
`
);

// En caso se acepten varios archivos, enviar multiple = true

function DropzoneAIM({isDragActive, isDragAccept, isDragReject, getRootProps, getInputProps, acceptText="",
    multiple = false, files, setNewFiles}) {

    // Para varios archivos
    const removeFileFromList = (index) => {
        const tempFiles = [...files]
        tempFiles.splice(tempFiles.indexOf(index), 1)
        setNewFiles(tempFiles)
    };
    
    // Para solo 1 archivo
    const removeFile = () => {
        setNewFiles({})
    }

    const fileList = files.length>0? files.map((item, index) => (
        <ListItem disableGutters component="div" key={index}>
            <Alert
                sx={{
                    py: 0,
                    mt: 2,
                    color: "#000"
                }}
                onClose={() => removeFileFromList(index)}
                closeText = "Eliminar"
                icon={<InsertDriveFileOutlinedIcon fontSize="inherit" />}
                severity="info"
                variant="outlined"
            >
                {item.name}
            </Alert>
        </ListItem>
    )) : null;


    return (
        <div>
            <BoxUploadWrapper {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragAccept && (
                    <>
                        <AvatarSuccess variant="rounded">
                            <CheckTwoToneIcon />
                        </AvatarSuccess>
                        <Typography
                            sx={{
                                mt: 2
                            }}
                            >
                            Arrastra los archivos para comenzar la subida
                        </Typography>
                    </>
                )}
                {isDragReject && (
                    <>
                        <AvatarDanger variant="rounded">
                            <CloseTwoToneIcon />
                        </AvatarDanger>
                        <Typography
                            sx={{
                                mt: 2
                            }}
                            >
                            No puedes subir este tipo de archivos de archivos
                        </Typography>
                    </>
                )}
                {!isDragActive && (
                    <>
                        <AvatarWrapper variant="rounded">
                            <CloudUploadTwoToneIcon />
                        </AvatarWrapper>
                        <Typography
                            sx={{
                                mt: 2,
                                textAlign:"center"
                            }}
                            >
                            {!multiple ? `Arrastra y suelta el archivo aquí` : `Arrastra y suelta los archivos aquí`}
                            <br/>
                            <em>{acceptText}</em>
                        </Typography>
                    </>
                )}
            </BoxUploadWrapper>
            {
                !multiple?
                (files && (
                    <>
                        { files.name !== undefined &&
                            <Alert
                                sx={{
                                    py: 0,
                                    mt: 2,
                                    color: "#000"
                                }}
                                onClose={removeFile}
                                closeText = "Eliminar"
                                icon={<InsertDriveFileOutlinedIcon fontSize="inherit" />}
                                severity="info"
                                variant="outlined"
                            >
                                {files.name}
                            </Alert>
                        }
                    </>
                ))
                :
                (files.length>0 &&
                    <List disablePadding component="div">
                        {fileList}
                    </List>
                )
            }
        </div>
    )
}
export default DropzoneAIM;