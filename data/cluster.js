(function symbol(){
let width = 600,
height = 400,
gWidth = width/3;

let svg = d3.select("#cluster")
.append("svg")
.attr("width", width)
.attr("height", height);

let rScale = d3.scaleLinear()
.range([20,20]);

d3.csv("conditions.csv").then(data => {
let colors = d3.scaleLinear()
.domain([0, d3.max(data, d => d.Sea_Level)]).nice()
.range(["rgb(108,99,255)", "red"])
.interpolate(d3.interpolate);
console.log(data.Sea_Level)
let result = d3.group(data, d => d.Sea_Level);


rScale.domain(d3.extent(data, d => d.Year));

let i = 0;
for (let [a, b] of result) {
  let items = [];

  for (let j = 0; j < b.length; j++) {
    let newObj = {
      x: (gWidth * (0.5 + i)),
      y: height/2,
    }
    newObj.node = b[j].Year;
    newObj.level = b[j].Sea_Level;
    items.push(newObj);
  }

  let color = colors[i];

  buildChart(a, i, color, items);

  i++;
}
});

const tooltip = d3.select("body").append("div")
.attr("class", "svg-tooltip")
.style("position", "absolute")
.style("visibility", "hidden");

function buildChart(a, i, color, nodes) {
let simulation = d3.forceSimulation(nodes)
  .force("charge", d3.forceManyBody().strength(50)) //strength
  .force('x', d3.forceX().x(gWidth * (0.5 + i)))
  .force('y', d3.forceY().y(nodes[i].y)) 
  .force("collision", d3.forceCollide().radius(d => (rScale(d.level))));

let g = svg.append("g");

simulation.on("tick", () => {
  g.selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .attr("r", d => (rScale(d.level)))
    .attr("fill", color)
    .attr("opacity", 0.75)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("opacity", 1);
      tooltip
        .style("visibility", "visible")
        .html(`${d.node}<br />${d.level}`);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("opacity", 0.75);
      tooltip.style("visibility", "hidden");
    })
})

g.append("text")
  .text(a)
  .attr("x",gWidth * (0.5 + i))
  .attr("y", 100)
  .attr("text-anchor","middle")
  .style("text-transform","capitalize")
  .style("font-weight","bold");

for (let i = 0; i < 20; i++) {
  simulation.tick()
}

};
})();