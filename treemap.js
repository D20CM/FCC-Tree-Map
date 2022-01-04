const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const width = 600;
const height = 600;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

const svg = d3
  .select("#graph-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let treeMap = async function () {
  const response = await fetch(url);
  const dataset = await response.json();
  console.log(dataset);
  const consoles = dataset.children;

  //////////////////////////////////////////////////////////////////////////////

  const root = d3.hierarchy(dataset).sum((d) => d.value);

  d3.treemap().size([width, height]).padding(2)(root);

  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return d.x0;
    })
    .attr("y", function (d) {
      return d.y0;
    })
    .attr("width", function (d) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d) {
      return d.y1 - d.y0;
    })
    .style("stroke", "black")
    .style("fill", "yellow");

  /////////////////////////////////////////////////////////////////////////////////////////////////

  const testArea = document.getElementById("test-area");

  function displayConsoles() {
    for (let i = 0; i < consoles.length; i++) {
      const consoleArea = document.createElement("div");
      consoleArea.classList.add("console-area");
      consoleArea.innerText = JSON.stringify(consoles[i].children);
      testArea.append(consoleArea);
    }
  }

  displayConsoles();
};

treeMap();
