const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const width = 600;
const height = 600;
const margin = 20;

const svg = d3
  .select("#graph-area")
  .append("svg")
  .attr("width", width + margin + margin)
  .attr("height", height + margin + margin)
  .append("g")
  .attr("transform", "translate(" + margin + "," + margin + ")");

let treeMap = async function () {
  const response = await fetch(url);
  const dataset = await response.json();
  console.log(dataset);
  const consoles = dataset.children;
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
