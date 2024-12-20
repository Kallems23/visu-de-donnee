import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';

function CamembertSize() {
    const [data, setData] = useState(null); // État pour stocker les données CSV

    useEffect(() => {
        async function fetchData() {
            try {
                const csvData = await d3.csv("http://localhost:8000/data/size_percentage.csv");
                // Assurez-vous que les données sont au bon format (nombre pourcentage)
                const formattedData = csvData.map(d => ({
                    name: d.Taille, // Adaptez selon les colonnes de votre CSV
                    value: +d.Pourcentage // Conversion en nombre
                }));
                console.log("Données chargées :", formattedData);
                setData(formattedData);
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
            }
        }

        fetchData();
    }, []);
    

    // Vérifier si les données sont prêtes
    if (!data || data.length === 0) {
        return <p>Chargement des données...</p>;
    }


  // Dimensions du graphique
  const width = 928;
  const height = Math.min(width, 500);

  // Create the color scale
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

  // Create the pie layout and arc generator
  const pie = d3.pie()
    .sort(null)
    .value(d => d.value);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1);

  const labelRadius = Math.min(width, height) / 2 * 0.8;

  const arcLabel = d3.arc()
    .innerRadius(labelRadius)
    .outerRadius(labelRadius);

  const arcs = pie(data);

  // Create the SVG container
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  svg.append("g")
    .attr("stroke", "white")
    .selectAll("path")
    .data(arcs)
    .join("path")
    .attr("fill", d => color(d.data.name))
    .attr("d", arc)
    .append("title")
    .text(d => `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);

  svg.append("g")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .attr("font-size", "100000px") 
    .data(arcs)
    .join("text")
    .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
    .call(text => text.append("tspan")
      .attr("y", "-0.4em")
      .attr("font-weight", "bold")
      .text(d => d.data.name))
    .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
      .attr("x", 0)
      .attr("y", "0.7em")
      .attr("fill-opacity", 0.7)
      .text(d => d.data.value.toLocaleString("en-US")));

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg.node().outerHTML }}
    />
  );
};

export default CamembertSize;
