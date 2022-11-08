/* Bar chart for COVID country cases */
(function symbol(){
const height = 300,
  width = 800,
  margin = ({ top: 15, right: 30, bottom: 45, left: 50 });

const svg = d3.select("#barchart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

d3.csv("agg.csv").then(data => {

    for (let d of data) {
        d.Total = +d.Total; //force a number
    };

    let x = d3.scaleBand()
        .domain(data.map((d) => d.Month))
        .range([margin.left, width - margin.right]);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Mental_Illness)]).nice() // top number rounded off max value of library visits
        .range([height - margin.bottom, margin.top]); //origin is top left, so goes down
    
    /* Update: simplfied axes */
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) //sets base of graph
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`) //sets y value
        .call(d3.axisLeft(y));

    

    let bar = svg.selectAll(".bar") //create the bar class
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.Month)) // x position attribute for bar position
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.Mental_Illness)) // y position attribute for bar position
        .attr("height", d => y(0) - y(d.Mental_Illness));
    

    bar.append('text') // add labels
        .text(d => d.Mental_Illness)
        .attr('x', d => x(d.Month) + (x.bandwidth()/2))
        .attr('y', d => y(d.Mental_Illness) + 15) //set label position
        .attr('text-anchor', 'middle')
        .style('fill', 'white');
    
    

});
})();