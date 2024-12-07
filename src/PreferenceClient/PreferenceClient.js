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
          Pourcentage de pizzas vendues selon leur taille
        </Typography>
        
        <CamembertSize/>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Types de Pizza
              </Typography>
              <FormGroup>
                {pizzaTypes.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={selectedPizzas[type] || false}
                        onChange={() => handlePizzaToggle(type)}
                      />
                    }
                    label={type}
                  />
                ))}
              </FormGroup>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Analyse des Tendances
              </Typography>
              <Typography paragraph>
                L'analyse des ventes mensuelles révèle des tendances saisonnières marquées 
                dans la consommation de pizzas. Les pizzas légères et végétariennes connaissent 
                une hausse significative pendant les mois d'été, tandis que les pizzas plus 
                garnies sont privilégiées en hiver.
              </Typography>
              <Typography paragraph>
                On observe également que certains types de pizzas maintiennent une popularité 
                constante tout au long de l'année, notamment les classiques comme la Margherita 
                et la Regina, qui représentent une base stable de nos ventes.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PreferenceClient;