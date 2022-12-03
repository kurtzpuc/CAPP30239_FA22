(function symbol(){
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 610, width = 975;

const svg = d3.select("#globe")
.append("svg")
.attr("viewBox", [0, 0, width, height]);

Promise.all([
    d3.csv("crab.csv"),
    d3.json("libs/countries-110m.json")]).then(([data, world]) => {
    const countries = topojson.feature(world, world.objects.countries);
    let projection = d3.geoOrthographic()
    .center([0, 0]) 
    .scale(300)
    .rotate([170,-65])

    let path = d3.geoPath().projection(projection);

    svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'white');

    svg.append("g")
    .selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("stroke", "#999")
    .attr("fill", "tan")
    .attr("d", path);

    svg.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("stroke", '#ccc')
    .attr("fill", "red")
    .attr("opacity", 0.75)
    .filter(function(d) { return d.SURVEY_YEAR = 2012 })
    .attr("r", 3)
    .attr("cx", (d) => projection([d.LONGITUDE, d.LATITUDE])[0]) // uses projection and returns long
    .attr("cy", (d) => projection([d.LONGITUDE, d.LATITUDE])[1])
    .on("mousemove", function (event, d) {
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