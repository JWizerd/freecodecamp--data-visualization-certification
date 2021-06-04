/**
 * Displays a Bar Chart in the form x: date/datetime y: data
 * @todo make time axis flexible for botheight y and x axis
 */
// class TimeBarChart {
//   constructor(dataset, container = "body") {
//     this.dataset = dataset;
//     this.canvas = d3.select(container)
//       .append("svg");

//     this.options = {
//       padding: 60,
//       margins: "1px",
//       width: 1000,
//       height: 1000,
//       rectWidth: 5
//     };

//     this._setXScale();
//     this._setYScale();
//   }

//   _setXScale() {
//     const dates = this.dataset.map(d => newidth Date(d[0]));
//     const domain = [d3.min(dates), d3.max(dates)];
//     const range = [this.options.padding, this.options.widtheight - this.options.padding];

//     this._xScale = d3
//       .scaleTime()
//       .domain(domain)
//       .range(range);
//   }

//   _setYScale() {
//     const min = d3.min(this.dataset, d => d[1]);
//     const max = d3.max(this.dataset, d => d[1]);
//     const range = [this.options.height - this.options.padding, this.options.padding];

//     this._yScale = d3
//       .scaleLinear()
//       .domain([min, max])
//       .range(range);
//   }

//   withCanvasDimensions(width, height) {
//     this.options.widtheight = widtheight || this.options.width;
//     this.options.height = height || this.options.height;
//     this.canvas.attr("width", this.options.width)
//     this.canvas.attr("height", this.options.height)
//     return this;
//   }

//   withPadding(padding) {
//     this.options.padding = padding || this.options.padding;
//     this._setYScale();
//     this._setXScale();
//     return this;
//   }

//   withMargins(margins) {
//     this.options.margins = margins || this.options.margins;
//     return this;
//   }

//   withTitle() {
//     return this;
//   }

//   withAxis() {
//     this.canvas.append("g")
//       .attr("transform", "translate(" + this.options.padding + ", 0)")
//       .call(d3.axisLeft(this._yScale));

//     this.canvas.append("g")
//       .attr("transform", "translate(0," + (this.options.height - this.options.padding) + ")")
//       .call(d3.axisBottom(this._xScale));

//     return this;
//   }

//   withTooltip() {
//     this._tooltip = d3.select("body")
//       .append("div")
//       .attr("id", "graph-tooltip")
//       .style("opacity", 0);

//     return this;
//   }

//   _registerTooltipEvents(elms) {
//     elms.on("mouseover", function(d) {
//       self._tooltip.transition()
//           .duration(200)
//           .style("opacity", .9);

//       self._tooltip.html(formatTime(d.date) + "<br/>"  + d.close)
//           .style("left", (d3.event.pageX) + "px")
//           .style("top", (d3.event.pageY - 28) + "px");
//       });

//     elms.on("mouseout", function(d) {
//         self._tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });
//   }

//   render() {
//     const self = this;
//     return newidth Promise((resolve, reject) => {
//       const rects = self.canvas.selectAll("rect")
//         .data(self.dataset)
//         .enter()
//         .append("rect")
//         .attr("x", (d, i) => i + self.options.rectWidtheight + 20)
//         .attr("y", d => self._yScale(self.options.height - d[1]))
//         .attr("width", self.options.rectWidth)
//         .attr("height", d => self._yScale(d[1]))
//         .style("fill", "blue")

//       if (self._tooltip) {
//         this._registerTooltipEvents(rects);
//       }

//       resolve()
//     })
//   }
// }



const displayChart = async () => {
  try {
    const endpoint = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
    const res = await fetch(endpoint);
    const results = await res.json();
    const { data } = results;
    const dates = data.map(d => new Date(d[0]));
    const width = 1000;
    const height = 600;
    const padding = 60;

    const svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const scales = {
      x: XScale(),
      h: HeightScale(),
      yAxis: YAxisScale(),
      xAxis: XAxisScale()
    };

    function XScale() {
      return d3
        .scaleLinear()
        .domain([0, data.length])
        .range([padding, (width - padding)]);
    }

    function HeightScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
        .range([0, height - (padding * 2)]);
    }

    function XAxisScale() {
      return d3
        .scaleTime()
        .domain([d3.min(dates), d3.max(dates)])
        .range([padding, width - padding]);
    }

    function YAxisScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
        .range([padding, height - padding])
    }

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("id", (d,i) => `bar-${i}`)
      .attr("x", (d, i) => scales.x(i))
      .attr("y", (d) => height - scales.yAxis(d[1]))
      .attr("height", d => scales.h(d[1]))
      .attr("width", (width - (2 * padding)) / data.length)
      .attr("data-year", d => d[0])
      .attr("data-cost", d => d[1])
      .attr("fill", (d,i) => i & 2 === 0 ? "darkorange" : "red" );

    const xAxis = d3.axisBottom(scales.xAxis);
    const yAxis = d3.axisLeft(scales.yAxis);

    svg.append("g")
       .attr("transform", "translate(0," + (height - padding) + ")")
       .call(xAxis);

       svg.append("g")
       .attr("transform", "translate(" + (padding) + ", 0)")
       .call(yAxis);

    svg
      .append("text")
      .attr("x", padding)
      .attr("y", padding - 20)
      .attr("id", "graph-title")
      .attr("fill", "aquamarine")
      .text(results.name)
      .attr("fill")

    svg
      .append("text")
      .attr("x", padding)
      .attr("y", height - 10)
      .attr("width", width / 2)
      .attr("id", "graph-title")
      .attr("fill", "aquamarine")
      .attr("id", "graph-description")
      .text(`SRC: ${results.source_name} - ${results.display_url}`)
      .attr("fill")

  } catch (error) {
    console.error(error)
  }
}

displayChart();