(function symbol(){
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");
    
    const height = 610, width = 975;
    
    const svg = d3.select("#alaskamaptest")
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
            .domain([0, d3.max(temps, d => d.BOTTOM_TEMPERATURE)]).nice()
            .range(["rgb(108,99,255)", "red"])
            .interpolate(d3.interpolate);
        const path = d3.geoPath().projection(projection);
        svg.append('rect')
        .data(temps)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white' );
        //.filter(function(d) { return d.SURVEY_YEAR = data.SURVEY_YEAR })
        //.attr('fill', function(d){return colorbackground(d.BOTTOM_TEMPERATURE) });

        svg.append("g")
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("stroke", "#999")
        .attr("fill", "tan")
        .attr("d", path);
        
        var marker = svg
        .selectAll("path")
        .enter()
        .append("path")
        .data(data)
        .join("circle")
        .attr("class", "markers")
        .attr("stroke", '#ccc')
        .attr('d', path)
        .attr("fill", function(d){return color(d.CPUE) })
        .attr("opacity", .75)
        //.attr("r", d => d.CPUE/100000)
        .attr("r", 5) // if a marker, you can use a static value
        .attr("cx", (d) => projection([d.LONGITUDE, d.LATITUDE])[0]) // uses projection and returns long
        .attr("cy", (d) => projection([d.LONGITUDE, d.LATITUDE])[1])
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
            slider.attr("value", year);
            d3.select(".year").text(year);
        }
        
        var slider = d3.select(".slider")
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
                        d3.selectAll('circle').remove(); 
                        const projection = d3.geoModifiedStereographicAlaska()
                        var color = d3.scaleLinear()
                            .domain([0, d3.max(data, d => d.CPUE)]).nice()
                            .range(["rgb(108,99,255)", "red"])
                            .interpolate(d3.interpolate);
                        const path = d3.geoPath().projection(projection);
                        var marker = svg
                        .selectAll("path")
                        .enter()
                        .append("path")
                        .data(data)
                        .join("circle")
                        .attr("stroke", '#ccc')
                        .attr("class","markers")
                        .attr('d', path)
                        .attr("fill", function(d){return color(d.CPUE) })
                        .attr("opacity", .75)
                        .attr("r", d => d.CPUE/100000)
                        .attr("r", 5) // if a marker, you can use a static value
                        .attr("cx", (d) => projection([d.LONGITUDE, d.LATITUDE])[0]) // uses projection and returns long
                        .attr("cy", (d) => projection([d.LONGITUDE, d.LATITUDE])[1])
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
        // var changeSize = function(input) {
        //     marker
        //     .attr("r", input)
        // }      
        // d3.select("#sizecode").on("input", changeSize )
        // var crab = function() {
        //             value = document.getElementById("myslider").value
        //             d3.csv(`crab_years/${value}.csv`)
        //             .then(data => {
        //                 d3.selectAll('circle').remove(); 
        //                 const projection = d3.geoModifiedStereographicAlaska()
        //                 var color = d3.scaleLinear()
        //                     .domain([0, d3.max(data, d => d.CPUE)]).nice()
        //                     .range(["rgb(108,99,255)", "red"])
        //                     .interpolate(d3.interpolate);
        //                 const path = d3.geoPath().projection(projection);
        //                 var crab = svg
        //                 .selectAll('image')
        //                 .data(data)
        //                 .join("image")
        //                 .attr('width',  d => d.CPUE/50000)
        //                 .attr('height',  d => d.CPUE/50000)
        //                 .attr('x', d => projection([d.LONGITUDE, d.LATITUDE])[0])
        //                 .attr('y', d => projection([d.LONGITUDE, d.LATITUDE])[1])
        //                 .attr('href', 'crac.png') 
        //                 .on("mousemove", function (event, d) {
        //                     // tooltip updated to use new data structure
        //                     tooltip
        //                       .style("visibility", "visible")
        //                       .html(`Year: ${d.SURVEY_YEAR}
        //                         <br>Location: ${d.LATITUDE}, ${d.LONGITUDE}
        //                         <br>Snow Crab Harvest: ${d.CPUE}`)
        //                       .style("top", (event.pageY - 10) + "px")
        //                       .style("left", (event.pageX + 10) + "px");
        //                     d3.select(this).attr("fill", "goldenrod");
        //                   })
        //                   .on("mouseout", function () {
        //                     tooltip.style("visibility", "hidden");
        //                     d3.select(this).attr("fill", function(d){return color(d.CPUE) });
                        
        //                   });
        //             })  
        //         }
                    // d3.selectAll('circle').remove(); 
                    // const projection = d3.geoModifiedStereographicAlaska()
                    // var color = d3.scaleLinear()
                    //     .domain([0, d3.max(data, d => d.CPUE)]).nice()
                    //     .range(["rgb(108,99,255)", "red"])
                    //     .interpolate(d3.interpolate);
                    // const path = d3.geoPath().projection(projection);
        //     var crab = svg
        // .selectAll('image')
        // .data(data)
        // .join("image")
        // .attr('width',  d => d.CPUE/50000)
        // .attr('height',  d => d.CPUE/50000)
        // .attr('x', d => projection([d.LONGITUDE, d.LATITUDE])[0])
        // .attr('y', d => projection([d.LONGITUDE, d.LATITUDE])[1])
        // .attr('href', 'crac.png')     
       
        updateYear(2016)
           
        




        // svg
        // .selectAll('image')
        // .data(data)
        // .join("image")
        // .attr('width',  d => d.CPUE/50000)
        // .attr('height',  d => d.CPUE/50000)
        // .attr('x', d => projection([d.LONGITUDE, d.LATITUDE])[0])
        // .attr('y', d => projection([d.LONGITUDE, d.LATITUDE])[1])
        // .attr('href', 'crac.png')
    });
    
    
    })();