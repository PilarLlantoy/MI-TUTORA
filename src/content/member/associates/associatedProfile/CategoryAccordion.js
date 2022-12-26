import { Grid, Typography, Tabs } from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import { styled } from '@mui/material/styles';
import { useState } from 'react';

import * as React from 'react';
import Tab from '@mui/material/Tab';
import CategoryTab from './CategoryTab';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;

      .MuiTabs-indicator {
        box-shadow: none;
      }
    }
`
);

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));



function CategoryAccordion({ category }) {
  const [expanded, setExpanded] = React.useState('panel1');
  const [subjectTab, setSubjectTab] = useState(category.subjects[0]);
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <Accordion
        expanded={expanded === `panel${category.categoryId}`}
        onChange={handleChange(`panel${category.categoryId}`)}
        key={category.categoryId}
      >
        <AccordionSummary
          aria-controls={`panel${category.categoryId}d-content`}
          id={`panel${category.categoryId}d-header`}
        >
          <Typography> {category.name} </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid item xs={12}>
            <TabsWrapper
              onChange={(_event, value) => {
                setSubjectTab(() => {
                  let subject = category.subjects.find(subject => subject.subjectId === value);
                  return subject;
                });
              }}
              value={subjectTab.subjectId}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {category.subjects.map((s) => {
                return (
                  <Tab key={s.subjectId} label={s.name} value={s.subjectId} />
                );
              })}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            <CategoryTab
              subjects={category.subjects}
              subjectId={subjectTab.subjectId}
            />
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default CategoryAccordion;