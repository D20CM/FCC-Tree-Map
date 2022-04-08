const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const width = 1300;
const height = 700;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

const colorsArray = [
  "#ff454b",
  "#3a73af",
  "#79ba7d",
  "pink",
  "#fff873",
  "#8bd6d5",
  "violet",
  "#ffc14d",
  "beige",
  "brown",
  "cadetBlue",
  "#fa5269",
  "#8aa181",
  "#b17fc7",
  "darkSalmon",
  "deepSkyBlue",
  "indianRed",
  "khaki",
];

const consoleColors = {
  twentysixhundred: "#ff454b",
  wii: "#3a73af",
  nes: "#79ba7d",
  gb: "pink",
  ds: "#fff873",
  x360: "#8bd6d5",
  ps3: "violet",
  ps2: "#ffc14d",
  snes: "beige",
  gba: "brown",
  ps4: "cadetBlue",
  threeds: "#fa5269",
  n64: "#8aa181",
  ps: "#b17fc7",
  xb: "darkSalmon",
  pc: "deepSkyBlue",
  psp: "indianRed",
  xone: "khaki",
};

const svg = d3
  .select("#graph-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("visibility", "hidden")
  .style("position", "absolute")
  .style("z-index", "10");

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
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
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
          result = consoleColors.twentysixhundred;
          break;
        case "Wii":
          result = consoleColors.wii;
          break;
        case "NES":
          result = consoleColors.nes;
          break;
        case "GB":
          result = consoleColors.gb;
          break;
        case "DS":
          result = consoleColors.ds;
          break;
        case "X360":
          result = consoleColors.x360;
          break;
        case "PS3":
          result = consoleColors.ps3;
          break;
        case "PS2":
          result = consoleColors.ps2;
          break;
        case "SNES":
          result = consoleColors.snes;
          break;
        case "GBA":
          result = consoleColors.gba;
          break;
        case "PS4":
          result = consoleColors.ps4;
          break;
        case "3DS":
          result = consoleColors.threeds;
          break;
        case "N64":
          result = consoleColors.n64;
          break;
        case "PS":
          result = consoleColors.ps;
          break;
        case "XB":
          result = consoleColors.xb;
          break;
        case "PC":
          result = consoleColors.pc;
          break;
        case "PSP":
          result = consoleColors.psp;
          break;
        case "XOne":
          result = consoleColors.xone;
          break;
      }
      return result;
    })
    .on("mouseover", function (d) {
      let name = d.data.name;
      let category = d.data.category;
      let value = d.data.value;

      tooltip.html(
        "Name: " +
          name +
          ",<br> Category: " +
          category +
          ", <br>Value: " +
          value
      );
      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function (d) {
      return tooltip
        .style("top", d3.event.pageY - 30 + "px")
        .style("left", d3.event.pageX + 10 + "px");
    })

    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
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
      //next line adapted as gauranteed last seperate word is not required
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
      consoleArea.setAttribute("id", "legend");
      // consoleArea.innerText = JSON.stringify(consoles[i].children);
      console.log(consoles[i]);
      const h3 = consoles[i].name;
      consoleArea.innerHTML = `<div class="color-box" style="background-color: ${colorsArray[i]}"></div><h4>${h3}</h4>`;
      // consoleArea.style.backgroundColor = colorsArray[i];
      testArea.append(consoleArea);
    }
  }

  displayConsoles();
};

treeMap();
