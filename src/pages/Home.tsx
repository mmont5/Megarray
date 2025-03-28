import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  Link,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Wand2, Brain, Calendar, BarChart2, Target, Users,
  Bot, Sparkles, Zap, Globe, Lock, Shield
} from 'lucide-react';

// Styled components
const HeroSection = styled('section')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.secondary.main,
  padding: theme.spacing(12, 2),
  color: theme.palette.common.white,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80)',
    backgroundSize: 'cover',
    opacity: 0.05,
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(to right, #3B82F6, #2563EB)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#EFF6FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: '#3B82F6',
}));

const Home = () => {
  const theme = useTheme();

  const features = [
    {
      title: 'AI Content Generation',
      description: 'Create engaging content in seconds with advanced AI that understands your brand voice.',
      icon: Brain,
    },
    {
      title: 'Smart Scheduling',
      description: 'Schedule content at optimal times across all platforms for maximum engagement.',
      icon: Calendar,
    },
    {
      title: 'Advanced Analytics',
      description: 'Track performance and get AI-powered insights to optimize your strategy.',
      icon: BarChart2,
    },
    {
      title: 'A/B Testing',
      description: 'Test different variations of your content to maximize performance.',
      icon: Target,
    },
    {
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team with advanced collaboration features.',
      icon: Users,
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-level security with advanced encryption and access controls.',
      icon: Shield,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center" position="relative">
            <Typography variant="h1" align="center" gutterBottom>
              AI-Powered Marketing
              <br />
              <GradientText variant="h1" component="span">
                Made Simple
              </GradientText>
            </Typography>
            <Typography variant="h5" align="center" color="grey.400" maxWidth="md">
              Create, schedule, and analyze your marketing content with AI.
              Now with flexible payment options and usage-based pricing.
            </Typography>
            <Stack direction="row" spacing={2}>
              <RouterLink
                to="/signup"
                className="px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors duration-200 flex items-center"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Get Started
              </RouterLink>
              <RouterLink
                to="/features"
                className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#3B82F6] transition-colors duration-200"
              >
                See Features
              </RouterLink>
            </Stack>
          </Stack>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ py: 12, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" gutterBottom>
            Everything you need to succeed
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Powerful features to supercharge your marketing efforts
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard>
                  <CardContent>
                    <IconWrapper>
                      <feature.icon size={24} />
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 12, backgroundColor: theme.palette.secondary.main }}>
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center">
            <Typography variant="h2" align="center" color="common.white">
              Ready to get started?
            </Typography>
            <Typography variant="h5" align="center" color="grey.400">
              Join thousands of marketers already using Megarray
            </Typography>
            <Stack direction="row" spacing={2}>
              <RouterLink
                to="/signup"
                className="px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors duration-200"
              >
                Start Free Trial
              </RouterLink>
              <RouterLink
                to="/contact"
                className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#3B82F6] transition-colors duration-200"
              >
                Contact Sales
              </RouterLink>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;