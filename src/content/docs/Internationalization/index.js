import { Container, Typography, Grid } from '@mui/material';

import { Helmet } from 'react-helmet-async';
import PageHeader from 'src/components/PageHeaderDocs';
import { Prism } from 'react-syntax-highlighter';
import a11yDark from 'react-syntax-highlighter/dist/cjs/styles/prism/a11y-dark';

function Internationalization() {
  const intDir = `📦i18n
  ┣ 📂translations
  ┃ ┣ 📜ae.js
  ┃ ┣ 📜de.js
  ┃ ┣ 📜en.js
  ┃ ┣ 📜es.js
  ┃ ┣ 📜fr.js
  ┃ ┗ 📜zh.js
  ┗ 📜i18n.js`;

  const translateExample = `import { useTranslation } from 'react-i18next';

function Logo() {
  const { t } = useTranslation();

  return (
    <>
      {t('Text that will be translated here')}
    </>
  )};
    
export default Logo;`;

  return (
    <>
      <Helmet>
        <title>
          Internationalization - MI TUTORA White React Javascript Admin Dashboard
        </title>
      </Helmet>
      <Container maxWidth={false}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PageHeader heading="Internationalization" subheading="" />
          </Grid>
          <Grid item xs={12}>
            <Typography paragraph>
              We know supporting multiple languages is important for a lot of
              projects. That's why we implemented all texts to support
              translations. We are using <code>react-i18next@11.14.2</code> to
              do exactly that.
            </Typography>
            <Typography paragraph>
              As an example, we translated all the sidebar texts for all
              languages and a few other common terms used through out the
              application.
            </Typography>
            <Typography paragraph>
              By default there are 6 languages supported, but you could add more
              by creating another .js translation file and importing it in{' '}
              <code>src\i18n\i18n.js</code>
            </Typography>
            <Prism
              showLineNumbers
              wrapLines
              language="javascript"
              style={a11yDark}
            >
              {intDir}
            </Prism>
            <br />
            <Typography
              variant="h2"
              sx={{
                mb: 2
              }}
            >
              Example Implementation
            </Typography>
            <Typography paragraph>
              Use the example below to implement a translated text:
            </Typography>
            <Prism
              showLineNumbers
              wrapLines
              language="javascript"
              style={a11yDark}
            >
              {translateExample}
            </Prism>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Internationalization;
