import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function PizzaSales() {
  const chartRef = useRef(null);

  useEffect(() => {
    const data = [
      {
        name: "USA",
        values: [
          { date: "2000", price: "100", price2: "50" },
          { date: "2001", price: "110", price2: "70" },
          { date: "2002", price: "145", price2: "45" },
          { date: "2003", price: "241", price2: "86" },
          { date: "2004", price: "101", price2: "21" },
          { date: "2005", price: "90", price2: "25" },
          { date: "2006", price: "10", price2: "34" },
          { date: "2007", price: "35", price2: "52" },
          { date: "2008", price: "21", price2: "45" },
          { date: "2009", price: "201", price2: "54" },
        ],
      },
    ];

    const parseDate = d3.timeParse("%Y");
    data.forEach((d) => d.values.forEach((v) => (v.date = parseDate(v.date))));

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data[0].values, (d) => d.date))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data[0].values, (d) => Math.max(d.price, d.price2))])
      .range([height, 0]);

    const line1 = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.price));

    const line2 = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.price2));

    // Add tooltip
    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("visibility", "hidden");

    // Draw lines
    const drawLineWithTooltip = (lineData, lineGenerator, color, label) => {
      svg
        .append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", lineGenerator)
        .on("mouseover", () => {
          tooltip.style("visibility", "visible");
        })
        .on("mousemove", (event) => {
          const [xPos] = d3.pointer(event);
          const date = x.invert(xPos);
          const closestData = lineData.reduce((prev, curr) =>
            Math.abs(curr.date - date) < Math.abs(prev.date - date) ? curr : prev
          );
          tooltip
            .html(`${label}: ${closestData[label]}<br>Date: ${d3.timeFormat("%Y")(closestData.date)}`)
            .style("top", `${event.pageY - 10}px`)
            .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });
    };

    drawLineWithTooltip(data[0].values, line1, "steelblue", "price");
    drawLineWithTooltip(data[0].values, line2, "orange", "price2");

    // Add axes
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
    };
  }, []);

  return <div ref={chartRef} />;
}

export default PizzaSales;





/*function PizzaSales({
  x = ([x]) => x,
  y = ([, y]) => y,
  z = () => 1,
  title,
  defined,
  curve = d3.curveLinear,
  marginTop = 20,
  marginRight = 30,
  marginBottom = 30,
  marginLeft = 40,
  width = 640,
  height = 400,
  xType = d3.scaleUtc,
  xDomain,
  xRange = [marginLeft, width - marginRight],
  yType = d3.scaleLinear,
  yDomain,
  yRange = [height - marginBottom, marginTop],
  yFormat,
  yLabel,
  zDomain,
  color = "currentColor",
  strokeLinecap,
  strokeLinejoin,
  strokeWidth = 1.5,
  strokeOpacity,
  mixBlendMode = "multiply",
  voronoi
}) {

  const [data, setData] = useState(null); // State for storing the data

  useEffect(() => {
    async function fetchData() {
      try {
        const csvData = await d3.csv("http://localhost:8000/data/pizza_name_per_hour_per_type.csv");
        const formattedData = csvData.map(d => ({
          name: d.Intervalle,
          bbq_ckn: +d.bbq_ckn,
          big_meat: +d.big_meat,
          brie_carre: +d.brie_carre,
          calabrese: +d.calabrese,
          cali_ckn: +d.cali_ckn,
          ckn_alfredo: +d.ckn_alfredo,
          ckn_pesto: +d.ckn_pesto,
          classic_dlx: +d.classic_dlx,
          five_cheese: +d.five_cheese,
          four_cheese: +d.four_cheese,
          green_garden: +d.green_garden,
          hawaiian: +d.hawaiian,
          ital_cpcllo: +d.ital_cpcllo,
          ital_supr: +d.ital_supr,
          ital_veggie: +d.ital_veggie,
          mediterraneo: +d.mediterraneo,
          mexicana: +d.mexicana,
          napolitana: +d.napolitana,
          pep_msh_pep: +d.pep_msh_pep,
          pepperoni: +d.pepperoni,
          peppr_salami: +d.peppr_salami,
          prsc_argla: +d.prsc_argla,
          sicilian: +d.sicilian,
          soppressata: +d.soppressata,
          southw_ckn: +d.southw_ckn,
          spicy_ital: +d.spicy_ital,
          spin_pesto: +d.spin_pesto,
          spinach_fet: +d.spinach_fet,
          spinach_supr: +d.spinach_supr,
          thai_ckn: +d.thai_ckn,
          the_greek: +d.the_greek,
          veggie_veg: +d.veggie_veg
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    }

    fetchData();
  }, []);

  // Add a guard clause to ensure data is loaded before proceeding
  if (!data) {
    return <div>Loading...</div>; // Display a loading message until data is loaded
  }

  // Ensure that the data is available before proceeding with calculations
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  //const O = d3.map(data, d => d);

  // Ensure defined is set
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute domains for scales
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y, d => typeof d === "string" ? +d : d)];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  // Construct scales and axes
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

  // Construct a line generator
  const line = d3.line()
    .defined(i => D[i])
    .curve(curve)
    .x(i => xScale(X[i]))
    .y(i => yScale(Y[i]));

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .style("-webkit-tap-highlight-color", "transparent");

  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis);

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(g => g.select(".domain").remove());

  svg.append("g")
    .attr("fill", "none")
    .attr("stroke", typeof color === "string" ? color : null)
    .attr("stroke-width", strokeWidth)
    .attr("stroke-opacity", strokeOpacity)
    .selectAll("path")
    .data(d3.group(I, i => Z[i]))
    .join("path")
    .attr("d", ([, I]) => line(I));

  return Object.assign(svg.node(), { value: null });
}

export default PizzaSales;
*/
