// src/App.js
import React from "react";
import HomePage from "./HomePage/HomePage";
import VenteparMois from "./VenteParMois/VenteparMois";
import VenteparAn from "./VenteParAn/VenteparAn";
import PreferenceClient from "./PreferenceClient/PreferenceClient";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";

import { AppBar, Button, Toolbar, Typography } from "@mui/material";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🍕 PizzaAnalytics
            </Typography>
            <Button color="inherit" component={Link} to="/vente-par-an">
              Ventes annuelles
            </Button>
            <Button color="inherit" component={Link} to="/vente-par-mois">
              Ventes mensuelles
            </Button>
            <Button color="inherit" component={Link} to="/preferences-client">
              Préférences client
            </Button>
            <Button color="inherit">Analytics</Button>
            <Button color="inherit">À propos</Button>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vente-par-an" element={<VenteparAn />} />
          <Route path="/vente-par-mois" element={<VenteparMois />} />
          <Route path="/preferences-client" element={<PreferenceClient />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
