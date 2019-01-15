d3.json("GDP-data.json").then(d => {
  const parseTime = d3.timeParse("%Y-%m-%d");
  let prevGdp = 0;
  let dataset = d.data.map(e => {
    growth = (e[1] - prevGdp) / prevGdp;
    prevGdp = e[1]
    return {
      time: parseTime(e[0]),
      gdp: e[1],
      growth
    }
  });

  const margin = { top: 20, right: 10, bottom: 20, left: 40 };

  const svgWidth = 1000, svgHeight = 500;
  const contentWidth = svgWidth - margin.left - margin.right,
    contentHeight = svgHeight - margin.top - margin.bottom;

  const barPadding = 0;
  const barWidth = contentWidth / dataset.length - barPadding;

  const minTime = dataset[0].time,
    maxTime = dataset[dataset.length - 1].time;
  const xScale = d3.scaleTime().domain([minTime, maxTime]).range([margin.left, contentWidth + margin.left]);

  const maxGdp = d3.max(dataset, d => d.gdp);
  const yScale = d3.scaleLinear().domain([0, maxGdp]).range([contentHeight, 0]);//yScale is inverted for yAxis


  const svg = d3.select('#wrapper')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background-color', '#DDD');

  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('fill', d => getBarColor(d))
    .attr('width', barWidth)
    .attr('height', d => yScale(0) - yScale(d.gdp))
    .attr('x', (d, i) => xScale(d.time))
    .attr('y', d => contentHeight + margin.top - yScale(0) + yScale(d.gdp))
    .on("mouseover", function () { d3.select(this).attr("fill", "aqua"); })
    .on("mouseout", function (d) { d3.select(this).attr("fill", getBarColor(d)); });

  const xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${margin.top + contentHeight})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(yAxis);
});

function getBarColor(data) {
  return data.growth >= 0 ? "green" : "red"
}
