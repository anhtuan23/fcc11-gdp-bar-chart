d3.json("GDP-data.json").then(d => {
  const parseTime = d3.timeParse("%Y-%m-%d");
  let dataset = d.data.map(e => ({
    time: parseTime(e[0]),
    gdp: e[1]
  }));

  const margin = { top: 20, right: 10, bottom: 20, left: 10 };

  const svgWidth = 1000, svgHeight = 500;
  const contentWidth = svgWidth - margin.left - margin.right,
    contentHeight = svgHeight - margin.top - margin.bottom;

  const barPadding = 1;
  const barWidth = contentWidth / dataset.length - barPadding;

  let prev = 0;

  const minTime = dataset[0].time,
    maxTime = dataset[dataset.length - 1].time;
  const xScale = d3.scaleTime().domain([minTime, maxTime]).range([0, contentWidth + margin.right + margin.left]);

  const maxGdp = d3.max(dataset, d => d.gdp);
  const yScale = d3.scaleLinear().domain([0, maxGdp]).range([0, contentHeight]);


  const svg = d3.select('#wrapper')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background-color', '#DDD')
    .style('padding', `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`);

  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('fill', (d, i) => {
      prev = dataset[i - 1] ? dataset[i - 1] : dataset[0];//dataset[-1] is undefined
      return (d.gdp - prev.gdp) >= 0 ? "green" : "red"
    })
    .attr('width', barWidth)
    .attr('height', d => yScale(d.gdp))
    .attr('x', (d, i) => xScale(d.time))
    .attr('y', d => contentHeight + margin.top + margin.bottom - yScale(d.gdp));
  // .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("class", "axis")
    .call(xAxis);
});

