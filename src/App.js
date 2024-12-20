// src/App.js
import React from "react";
import HomePage from "./HomePage/HomePage";
import VenteHoraires from "./VenteHoraires/VenteHoraires";
import VenteparAn from "./VenteParAn/VenteparAn";
import PreferenceClient from "./PreferenceClient/PreferenceClient";
import About from "./About/About";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

function App() {
  return (
    <BrowserRouter basename="/visu-de-donnee">
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1, cursor: 'pointer', }}
            >
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                🍕 PizzAnalytics
              </Link>
            </Typography>
            <Button color="inherit" component={Link} to="/vente-par-an">
              Ventes annuelles
            </Button>
            <Button color="inherit" component={Link} to="/vente-horaires">
              Ventes horaires
            </Button>
            <Button color="inherit" component={Link} to="/preferences-client">
              Préférences client
            </Button>
            <Button color="inherit" component={Link} to="/about">
              À propos
            </Button>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vente-par-an" element={<VenteparAn />} />
          <Route path="/vente-horaires" element={<VenteHoraires />} />
          <Route path="/preferences-client" element={<PreferenceClient />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
