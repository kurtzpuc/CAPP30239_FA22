// Inspired by https://d3-graph-gallery.com/graph/parallel_custom.html
(function symbol(){
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

  var margin = {top: 30, right: 50, bottom: 10, left: 50},
    width = 1000- margin.left - margin.right,
    height = 610 - margin.top - margin.bottom;
      
  const svg = d3.select("#parallel")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
  svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "cadetblue");

  // Parse the Data
  d3.csv('conditions.csv').then((data => {

    var color = d3.scaleLinear()
      .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)]).nice()
      .range(["rgb(108,99,255)", "red"])
      .interpolate(d3.interpolate);

    // Here I set the list of dimension manually to control the order of axis:
    dimensions = ['Year', 
    'Hawaii pCO2',
    'CPUE',
    'BOTTOM_TEMPERATURE_y', 
    'SURFACE_TEMPERATURE_y',
    'Eastern Bering Sea - Depth', 
    'Sea_Level']

    let graph = nodeLinkData(data, ["source", "target"]);

    // For each dimension, I build a linear scale. I store all in a y object
    var y = {}
    for (i in dimensions) {
      title = dimensions[i]
      y[title] = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return +d[title]; }) ).nice()
        .range([height*9/10, 100])
    }

    x = d3.scalePoint()
      .range([50, width-25])
      .domain(dimensions);

    var highlight = function(event, d){

      selected_year = d.Year

      // first every group turns grey
      d3.selectAll(".line")
        .transition().duration(200)
        .style("stroke", "lightgrey")
        .style("opacity", "0.2")
        // Then highlight selected line
      d3.select(this)
        .transition().duration(200)
        .style("stroke", function(d){ return( color(d.Year))})
        .style("opacity", "1")
        // tooltip updated to use new data structure
          tooltip
            .style("visibility", "visible")
            .html(`Year: ${d.Year}`)
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
          d3.select(this).attr("fill", "goldenrod");
    }

    // Unhighlight
    var doNotHighlight = function(d){
      d3.selectAll(".line")
        .transition().duration(200).delay(1000)
        .style("stroke", function(d){ return( color(d.Year))} )
        .style("opacity", "1")
        tooltip.style("visibility", "hidden");
          d3.select(this).attr("fill", function(d){return color(d.CPUE) });
    }

    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Draw the lines
    svg
      .selectAll("myPath")
      .data(data)
      .enter()
      .append("path")
        .attr("class", function (d) { return "line " + d.Year } ) 
        .attr("id", function(d,i){ return "donut"+i})
        .attr("d",  path)
        .style("fill", "none" )
        .style("stroke", function(d){ return( color(d.Year))} )
        .style("opacity", 0.5)
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight )

    // Draw the axis:
    svg.selectAll("myAxis")
      // For each dimension of the dataset I add a 'g' element:
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "axis")
      // I translate this element to its right position on the x axis
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      // And I build the axis with the call function
      .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
      // Add axis title
      .append("text")
        .style("text-anchor", "middle")
        .attr("y", 100)
        .text(function(d) { return d[title]; })
        .style("fill", "black")
      svg.append("text").attr("class","First_Axis")
        .text("Year")
        .attr("x", 50)
        .attr("y", 80) 
        .attr("text-anchor","middle");
    
      svg.append("text").attr("class","Second_Axis")
        .text("CO2")
        .attr("x", 150)
        .attr("y", 80) 
        .attr("text-anchor","middle");
    
      svg.append("text").attr("class","Third_Axis")
        .text("Catch")
        .attr("x", 280)
        .attr("y", 80) 
        .attr("text-anchor","middle");
      
      svg.append("text").attr("class","Sixth_Axis")
        .text("Bottom Temp")
        .attr("x", 420)
        .attr("y", 80) 
        .attr("text-anchor","middle");
      
      svg.append("text").attr("class","Seventh_Axis")
        .text("Surface Temp")
        .attr("x", 560)
        .attr("y", 80) 
        .attr("text-anchor","middle");
        
      svg.append("text").attr("class","Fourth_Axis")
        .text("Depth")
        .attr("x", 700)
        .attr("y", 80) 
        .attr("text-anchor","middle");
        
      svg.append("text").attr("class","Sea_Axis")
        .text("Sea Level")
        .attr("x", 830)
        .attr("y", 80) 
        .attr("text-anchor","middle");
        
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
          
    // Legend
    d3.select("#parallel")
      .node()
      .appendChild(
        Legend(
          d3.scaleLinear(d3.extent(data, d => d.Year),
              
              (['rgb(108,99,255)','red'])
          ),
          {title: "Year"}
      ));

  }))

      
      
  })();