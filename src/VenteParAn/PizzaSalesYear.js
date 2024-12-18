import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function StackedPizzaSalesByMonth() {
    const svgRef = useRef();
    const [data, setData] = useState([]);

    const customColors = [
      "#366b8f", "#d77e30", "#468e46", "#b84444", "#7e5f92",
      "#8f5235", "#c2699f", "#5f5f5f", "#9ea42e", "#1b8d9f",
      "#437996", "#76b47e", "#e6a04f", "#bc3e36", "#6f428b",
      "#cc9e00", "#bd2b28", "#48934e", "#28669f", "#c66194",
      "#9d5c40", "#8b5294", "#7c7c7c", "#529c7c", "#dd7f52",
      "#7693af", "#bb72ae", "#7fb359", "#dcb44a", "#b79176",
      "#8f8f8f", "#875233"
  ];
  
    const monthNames = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];  

    useEffect(() => {
        // Charger et transformer les données
        d3.csv("http://localhost:8000/data/pizza_name_per_month.csv").then((loadedData) => {
            const formattedData = loadedData.map(row => {
                const month = +row.Mois; // Convertir le mois en nombre
                const pizzas = Object.keys(row)
                    .filter(key => key !== "Mois") // Exclure la colonne "Mois"
                    .reduce((obj, key) => {
                        obj[key] = +row[key]; // Convertir les ventes en nombre
                        return obj;
                    }, {});
                return { month, ...pizzas };
            });
            setData(formattedData);
        });
    }, []);

    useEffect(() => {
        if (data.length === 0) return;

        // Dimensions et marges
        const width = 960;
        const height = 500;
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 40;

        // Extraire les types de pizzas
        const pizzaTypes = Object.keys(data[0]).filter(key => key !== "month");

        // Empiler les données
        const stack = d3.stack().keys(pizzaTypes)(data);

        // Échelles
        const x = d3
            .scaleBand()
            .domain(data.map(d => d.month))
            .range([marginLeft, width - marginRight])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(stack, layer => d3.max(layer, d => d[1]))])
            .nice()
            .range([height - marginBottom, marginTop]);

        // const color = d3
        //     .scaleOrdinal()
        //     .domain(pizzaTypes)
        //     .range(d3.schemeCategory10); // Couleurs différentes pour chaque type de pizza
        const color = d3.scaleOrdinal()
            .domain(pizzaTypes)
            .range(customColors);

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Effacer tout contenu précédent

        // Ajouter les barres empilées
        svg.append('g')
            .selectAll('g')
            .data(stack)
            .join('g')
            .attr('fill', d => color(d.key)) // Couleur basée sur le type de pizza
            .selectAll('rect')
            .data(d => d)
            .join('rect')
            .attr('x', d => x(d.data.month))
            .attr('y', d => y(d[1]))
            .attr('height', d => y(d[0]) - y(d[1]))
            .attr('width', x.bandwidth());

        // Ajouter les axes
        svg.append('g')
            .attr('transform', `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).tickFormat(d => monthNames[d - 1]))
            .call(g =>
                g.append('text')
                    .attr('x', width)
                    .attr('y', marginBottom - 4)
                    .attr('fill', 'currentColor')
                    .attr('text-anchor', 'end')
                    .text('Mois →')
            );

        svg.append('g')
            .attr('transform', `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select('.domain').remove())
            .call(g =>
                g.append('text')
                    .attr('x', -marginLeft)
                    .attr('y', 10)
                    .attr('fill', 'currentColor')
                    .attr('text-anchor', 'start')
                    .text('↑ Total des ventes')
            );

          // Ajouter la légende avec l'ordre inversé sur 2 colonnes
          const legend = svg.append('g')
              .attr('transform', `translate(${width - marginRight + 50}, ${marginTop + 100})`);

          const numColumns = 2; // Nombre de colonnes souhaité
          const rowHeight = 20; // Hauteur entre chaque ligne
          const columnWidth = 150; // Largeur entre les colonnes

          pizzaTypes.slice().reverse().forEach((type, i) => { // Inverser l'ordre
              const column = i % numColumns; // Calculer la colonne (0 ou 1)
              const row = Math.floor(i / numColumns); // Calculer la ligne

              const legendRow = legend.append('g')
                  .attr('transform', `translate(${column * columnWidth}, ${row * rowHeight})`);

              legendRow.append('rect')
                  .attr('width', 15)
                  .attr('height', 15)
                  .attr('fill', color(type));

              legendRow.append('text')
                  .attr('x', 20)
                  .attr('y', 12.5)
                  .attr('fill', 'black')
                  .text(type);
          });
    }, [data]);

    return <svg ref={svgRef} width={1500} height={500}></svg>;
}

export default StackedPizzaSalesByMonth;