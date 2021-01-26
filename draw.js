"use strict";

// Code based on: https://observaehq.com/@d3/zoomable-circle-packing

const chartHolder = document.getElementById("chart-holder");

const width = 932;
const height = width;


const pack = (data) =>
  d3.pack().size([width, height]).padding(3)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );

const chart = () => {
  const data = loadData();
  const root = pack(data);
  let focus = root;
  let view;

  d3.selectAll("svg > *").remove();
  const svg = d3
    .select("#chart")
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .style("display", "block")
    .style("background", colors.background)
    .style("cursor", "pointer")
    .on("click", (event) => zoom(event, root));

  const node = svg
    .append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
    .attr("fill", (d) => d.data.color)
    .attr("stroke", colors.border)
    .attr("stroke-width", d => !d.children && d.data.data &&  d.data.data.relevantCoursesBoolean ? "1" : "0")
    .attr("pointer-events", (d) => (!d.children ? "none" : null))
    .on("mouseover", function () {
      d3.select(this).attr("stroke", "#000").attr("stroke-width", "2");
    })
    .on("mouseout", function () {
      d3.select(this).attr("stroke", null);
    })
    .on(
      "click",
      (event, d) => focus !== d && (zoom(event, d), event.stopPropagation())
    );

  const label = svg
    .append("g")
    .style("font-size", fonts.label.size)
    .style("font-weight", fonts.label.weight)
    .style("font-color", colors.text)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
    .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
    .style("display", (d) => (d.parent === root ? "inline" : "none"))
    .text((d) => d.data.name);

  const skillLabel = svg
    .append("g")
    .style("font-size", fonts.label.size)
    .style("font-weight", fonts.label.weight)
    .style("font-color", colors.text)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
    .attr("class", "break")
    .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
    .style("display", (d) => (d.parent === root ? "inline" : "none"))
    .text((d) => d.data.skill);

 
  zoomTo([root.x, root.y, root.r]);

  function zoomTo(v) {
    const k = width / v[2];

    view = v;

    label.attr(
      "transform",
      (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
    );

    skillLabel.attr(
      "transform",
      (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1] + 5) * k})`
    );

    node.attr(
      "transform",
      (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
    );
    node.attr("r", (d) => d.r * k);
  }

  function zoom(event, d) {
    focus = d;

    const transition = svg
      .transition()
      .duration(event.altKey ? 7500 : 750)
      .tween("zoom", (d) => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return (t) => zoomTo(i(t));
      });

    label
      .filter(function (d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .transition(transition)
      .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
      .style("font-size", (d) => (d.children ? fonts.label.size : fonts.name.size))
      .style("font-weight", (d) => (d.children ? fonts.label.weight : fonts.name.weight))
      .on("start", function (d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function (d) {
        if (d.parent !== focus) this.style.display = "none";
      });


  skillLabel
      .filter(function (d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .transition(transition)
      .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
      .style("font-size", (d) => (d.children ? fonts.label.size : fonts.name.size))
      .style("font-weight", (d) => (d.children ? fonts.label.weight : fonts.name.weight))
      .on("start", function (d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function (d) {
        if (d.parent !== focus) this.style.display = "none";
      });

  }

  // evil hack for zoom bug
  d3.select('#chart').dispatch('click');

  return svg.node();
};

chart();
const cutoffInput = document.getElementById("cutoff-input");
const cutoffValue = document.getElementById("cutoff-value");
cutoffInput.addEventListener("change", (e) => {
  cutoff = e.target.value;
  cutoffValue.innerText = e.target.value;
  chart();
 })

cutoffInput.value = cutoff;


