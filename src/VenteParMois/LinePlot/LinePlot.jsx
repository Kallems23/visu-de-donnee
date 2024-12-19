import * as d3 from "d3";

export default function LinePlot({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20
}) {
  data = await d3.csv("http://localhost:8000/pizza_name_per_mounth_percentage.csv")
  console.log(data);
  const pizzaTypes = Object.keys(data[0]).filter((key) => key !== 'Mois');
const pizzaData = pizzaTypes.map((type) => ({
  pizza: type,
  values: data.map((entry) => parseFloat(entry[type])),
}));

console.log(pizzaData);
  const x = d3.scaleLinear([1, 12], [marginLeft, width - marginRight]);
  const y = d3.scaleLinear(pizzaData[0].values, [height - marginBottom, marginTop]);
  const line = d3.line((d, i) => x(i), y);
  return (
    <svg width={width} height={height}>
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />))}
      </g>
    </svg>
  );
}