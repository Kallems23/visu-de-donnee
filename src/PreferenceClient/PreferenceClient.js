import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Grid
} from '@mui/material';
import * as d3 from 'd3';
import CamembertSize from './CamembertSize';
import CamembertType from './CamembertType';

const PreferenceClient = () => {
  const [selectedPizzas, setSelectedPizzas] = useState({});
  const [data, setData] = useState([]);

  // Définition des dimensions du graphique
  const margin = { top: 20, right: 120, bottom: 30, left: 60 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Définition des échelles
  const x = useMemo(() =>
    d3.scaleLinear()
      .domain([1, 12])
      .range([0, width]),
    [width]
  );

  const y = useMemo(() =>
    d3.scaleLinear()
      .domain([0, d3.max(data, d => d.sales)])
      .range([height, 0]),
    [height, data]
  );

  // Liste des types de pizzas
  const pizzaTypes = [
    'Margherita', 'Regina', 'Quatre Fromages', 'Végétarienne',
    'Pepperoni', 'Hawaienne', 'Calzone', 'Napolitaine'
  ];

  // Filtrer les données en fonction des pizzas sélectionnées
  const filteredData = useMemo(() =>
    data.filter(d => selectedPizzas[d.pizzaType]),
    [data, selectedPizzas]
  );

  // Configuration du graphique D3
  useEffect(() => {
    if (!data.length) return;
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Création des lignes avec labels directs
    const line = d3.line()
      .x(d => x(d.month))
      .y(d => y(d.sales));

    // Ajout des labels à la fin des lignes
    svg.selectAll(".line-label")
      .data(filteredData)
      .enter()
      .append("text")
      .attr("class", "line-label")
      .attr("x", d => x(d[d.length - 1].month))
      .attr("y", d => y(d[d.length - 1].sales))
      .text(d => d[0].pizzaType);

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data, selectedPizzas, x, y, width, height, margin, filteredData]);

  const handlePizzaToggle = (pizzaType) => {
    setSelectedPizzas(prev => ({
      ...prev,
      [pizzaType]: !prev[pizzaType]
    }));
  };

  return (
    <Container sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '100% !important'
    }}>
      {/* Taille des pizzas */}
      <Box sx={{ 
        my: 4, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography variant="h4" gutterBottom align="center">
          Pourcentage des tailles des pizzas vendues
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <CamembertSize />
        </Box>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={9}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Analyse du graphique
              </Typography>

                <Typography variant="h6" gutterBottom>
                  Représentation
                </Typography>
                  <Typography paragraph>
                    Le graphique représente le pourcentage des tailles de pizzas vendues à l'année.
                  </Typography>

                <Typography variant="h6" gutterBottom>
                  Camembert  
                </Typography>
                  <Typography paragraph>
                    Ce type de graphique permet d'avoir rapidement l'information sur les principaux clusters.
                  </Typography>

                <Typography variant="h6" gutterBottom>
                  Couleur
                </Typography>
                  <Typography paragraph>
                    Des couleurs assez hétérogène ont été choisies pour pouvoir avoir plus de précision sur la répartition des types de pizzas vendues.
                  </Typography>

                <Typography variant="h6" gutterBottom>
                  Échelles de mesure 
                </Typography>
                  <Typography paragraph>
                    Les échelles de mesure choisies sont : nominative et ordinale.
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Variables visuelles
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="h7" gutterBottom>
                      <b>• Nominative :</b>
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography gutterBottom>
                        La variable visuelle "teinte" nous permet de visualiser les tailles de pizzas vendues (le survol des sections affichent le nom de la taille).
                      </Typography>
                    </Box>
                    <Typography variant="h7" gutterBottom>
                      <b>• Ordinale :</b>
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography gutterBottom>
                        La variable visuelle "position" nous permet de visualiser le pourcentage de tailles vendues pour chaque catégorie (entre : S, M, L, XL et XXL).
                      </Typography>
                    </Box>
                  </Box>

                <Typography variant="h6" gutterBottom>
                  Analyse du graphique 
                </Typography>
                  <Typography paragraph>
                    On voit que les ventes sur les types S, M et L sont bien réparties et représentent environ 1 tier chacune. Les tailles XL et XXL sont très peu représentées.<br/>
                    Ce graphique est très intéressant dans le sens où l'on dit souvent que les entreprises ont tendance à mettre un prix très élevé pour la taille S (par exemple 10€) mais moins important pour le M (par exemple 12€) et un prix assez proche du M pour le L pour influencer le client à prendre la taille la plus grande (par exemple 13€). Ici, cela semble être le cas, la taille L est la plus élevée, bien qu'il y ait presque autant de S que de M semblent vendues. Les tailles XL et XXL ne doivent probablement pas être aussi avantageuses.
                  </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Type des pizzas */}
      <Box sx={{ 
        my: 4, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography variant="h4" gutterBottom align="center">
          Pourcentage de répartition des types de pizzas vendues
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <CamembertType />
        </Box>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={9}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Analyse du graphique
              </Typography>

                <Typography variant="h6" gutterBottom>
                  Représentation
                </Typography>
                  <Typography paragraph>
                    Le graphique représente le pourcentage des types pizzas vendues à l'année.
                  </Typography>

                <Typography variant="h6" gutterBottom>
                  Camembert  
                </Typography>
                  <Typography paragraph>
                    Ce type de graphique permet d'avoir rapidement l'information sur les principaux clusters de types de pizzas.
                  </Typography>

                <Typography variant="h6" gutterBottom>
                  Couleur
                </Typography>
                  <Typography paragraph>
                    Des couleurs assez hétérogène ont été choisies pour pouvoir avoir plus de précision sur la répartition des types de pizzas vendues.
                  </Typography>

                <Typography variant="h6" gutterBottom>
                  Échelles de mesure 
                </Typography>
                  <Typography paragraph>
                    Les échelles de mesure choisies sont : nominative et ordinale.
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Variables visuelles
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="h7" gutterBottom>
                      <b>• Nominative :</b>
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography gutterBottom>
                        La variable visuelle "teinte" nous permet de visualiser les types de pizzas vendues (le survol des sections affichent le nom du type).
                      </Typography>
                    </Box>
                    <Typography variant="h7" gutterBottom>
                      <b>• Ordinale :</b>
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography gutterBottom>
                        La variable visuelle "position" nous permet de visualiser le pourcentage de types de pizzas vendues pour chaque catégorie (au survol souris si besoin).
                      </Typography>
                    </Box>
                  </Box>

                <Typography variant="h6" gutterBottom>
                  Analyse du graphique 
                </Typography>
                  <Typography paragraph>
                    On voit que chaque type de pizza semble aussi bien vendu que les autres. Cela peut indiquer que le restaurateur a compris les principales demandes de ces consommateurs.
                  </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PreferenceClient;