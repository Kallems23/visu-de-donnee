import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function PizzaSales() {
  const chartRef = useRef(null);

  useEffect(() => {
    d3.csv('http://localhost:8000/data/pizza_name_per_hour_per_type.csv').then((data) => {
      data.forEach((d) => {
        const [start, end] = d.Intervalle.split('-');
        const startTime = d3.timeParse('%H:%M')(start);
        d.time = startTime;

        Object.keys(d).forEach((key) => {
          if (key !== 'Intervalle' && key !== 'time') {
            d[key] = +d[key] || 0;
          }
        });
      });

      const width = 500;
      const height = 300;
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };

      const svg = d3
        .select(chartRef.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleTime()
        .domain(d3.extent(data, (d) => d.time))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d3.max(Object.values(d).slice(1)))])
        .range([height, 0]);

      const tooltip = d3
        .select(chartRef.current)
        .append('div')
        .style('position', 'absolute')
        .style('background', '#fff')
        .style('border', '1px solid #ccc')
        .style('padding', '5px')
        .style('border-radius', '5px')
        .style('visibility', 'hidden');

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

      svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
      svg.append('g').call(d3.axisLeft(y));

      return () => {
        d3.select(chartRef.current).selectAll('*').remove();
      };
    });
  }, []);

  return <div ref={chartRef} />;
}


export default PizzaSales;
