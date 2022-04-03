const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const width = 1200;
const height = 900;
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
    .style("fill", function (d) {
      let result = "";
      switch (d.data.category) {
        case "2600":
          result = "red";
          break;
        case "Wii":
          result = "blue";
          break;
        case "NES":
          result = "green";
          break;
        case "GB":
          result = "pink";
          break;
        case "DS":
          result = "white";
          break;
        case "X360":
          result = "cyan";
          break;
        case "PS3":
          result = "violet";
          break;
        case "PS2":
          result = "orange";
          break;
        case "SNES":
          result = "beige";
          break;
        case "GBA":
          result = "brown";
          break;
        case "PS4":
          result = "cadetBlue";
          break;
        case "3DS":
          result = "crimson";
          break;
        case "N64":
          result = "darkOliveGreen";
          break;
        case "PS":
          result = "darkOrchid";
          break;
        case "XB":
          result = "darkSalmon";
          break;
        case "PC":
          result = "deepSkyBlue";
          break;
        case "PSP":
          result = "indianRed";
          break;
        case "XOne":
          result = "khaki";
          break;
      }
      return result;
    });

  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("class", "game-label")
    .attr("x", function (d) {
      return d.x0 + 1;
    })
    .attr("y", function (d) {
      return d.y0 + 16;
    })
    .attr("width", function (d) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d) {
      return d.y1 - d.y0;
    })
    .text(function (d) {
      return d.data.name;
    })
    .attr("font-size", "8px")
    .attr("fill", "blue");
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
