import React from 'react';
import * as d3 from 'd3';

class PizzaSales extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.config = {
      width: 500,
      height: 300,
      margin: { top: 20, right: 20, bottom: 30, left: 50 }
    };
  }

  componentDidMount() {
    // Nettoyer avant de créer le graphique
    d3.select(this.chartRef.current).selectAll('*').remove();
    this.createChart();
  }

  componentWillUnmount() {
    d3.select(this.chartRef.current).selectAll('*').remove();
  }

  createChart() {
    // Vérifier si le composant est toujours monté
    if (!this.chartRef.current) return;

    d3.csv('http://localhost:8000/data/pizza_name_per_hour_per_type.csv')
      .then((data) => {
        // Traitement des données
        data.forEach((d) => {
          const [start] = d.Intervalle.split('-');
          d.time = d3.timeParse('%H:%M')(start);
          Object.keys(d).forEach((key) => {
            if (key !== 'Intervalle' && key !== 'time') {
              d[key] = +d[key] || 0;
            }
          });
        });

        // S'assurer qu'il n'y a pas déjà un SVG
        d3.select(this.chartRef.current).select('svg').remove();

        // Création du SVG
        const svg = d3
          .select(this.chartRef.current)
          .append('svg')
          .attr('width', this.config.width + this.config.margin.left + this.config.margin.right)
          .attr('height', this.config.height + this.config.margin.top + this.config.margin.bottom)
          .append('g')
          .attr('transform', `translate(${this.config.margin.left},${this.config.margin.top})`);

        // Échelles
        const x = d3.scaleTime()
          .domain(d3.extent(data, (d) => d.time))
          .range([0, this.config.width]);

        const y = d3.scaleLinear()
          .domain([0, d3.max(data, (d) => d3.max(Object.values(d).slice(1)))])
          .range([this.config.height, 0]);

        // Tooltip
        const tooltip = d3
          .select(this.chartRef.current)
          .append('div')
          .style('position', 'absolute')
          .style('background', '#fff')
          .style('border', '1px solid #ccc')
          .style('padding', '5px')
          .style('border-radius', '5px')
          .style('visibility', 'hidden');

        // Création des lignes pour chaque type de pizza
        Object.keys(data[0]).forEach((key, index) => {
          if (key !== 'Intervalle' && key !== 'time') {
            const line = d3.line()
              .x((d) => x(d.time))
              .y((d) => y(d[key]));

            svg
              .append('path')
              .datum(data)
              .attr('fill', 'none')
              .attr('stroke', d3.schemeCategory10[index % 10])
              .attr('stroke-width', 2)
              .attr('d', line)
              .on('mouseover', () => {
                tooltip.style('visibility', 'visible');
              })
              .on('mousemove', (event) => {
                const [xPos] = d3.pointer(event);
                const time = x.invert(xPos);
                const closestData = data.reduce((prev, curr) =>
                  Math.abs(curr.time - time) < Math.abs(prev.time - time) ? curr : prev
                );
                tooltip
                  .html(`${key}: ${closestData[key]}<br>Time: ${d3.timeFormat('%H:%M')(closestData.time)}`)
                  .style('top', `${event.pageY - 10}px`)
                  .style('left', `${event.pageX + 10}px`);
              })
              .on('mouseout', () => {
                tooltip.style('visibility', 'hidden');
              });
          }
        });

        // Axes
        svg.append('g')
          .attr('transform', `translate(0,${this.config.height})`)
          .call(d3.axisBottom(x));

        svg.append('g')
          .call(d3.axisLeft(y));
      });
  }

  render() {
    return <div ref={this.chartRef} />;
  }
}

export default PizzaSales;