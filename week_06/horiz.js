(function symbol(){
 const width = 860,
      height = 100,
      margin = { top: 10, right: 30, bottom: 20, left: 0 };

    const svg = d3.select("#stackedchart")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    d3.csv("agg_mental.csv").then(data => {

      let x = d3.scaleLinear([0, 160], [margin.left, width - margin.right]);

      let y = d3.scaleBand(data.map(d => (d.Month)), [margin.top, height - margin.bottom])
        .padding([0.1]);
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
      
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))
      

      const subgroups = data.columns.slice(1);

      const color = d3.scaleOrdinal(subgroups, ['#e41a1c', '#377eb8']);

      const stackedData = d3.stack()
        .keys(subgroups)(data)

      svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d.data.group))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth());
      
    });
})();