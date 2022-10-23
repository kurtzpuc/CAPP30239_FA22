/* Bar chart for COVID country cases */

d3.csv("library_visits_jan22.csv").then(data => {

    for (let d of data) {
        d.num = +d.num; //force a number
    };

    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for setting size in browser
    
    let x = d3.scaleBand()
        .domain(data.map(d => d.branch)) // maps data domain to library branches
        .range([margin.left, width - margin.right]) // sets range to page size
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.num)]).nice() // top number rounded off max value of library visits
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
        .attr("x", d => x(d.branch)) // x position attribute for bar position
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.num)) // y position attribute for bar position
        .attr("height", d => y(0) - y(d.num));

    bar.append('text') // add labels
        .text(d => d.num)
        .attr('x', d => x(d.branch) + (x.bandwidth()/2))
        .attr('y', d => y(d.num) + 15) //set label position
        .attr('text-anchor', 'middle')
        .style('fill', 'white');

});