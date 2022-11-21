/* Bar chart for COVID country cases */
(function symbol(){
d3.csv("sea_level.csv").then(data => {

    for (let d of data) {
        d.sea_level = +d.sea_level; //force a number
    };

    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#sea_level")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for setting size in browser
    
    let x = d3.scaleBand()
        .domain(data.map(d => d.Year)) // maps data domain to library branches
        .range([margin.left, width - margin.right]) // sets range to page size
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sea_level)]).nice() // top number rounded off max value of library visits
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
        .attr("x", d => x(d.Year)) // x position attribute for bar position
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.sea_level)) // y position attribute for bar position
        .attr("height", d => y(0) - y(d.sea_level));

    bar.append('text') // add labels
        .text(d => d.sea_level)
        .attr('x', d => x(d.Year) + (x.bandwidth()/2))
        .attr('y', d => y(d.sea_level) + 25) //set label position
        .attr('text-anchor', 'middle')
        .style('fill', 'white');

});

})();