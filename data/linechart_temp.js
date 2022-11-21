/* D3 Line Chart with Bisect Tooltip */
(function symbol(){
    let height = 300,
      width = 800,
      margin = ({ top: 15, right: 30, bottom: 45, left: 50 });
    
    const svg = d3.select("#linechart")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);
    
    d3.csv('temps_by_year.csv').then(data => {
        for (let d of data) {
            d.SURFACE_TEMPERATURE = +d.SURFACE_TEMPERATURE; //force a number
            d.BOTTOM_TEMPERATURE = +d.BOTTOM_TEMPERATURE; //force a number
        };
      console.log(data)
    
      let x = d3.scaleBand()
        .domain(data.map((d) => d.SURVEY_YEAR))
        .range([margin.left, width - margin.right]);
    
      let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.SURFACE_TEMPERATURE)]).nice()
        .range([height - margin.bottom, margin.top]);
    
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")
        .call(d3.axisLeft(y)
        .tickSize(-width + margin.right + margin.left)
        );
    
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
        .tickFormat((interval,i) => {
            return i%5 !== 0 ? " ": interval;
           }));
    
      svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height)
        .attr("dx", "0.5em")
        .attr("dy", "-0.5em")
        .text("Year");
    
      svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top / 2)
        .attr("dx", "-0.5em")
        .attr("y", 10)
        .attr("transform", "rotate(-90)")
        .text("Temperature");
    
    
    
      let line_surface= d3.line()
        .x(d => x(d.SURVEY_YEAR))
        .y(d => y(d.SURFACE_TEMPERATURE))
        .curve(d3.curveNatural); // more: https://observablehq.com/@d3/d3-line#cell-244
    
      svg.append("path")
        .datum(data)
        .attr("class", "line") 
        .attr("d", line_surface)
        .attr("fill", "lightred")
        .attr("stroke", "red")
      
    
      let line_bottom= d3.line()
        .x(d => x(d.SURVEY_YEAR))
        .y(d => y(d.BOTTOM_TEMPERATURE))
        .curve(d3.curveNatural); // more: https://observablehq.com/@d3/d3-line#cell-244
    
      svg.append("path")
        .datum(data)
        .attr("class", "line") 
        .attr("d", line_bottom)
        .attr("fill", "lightblue")
        .attr("stroke", "steelblue")
        
      svg.selectAll("myCircles")
        .data(data)
        .enter()
        .append("circle")
          .attr("fill", "black")
          .attr("stroke", "none")
          .attr("cx", function(d) { return x(d.SURVEY_YEAR) })
          .attr("cy", function(d) { return y(d.BOTTOM_TEMPERATURE) })
          .attr("r", 3)
        
      svg.selectAll("myCircles")
        .data(data)
        .enter()
        .append("circle")
            .attr("fill", "black")
            .attr("stroke", "none")
            .attr("cx", function(d) { return x(d.SURVEY_YEAR) })
            .attr("cy", function(d) { return y(d.SURFACE_TEMPERATURE) })
            .attr("r", 3)
    
      const tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");
    
      d3.selectAll("circle")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", "red");
          tooltip
            .style("visibility", "visible")
            .html(`Year: ${d.SURVEY_YEAR}<br />Surface Temp: ${d.SURFACE_TEMPERATURE}<br />Bottom Temp: ${d.BOTTOM_TEMPERATURE}`);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
          d3.select(this).attr("fill", "black");
          tooltip.style("visibility", "hidden");
        })
    
    });
    })();