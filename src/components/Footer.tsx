import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme
} from '@mui/material';

const Footer = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', path: '/features' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'Roadmap', path: '/roadmap' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Careers', path: '/careers' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', path: '/blog' },
        { label: 'Documentation', path: '/docs' },
        { label: 'Support', path: '/support' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Cookie Policy', path: '/cookies' },
      ]
    },
  ];

  return (
    <Box 
      component="footer" 
      sx={{
        py: 8,
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Megarray
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered marketing platform for businesses and agencies.
                Create, schedule, and analyze your content with advanced AI technology.
              </Typography>
            </Stack>
          </Grid>

          {sections.map((section) => (
            <Grid item xs={6} sm={3} md={2} key={section.title}>
              <Typography
                variant="subtitle2"
                color="text.primary"
                sx={{ mb: 2, fontWeight: 'bold' }}
              >
                {section.title}
              </Typography>
              <Stack spacing={1}>
                {section.links.map((link) => (
                  <Link
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    color="text.secondary"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            pt: 4,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Megarray. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={4}>
            <Link
              href="https://twitter.com/megarray"
              target="_blank"
              rel="noopener"
              color="text.secondary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Twitter
            </Link>
            <Link
              href="https://github.com/megarray"
              target="_blank"
              rel="noopener"
              color="text.secondary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              GitHub
            </Link>
            <Link
              href="https://linkedin.com/company/megarray"
              target="_blank"
              rel="noopener"
              color="text.secondary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              LinkedIn
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;