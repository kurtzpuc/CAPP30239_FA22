/* Bar chart of covid cases */

d3.csv("covid.csv").then(data => {


    const height = 400,
            width = 600,
            margin = ({top:25, right:30, bottom:35, left:50})
    
    let svg = d3.select("#chart")
                .append("svg")
                .attr("ViewBox", [0, 0, width, height]);
    
    const x = d3.scaleBand()
                .domain(data.map(d => d.country))
                .range([margin.left, width - margin.right])
                .padding(0.1);
    
    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.cases)]).nice()
                .range([height - margin.bottom, margin.top]);
    
    const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom + 5})`)
            .call(d3.axisBottom(x))
            //.call(g => g.select(".domain").remove())

    const yAxis = g => g
            .attr("transform", `translate(${width - margin.left - 5},0)`)
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
        .attr("x", d => x=(d.country))
        .attr("width", x.bandwith())
        .attr("y", d => y(d.cases))
        .attr("height", d => y(0) - y(d.cases));
    
    bar.append("text")
        .text(d => d.cases)
        .attr('x', d => x(d.country) + (x.bandwith()/2))
        .attr("y", d => y(d.cases) - 5)
        .attr("text-anchor", "middle")
        .style("fill","#000");
        
        

    console.log(data);
});