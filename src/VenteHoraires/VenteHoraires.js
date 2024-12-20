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

import PizzaSales from './PizzaSales';

const VenteHoraires = () => {
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
    // ... ajoutez les autres types
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
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ventes Mensuelles par Type de Pizza
        </Typography>
        
        <PizzaSales/>

        <Grid container spacing={2}>

          <Grid item xs={12} md={9}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Analyse du graphique
              </Typography>

                <Typography variant="h6" gutterBottom>
                  Représentation
                </Typography>
                  <Typography paragraph>
                    Le graphique représente le nombre de pizza vendues par type et par intervalle de demi-heure sur toute l'année.
                  </Typography>

                <Typography variant="h6" gutterBottom>
                  Graphique : courbes multiples 
                </Typography>
                  <Typography paragraph>
                    Ce type de graphique permet d'avoir rapidement l'information sur le nombre de pizzas maximum vendues.
                  </Typography>

                <Typography variant="h6" gutterBottom>
                  Couleur
                </Typography>
                  <Typography paragraph>
                    Des couleurs assez hétérogènes ont été choisies pour pouvoir avoir plus de précision sur la répartition des types de pizzas vendues.
                  </Typography>

                <Typography variant="h6" gutterBottom>
                  Échelles de mesure 
                </Typography>
                  <Typography paragraph>
                    Les échelles de mesure choisies sont : nominative, ordinale et intervalle.
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
                        La variable visuelle "teinte" nous permet de visualiser les types de pizzas vendues.
                      </Typography>
                    </Box>
                    <Typography variant="h7" gutterBottom>
                      <b>• Ordinale :</b>
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography gutterBottom>
                        La variable visuelle "longueur" nous permet de visualiser le nombre de pizzas vendues.
                      </Typography>
                    </Box>
                    <Typography variant="h7" gutterBottom>
                      <b>• Intervalle :</b>
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography gutterBottom>
                        La variable visuelle "position" nous permet de visualiser les heures (en abscisses).
                      </Typography>
                    </Box>
                  </Box>

                <Typography variant="h6" gutterBottom>
                  Analyse du graphique 
                </Typography>
                  <Typography paragraph>
                    On voit que les moments où l'on recense le plus de ventes est entre 12:00 et 13:30 et entre 17:30 et 19:30. Contrairement aux habitudes françaises, ces créneaux correspondent aux heures habituelles/tradionnelles de dîners pour les États-Uniens, c'est pourquoi l'on recense le plus de pizzas vendues à ces heures là.<br/>
                    On peut aussi déduire les horaires d'ouverture de la pizzeria : 9:00-00:00.
                  </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default VenteHoraires;