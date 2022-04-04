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
  const fontSize = 12;

  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class", "game-panel")
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
          result = "#ff454b";
          break;
        case "Wii":
          result = "#3a73af";
          break;
        case "NES":
          result = "#79ba7d";
          break;
        case "GB":
          result = "pink";
          break;
        case "DS":
          result = "#fff873";
          break;
        case "X360":
          result = "#8bd6d5";
          break;
        case "PS3":
          result = "violet";
          break;
        case "PS2":
          result = "#ffc14d";
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
          result = "#fa5269";
          break;
        case "N64":
          result = "#8aa181";
          break;
        case "PS":
          result = "#b17fc7";
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
      return d.y0 + 12;
    })
    .attr("data-width", function (d) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d) {
      return d.y1 - d.y0;
    })
    .text(function (d) {
      return d.data.name;
    })
    .attr("font-size", `${fontSize}px`)
    .call(wrapText);

  ////////////////////////Mike Bostock's Text-wrap function/////////////////////
  //adapted as per https://medium.com/swlh/create-a-treemap-with-wrapping-text-using-d3-and-react-5ba0216c48ce

  function wrapText(selection) {
    selection.each(function () {
      const node = d3.select(this);
      const rectWidth = +node.attr("data-width");
      let word;
      const words = node
        .text()
        //add regex to match white space or forward slash - helps prevent text overflow for certain games
        .split(/(\/)|(\s)/)
        .reverse();
      let line = [];
      const x = node.attr("x");
      const y = node.attr("y");
      let tspan = node.text("").append("tspan").attr("x", x).attr("y", y);
      let lineNumber = 0;
      while (words.length > 0) {
        word = words.pop();
        line.push(word);
        tspan.text(line.join(" "));
        const tspanLength = tspan.node().getComputedTextLength();
        if (tspanLength > rectWidth && line.length !== 1) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = addTspan(word);
        }
      }

      addTspan(words.pop());

      function addTspan(text) {
        lineNumber += 1;
        return node
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", `${lineNumber * fontSize}px`)
          .text(text);
      }
    });
  }

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
