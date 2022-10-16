/* Bar chart of covid cases */

d3.csv("library_visits_jan22.csv").then(data => {

    for (let d of data) {
        d.num = +d.num;
    };

    const height = 600,
            width = 800,
            margin = ({top:25, right:30, bottom:35, left:50})
    
    let svg = d3.select("#chart")
                .append("svg")
                .attr("viewBox", [0, 0, width, height]);
    
    const x = d3.scaleBand()
                .domain(data.map(d => d.branch))
                .range([margin.left, width - margin.right])
                .padding(0.1);
    
    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.num)]).nice()
                .range([height - margin.bottom, margin.top]);
    
    const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom + 5})`)
            .call(d3.axisBottom(x))
            //.call(g => g.select(".domain").remove())

    const yAxis = g => g
            .attr("transform", `translate(${width - margin.left + 5},0)`)
            .call(d3.axisLeft(y))
    
    svg.append("g")
        .call(xAxis)

    svg.append("g")
        .call(yAxis)
    
    let bar = svg.selectAll(".bar")
        .append("g")
        .data(data)
        .join("g")
        .attr("class","bar");
    
    bar.append("rect")
        .attr("fill","steelblue")
        .attr("x", d => x=(d.branch))
        .attr("width", x.bandwith())
        .attr("y", d => y(d.num))
        .attr("height", d => y(0) - y(d.num));
    
    bar.append("text")
        .text(d => d.num)
        .attr('x', d => x(d.branch) + (x.bandwith()/2))
        .attr("y", d => y(d.num) - 5)
        .attr("text-anchor", "middle")
        .style("fill","#000");
        
        

    console.log(data);
});