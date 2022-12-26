import { Box, Typography } from '@mui/material';

function CategoryTab({ subjects, subjectId }) {
  return (
    <>
      {subjects.map((s) => {
        return s.subjectId === subjectId ? (
          <Box sx={{ p: 3 }} key={s.subjectId}>
            <Typography>{s.description}</Typography>
          </Box>
        ) : (
          <></>
        );
      })}
    </>
  );
}

export default CategoryTab;
