import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function StackedPizzaSalesByMonth() {
    const svgRef = useRef();
    const [data, setData] = useState([]);

    // const seq = d3.scaleSequentialQuantile(d3.interpolateRdYlBu)
    // .domain(Float32Array.from({ length: 1000 }, d3.randomNormal(0.5, 0.15)));
    // ramp(seq);
    // seq.quantiles(34)

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

        const color = d3
            .scaleOrdinal()
            .domain(pizzaTypes)
            .range(d3.schemeCategory10); // Couleurs différentes pour chaque type de pizza

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

        // Ajouter la légende
        const legend = svg.append('g')
            .attr('transform', `translate(${width - marginRight + 50}, ${marginTop})`);
        pizzaTypes.forEach((type, i) => {
            const legendRow = legend.append('g')
                .attr('transform', `translate(0, ${i * 20})`);
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

    return <svg ref={svgRef} width={1150} height={500}></svg>;
}

export default StackedPizzaSalesByMonth;