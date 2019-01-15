d3.json("GDP-data.json").then(d => {
  const parseTime = d3.timeParse("%Y-%m-%d");
  const formatTime = d3.timeFormat("%Y-%m-%d");
  let prevGdp = 0;
  let dataset = d.data.map(e => {
    growth = (e[1] - prevGdp) / prevGdp * 100;
    prevGdp = e[1]
    return {
      time: parseTime(e[0]),
      gdp: e[1],
      growth,
      getBarColor() { return this.growth >= 0 ? "green" : "red"; },
      getTimeStamp() { return `${this.time.getFullYear()} Q${Math.floor((this.time.getMonth() + 3) / 3)}` },
      getGdp() { return `$${this.gdp.toLocaleString()} Billion` },
      getGrowth() { return `${this.growth <= 0 ? "" : "+"}${this.growth.toFixed(2)}%` }
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


  const svg = d3.select('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('fill', d => d.getBarColor())
    .attr('width', barWidth)
    .attr('height', d => yScale(0) - yScale(d.gdp))
    .attr('x', (d, i) => xScale(d.time))
    .attr('y', d => contentHeight + margin.top - yScale(0) + yScale(d.gdp))
    .attr('data-date', d => formatTime(d.time))
    .attr('data-gdp', d => d.gdp)
    .on("mouseover", function (d) {
      d3.select(this).attr("fill", "aqua");

      //Get this bar's x/y values, then augment for the tooltip
      var xPosition = parseFloat(d3.select(this).attr("x")); //+ xScale.bandwidth() / 2;
      var yPosition = parseFloat(d3.select(this).attr("y")); //+ yScale.bandwidth() / 2;
      //Update the tooltip position and value
      const tooltip = d3.select("#tooltip")
        .attr('data-date', formatTime(d.time))
        .style("left", xPosition + "px")
        .style("top", yPosition + "px");
      tooltip.select("#time").text(d.getTimeStamp());
      tooltip.select("#gdp").text(d.getGdp());
      tooltip.select("#growth").text(d.getGrowth());
      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("fill", d.getBarColor());
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);
    });

  const xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("class", "axis")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${margin.top + contentHeight})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("class", "axis")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(yAxis);

  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 30)
    .attr("x", - svgHeight / 3)
    .attr("dy", "1.8em")
    .style("text-anchor", "middle")
    .text("Gross Domestic Product");
});
