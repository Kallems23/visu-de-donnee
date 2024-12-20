import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function StackedPizzaSalesByMonth() {
    const svgRef = useRef();
    const [data, setData] = useState([]);
    const [visibleTypes, setVisibleTypes] = useState({});
    const [colorMapping, setColorMapping] = useState({});
    
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
        d3.csv("http://localhost:8000/data/pizza_name_per_month.csv").then((loadedData) => {
            const formattedData = loadedData.map(row => {
                const month = +row.Mois;
                const pizzas = Object.keys(row)
                    .filter(key => key !== "Mois")
                    .reduce((obj, key) => {
                        obj[key] = +row[key];
                        return obj;
                    }, {});
                return { month, ...pizzas };
            });
            
            // Initialiser les types visibles et les couleurs fixes
            const initialVisibility = {};
            const initialColorMapping = {};
            Object.keys(formattedData[0])
                .filter(key => key !== "month")
                .forEach((type, index) => {
                    initialVisibility[type] = true;
                    initialColorMapping[type] = customColors[index % customColors.length];
                });
            setVisibleTypes(initialVisibility);
            setColorMapping(initialColorMapping);
            setData(formattedData);
        });
    }, []);

    useEffect(() => {
        if (data.length === 0) return;

        const width = 960;
        const height = 500;
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 40;

        const pizzaTypes = Object.keys(data[0])
            .filter(key => key !== "month")
            .filter(key => visibleTypes[key]);

        const stack = d3.stack().keys(pizzaTypes)(data);

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

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        svg.append('g')
            .selectAll('g')
            .data(stack)
            .join('g')
            .attr('fill', d => colorMapping[d.key])
            .selectAll('rect')
            .data(d => d)
            .join('rect')
            .attr('x', d => x(d.data.month))
            .attr('y', d => y(d[1]))
            .attr('height', d => y(d[0]) - y(d[1]))
            .attr('width', x.bandwidth());

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

        const legend = svg.append('g')
            .attr('transform', `translate(${width - marginRight + 50}, ${marginTop})`);

        const allPizzaTypes = Object.keys(data[0]).filter(key => key !== "month");
        const numColumns = 2;
        const rowHeight = 20;
        const columnWidth = 150;

        allPizzaTypes.reverse().forEach((type, i) => {
            const column = i % numColumns;
            const row = Math.floor(i / numColumns);
            const legendRow = legend.append('g')
                .attr('transform', `translate(${column * columnWidth}, ${row * rowHeight + 75})`);

            legendRow.append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', colorMapping[type])
                .style('opacity', visibleTypes[type] ? 1 : 0.3);

            legendRow.append('text')
                .attr('x', 20)
                .attr('y', 12.5)
                .attr('fill', 'black')
                .text(type);

            legendRow.style('cursor', 'pointer')
                .on('click', () => {
                    setVisibleTypes(prev => ({
                        ...prev,
                        [type]: !prev[type]
                    }));
                });
        });

    }, [data, visibleTypes, colorMapping]);

    return <svg ref={svgRef} width={1500} height={500}></svg>;
}

export default StackedPizzaSalesByMonth;