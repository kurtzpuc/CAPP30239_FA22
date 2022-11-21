(function symbol(){
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 610, width = 975;

const svg = d3.select("#map")
.append("svg")
.attr("viewBox", [0, 0, width, height]);

Promise.all([
    d3.csv("crab.csv"),
    d3.json("libs/countries-110m.json")]).then(([data, world]) => {
    const countries = topojson.feature(world, world.objects.countries);
    // const mesh = topojson.mesh(world, world.objects.countries);
    const projection = d3.geoOrthographic()
    .center([0, 0]) 
    .scale(900)
    //.clipAngle( )
    //.translate([width / 2, height / 3]) 
    .rotate([170,-65])
    const projection2 = d3.geoMercator()
        .center([10, 68])
        .scale(120)
        .rotate([-90,0]);
    const path = d3.geoPath().projection(projection);
    svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'white');
    console.log(data)
    svg.append("g")
    .selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("stroke", "#999")
    .attr("fill", "tan")
    .attr("d", path);
    
    console.log(data)
    svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("stroke", '#ccc')
    .attr("fill", "red")
    .attr("opacity", 0.75)
    .attr("r", d => (d.CPUE))
    .attr("r", 5) // if a marker, you can use a static value
    // .attr("transform", d => `translate(${path.centroid(d)})`) // replaced by next two lines
    .attr("cx", d => projection2(d.LONGITUDE)[1]) // uses projection and returns long
    .attr("cy", d => projection2(d.LATITUDE)[0])
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
        d3.select(this).attr("fill", 'red');
      });


});


})();