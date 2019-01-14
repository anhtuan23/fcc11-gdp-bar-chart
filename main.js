d3.json("GDP-data.json").then(d => {
  let dataset = d.data;

  const svgWidth = 1000, svgHeight = 500;

  const barPadding = 1;
  const barWidth = svgWidth / dataset.length - barPadding;

  let prev = 0;

  const bar = d3.select('#wrapper')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background-color', '#DDD')
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('fill', (d, i) => {
      prev = dataset[i - 1] ? dataset[i - 1] : dataset[0];//dataset[-1] is undefined
      return (d[1] - prev[1]) >= 0 ? "green" : "red"
    })
    .attr('width', barWidth)
    .attr('height', d => d[1] / 38)
    .attr('x', (d, i) => i * (barWidth + barPadding))
    .attr('y', d => (svgHeight - d[1] / 38));
    // .attr('transform', function (d, i) {
    //   return "translate(0," + i * barHeight + ")";
    // });
});

