(function symbol(){
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");
    
    const height = 510, width = 975;
    
    const svg = d3.select("#crabmap")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
    
    Promise.all([
        d3.csv("crab_years/2016.csv"),
        d3.json("libs/world-110m.json"),
        d3.csv('temps_by_year.csv')
        ]).then(([data,world,temps]) => {
        const countries = topojson.feature(world, world.objects.countries);
        const projection = d3.geoModifiedStereographicAlaska()
        var color = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.CPUE)]).nice()
            .range(["rgb(108,99,255)", "red"])
            .interpolate(d3.interpolate);
        var colorbackground = d3.scaleLinear()
            .domain([d3.min(temps, d => d.BOTTOM_TEMPERATURE), d3.max(temps, d => d.BOTTOM_TEMPERATURE)]).nice()
            .range(["white", "black"])
            .interpolate(d3.interpolate);
        const path = d3.geoPath().projection(projection);
        svg.append('rect')
        .data(temps)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', function(d){return colorbackground(d.BOTTOM_TEMPERATURE) });
        
        svg.append("g")
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("stroke", "#999")
        .attr("fill", "tan")
        .attr("d", path);

       
    var markers = 
        svg
        .selectAll('image')
        .data(data)
        .join("image")
        .attr('width',  d => d.CPUE/50000)
        .attr('height',  d => d.CPUE/50000)
        .attr('x', d => projection([d.LONGITUDE, d.LATITUDE])[0])
        .attr('y', d => projection([d.LONGITUDE, d.LATITUDE])[1])
        .attr('href', 'My project-1 (4).png')
        .on("mousemove", function (event, d) {
            // tooltip updated to use new data structure
            tooltip
              .style("visibility", "visible")
              .html(`Year: ${d.SURVEY_YEAR}
                <br>Location: ${d.LATITUDE}, ${d.LONGITUDE}
                <br>Snow Crab Harvest: ${d.CPUE}`)
              .style("top", (event.pageY - 10) + "px")
              .style("left", (event.pageX + 10) + "px");
            d3.select(this).attr("fill", "goldenrod");
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
            d3.select(this).attr("fill", function(d){return color(d.CPUE) });
          });
          let updateYear = year => {
            crabslider.attr("value", year);
            d3.select(".crabyear").text(year);
        }
        
        var crabslider = d3.select(".crabslider")
            .append("input")
            .attr("type", "range")
            .attr("min", 1976)
            .attr("max", 2016)
            .attr("step", 1)
            .on("input", function() {
                const value = this.value
                updateYear(this.value)
                d3.csv(`crab_years/${value}.csv`)
                    .then(data => {
                        d3.selectAll('image').remove(); 
                        const projection = d3.geoModifiedStereographicAlaska()
                        var color = d3.scaleLinear()
                            .domain([0, d3.max(data, d => d.CPUE)]).nice()
                            .range(["rgb(108,99,255)", "red"])
                            .interpolate(d3.interpolate);
                        const path = d3.geoPath().projection(projection);
                        var markers = svg
                        .selectAll('image')
                        .data(data)
                        .join("image")
                        .attr('width',  d => d.CPUE/50000)
                        .attr('height',  d => d.CPUE/50000)
                        .attr('x', d => projection([d.LONGITUDE, d.LATITUDE])[0])
                        .attr('y', d => projection([d.LONGITUDE, d.LATITUDE])[1])
                        .attr('href', 'My project-1 (4).png')
                        .on("mousemove", function (event, d) {
                            // tooltip updated to use new data structure
                            tooltip
                              .style("visibility", "visible")
                              .html(`Year: ${d.SURVEY_YEAR}
                                <br>Location: ${d.LATITUDE}, ${d.LONGITUDE}
                                <br>Snow Crab Harvest: ${d.CPUE}`)
                              .style("top", (event.pageY - 10) + "px")
                              .style("left", (event.pageX + 10) + "px");
                            d3.select(this).attr("fill", "goldenrod");
                          })
                          .on("mouseout", function () {
                            tooltip.style("visibility", "hidden");
                            d3.select(this).attr("fill", function(d){return color(d.CPUE) });
                        
                          });
                    })         
              });  
       
        updateYear(2016)
        var maxRadius = 40
        var legendX = width - maxRadius - 10
        var legendY = height - 10

    var legend = svg.append("g")
        .attr("fill", "#777")
        .attr("transform", `translate(${legendX},${legendY})`)
        .attr("text-anchor", "middle")
        .style("font", "10px sans-serif")
        .selectAll("g")
        .data(radius.ticks(4).slice(1))
        .join("g");
  
    legend.selectAll('image')
    .join("image")
    .attr('width',  20)
    .attr('height',  20)
    .attr('href', 'My project-1 (4).png')
    legend.append("text")
        .attr("y", d => -2 * radius(d))
        .attr("dy", "1.3em")
        .text(radius.tickFormat(4, "s"));
      
 
    });
    
    
    })();