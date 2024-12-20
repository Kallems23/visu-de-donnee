import { 
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme
} from '@mui/material';
import { 
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon 
} from '@mui/icons-material';
import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import VenteparAn from '../VenteParAn/VenteparAn';

function HomePage() {
  const theme = useTheme();

  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/visu-de-donnee/pizza-background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            color="inherit"
            gutterBottom
          >
            Découvrez les tendances de la pizza
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            Analysez les ventes et préférences des consommateurs
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            <Link to="/vente-par-an" style={{ textDecoration: 'none', color: 'inherit' }}>
              Voir les statistiques
            </Link>
          </Button>
        </Container>
      </Box>

      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <TimelineIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h2">
                  Ventes Mensuelles
                </Typography>
                <Typography>
                  Suivez l'évolution des ventes par type de pizza
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h2">
                  Préférences Client
                </Typography>
                <Typography>
                  Analysez les goûts des consommateurs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h2">
                  Tendances
                </Typography>
                <Typography>
                  Identifiez les pizzas populaires
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Routes>
          <Route path="/vente-par-an" element={<VenteparAn />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default HomePage;
