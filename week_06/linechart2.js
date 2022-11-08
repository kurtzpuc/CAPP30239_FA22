/* D3 Line Chart with Bisect Tooltip */

const height = 300,
  width = 800,
  margin = ({ top: 15, right: 30, bottom: 45, left: 50 });

const svg = d3.select("#barchart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

d3.csv('agg.csv').then(data => {
  console.log(data)

  let x = d3.scaleBand()
    .domain(data.map((d) => d.Month))
    .range([margin.left, width - margin.right]);

  let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Total)]).nice()
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y)
      .tickSizeOuter(0)
      .tickFormat(d => d)
      .tickSize(-width + margin.right + margin.left)
    );

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width - margin.right)
    .attr("y", height)
    .attr("dx", "0.5em")
    .attr("dy", "-0.5em")
    .text("Month");

  svg.append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top / 2)
    .attr("dx", "-0.5em")
    .attr("y", 10)
    .attr("transform", "rotate(-90)")
    .text("Count of Gender killed");



  let line_female= d3.line()
    .x(d => x(d.Month))
    .y(d => y(d.Female))
    .curve(d3.curveNatural); // more: https://observablehq.com/@d3/d3-line#cell-244

  svg.append("path")
    .datum(data)
    .attr("d", line_female)
    .attr("fill", "none")
    .attr("stroke", "red")
  

  let line_male= d3.line()
    .x(d => x(d.Month))
    .y(d => y(d.Male))
    .curve(d3.curveNatural); // more: https://observablehq.com/@d3/d3-line#cell-244

  svg.append("path")
    .datum(data)
    .attr("d", line_male)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    
  svg.selectAll("myCircles")
    .data(data)
    .enter()
    .append("circle")
      .attr("fill", "black")
      .attr("stroke", "none")
      .attr("cx", function(d) { return x(d.Month) })
      .attr("cy", function(d) { return y(d.Male) })
      .attr("r", 3)
    
  svg.selectAll("myCircles")
    .data(data)
    .enter()
    .append("circle")
        .attr("fill", "black")
        .attr("stroke", "none")
        .attr("cx", function(d) { return x(d.Month) })
        .attr("cy", function(d) { return y(d.Female) })
        .attr("r", 3)

  // const tooltip = d3.select("body").append("div")
  //   .attr("class", "svg-tooltip")
  //   .style("position", "absolute")
  //   .style("visibility", "hidden");

  // d3.selectAll("circle")
  //   .on("mouseover", function(event, d) {
  //     d3.select(this).attr("fill", "red");
  //     tooltip
  //       .style("visibility", "visible")
  //       .html(`Month: ${d.Month}<br />Female: ${d.Female}<br />Male: ${d.Male}`);
  //   })
  //   .on("mousemove", function(event) {
  //     tooltip
  //       .style("top", (event.pageY - 10) + "px")
  //       .style("left", (event.pageX + 10) + "px");
  //   })
  //   .on("mouseout", function() {
  //     d3.select(this).attr("fill", "black");
  //     tooltip.style("visibility", "hidden");
  //   })

});