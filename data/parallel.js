(function symbol(){
// set the dimensions and margins of the graph
var margin = {top: 30, right: 50, bottom: 10, left: 50},
  width = 975- margin.left - margin.right,
  height = 610 - margin.top - margin.bottom;
    
const svg = d3.select("#parallel")
.append("svg")
.attr("viewBox", [0, 0, width, height]);
svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "white");

// Parse the Data
d3.csv('conditions.csv').then((data => {

  // Color scale: give me a specie name, I return a color
  var color = d3.scaleLinear()
  .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)]).nice()
  .range(["rgb(108,99,255)", "red"])
  .interpolate(d3.interpolate);

  // Here I set the list of dimension manually to control the order of axis:
  dimensions = ['Year', 'CPUE',
  'BOTTOM_DEPTH', 'SURFACE_TEMPERATURE_x', 'BOTTOM_TEMPERATURE_x',
  'Hawaii pH', 'Hawaii pCO2',
  'BOTTOM_TEMPERATURE_y', 'SURFACE_TEMPERATURE_y',
  'Eastern Bering Sea - Latitude', 'Eastern Bering Sea - Depth']
  let graph = nodeLinkData(data, ["source", "target"]);
  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    title = dimensions[i]
    y[title] = d3.scaleLinear()
    .domain([d3.min(data, d => d[title]), d3.max(data, d => d[title])]).nice() // --> Same axis range for each group
      //.domain([d3.min(data, d => d[name]), d3.max(data, d => d.[name])]).nice() // --> Same axis range for each group
      // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
      .range([height*9/10, 100])
  }

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([100, width*9/10])
    .domain(dimensions);

  // Highlight the specie that is hovered
  var highlight = function(d){

    selected_year = d.Year

    // first every group turns grey
    d3.selectAll(".line")
      .transition().duration(200)
      .style("stroke", "lightgrey")
      .style("opacity", "0.2")
    // Second the hovered specie takes its color
    d3.selectAll("." + selected_year)
      .transition().duration(200)
      .style("stroke", color(selected_year))
      .style("opacity", "1")
  }

  // Unhighlight
  var doNotHighlight = function(d){
    d3.selectAll(".line")
      .transition().duration(200).delay(1000)
      .style("stroke", function(d){ return( color(d.Year))} )
      .style("opacity", "1")
  }

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
      .attr("class", function (d) { return "line " + d.Year } ) // 2 class for each line: 'line' and the group name
      .attr("d",  path)
      .style("fill", "none" )
      .style("stroke", function(d){ return( color(d.Year))} )
      .style("opacity", 0.5)
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight )

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")
      function nodeLinkData(data, [source, target]) {
        const keys = [source, target];
        const seenNodes = new Set();
        const indexByName = {};
        let index = -1;
      
        // form nodes
        const nodes = [];
        for (const k of keys) {
          for (const d of data) {
            const name = d[k];
            if (seenNodes.has(name)) continue;
            const node = { name };
            nodes.push(node);
            seenNodes.add(name);
            indexByName[name] = ++index;
          }
        }
      
        // form links
        const links = [];
        for (const d of data) {
          links.push({
            source: indexByName[d[source]],
            target: indexByName[d[target]],
            value: d.value
          });
        }
      
        return { nodes, links };
      }
        svg.append("g")
    .style("font-weight", "bold")
    .append("text")
    .attr("x", 0)
    .attr("y", 16)
    .text("Gender");

  svg.append("g")
    .style("font-weight", "bold")
    .append("text")
    .attr("x", width - margin.left)
    .attr("y", 16)
    .attr("text-anchor", "end")
    .text("Degrees");

}))

    
    
})();