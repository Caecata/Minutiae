//import { legend } from './legend.js';
//import { checkDeviceWidth, isMobile } from './responsiveness.js'; ASK JANSEN WHY THIS IMPORT IS NOT WORKING 
import { tree, select, drag, selectAll } from 'd3'
import * as d3 from 'd3'
console.log(d3);
//import * as d3 from 'd3'
const { DateTime } = require('luxon');
import { initializeDarkLightMode } from './darklightmodecustomize.js'
import { registerVersion } from 'firebase/app';
import { checkDatabaseForFirstTime, saveLegendToDatabase, receiveLegendFromDatabase, setPlaceholderToFalse, saveRemoveArray, getRemoveArray, receiveTagsFromDatabase, saveTagsToDatabase, receiveSettingsFromDatabase } from './firebase/dbHandler.js'
import { signOutUser } from './firebase/authentication.js'

import { closeLegendForms, updateVisualization, removeVisualization, viewTree, chevronRightBtn, angleDownBtn, createClickHandler, createElements, initializeFolders, removeFolders, myLegendBtnFunctions, updateTags } from './mylegendexperience.js'

//enables signing out on this page
let signInBtn = document.getElementById("sign-in");
signInBtn.addEventListener("click", signOutUser);

//close button event listeners for the forms 
closeLegendForms();

//loading screen
const loadingScreen = document.getElementById('loading-screen');

//global variables
let initializationOption = "A";
let settings = {};

receiveSettingsFromDatabase()
  .then((receivedSettings) => {
    settings = receivedSettings;
    if (settings !== null) {
      if (settings.font !== "default") {
        const userFont = `${settings.font}, sans-serif`;
        changeFontFamily(userFont);
      }
      if (settings.darkLightMode === "dark-mode") {
      } else if (settings.darkLightMode === "light-mode") {
          document.body.classList.remove("dark-mode");
          document.body.classList.add('light-mode');
          const darkModeElements = document.querySelectorAll(".dark-mode");
          darkModeElements.forEach((element) => {
              element.classList.remove("dark-mode");
              element.classList.add("light-mode");

              const modeSwitcher = document.getElementById("mode-switcher");
              modeSwitcher.querySelector(".mode-text").textContent = "Light Mode";
              modeSwitcher.querySelector(".dark-icon").classList.add("hidden");
              modeSwitcher.querySelector(".light-icon").classList.remove("hidden")
          });
      }
    }
    loadingScreen.style.display = "none";
  }) 

//change font based on settings
function changeFontFamily(fontFamily) {
    document.documentElement.style.setProperty('--font-family', fontFamily);
}

const data = [
  {
    name: "Sleep",
    color: "#5F05B3",
    uniqueId: "00001122334455001"
  },
  {
    name: "Work",
    color: "#09BC8A",
    uniqueId: "00001122334455003"
  },
  {
    name: "Miscellaneous",
    color: "#3587A4",
    uniqueId: "00001122334455007"
  },
  {
    name: "Meal",
    color: "#F21B3F",
    uniqueId: "00001122334455011"
  },
  {
    name: "Play",
    color: "#FF9914",
    uniqueId: "00001122334455016"
  },
  { name: "Remaining", color: "white", uniqueId: "00001122334455019" }
]

export const data2 = [
  {
    name: "Unproductive",
    color: "#FF0000",
    uniqueId: "00001122334455020"
  },
  {
    name: "Productive",
    children: [
      { name: "Work", color: "#00FF00", uniqueId: "00001122334455025" }
    ],
    color: "#00FF00",
    uniqueId: "00001122334455024"
  },
  {
    name: "Essential",
    children: [
      { name: "Sleep", color: "#0000FF", uniqueId: "00001122334455029" },
      { name: "Chores", color: "#0000FF", uniqueId: "00001122334455030" },
      { name: "Self Maintenance", color: "#0000FF", uniqueId: "00001122334455031" },
    ],
    color: "#0000FF", uniqueId: "00001122334455028",
  },
  { name: "Remaining", color: "white", uniqueId: "00001122334455032" }
]

//exported into dark/light mode js file to re-render the visualization when the mode changes so that the text of the svg changes with the toggle
/* export function updateVisualization(data, svgLocation) {

  let root = d3.hierarchy({ children: data });
  let treeLayout = tree()
  treeLayout.size([400, 400]);
  treeLayout.separation((a, b) => {
    if (a.depth === 1 && b.depth === 1) {
      return 2;
    }
    return 1;
  });
  let treeData = treeLayout(root);
  treeData.descendants().forEach(node => {
    const x = node.x;
    node.x = node.y;
    node.y = x;
  });
  let svg = select(svgLocation)
    .append("svg")
    .attr("width", 700)
    .attr("height", 500)
    .append("g")
    .attr("transform", "translate(50,50)");
  let links = svg.selectAll(".link")
    .data(treeData.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d => {
      const sourceX = d.source.y;
      const sourceY = d.source.x;
      const targetX = d.target.y;
      const targetY = d.target.x;

      return `M${sourceY},${sourceX}L${targetY},${targetX}`;

    })
    .style("fill", "none")
    .style("stroke", "darkgrey")
    .style("stroke-width", 2);
  //links.exit().remove();
  let nodes = svg.selectAll(".node")
    .data(treeData.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`);
  nodes.append("circle")
    .attr("r", d => d.depth === 1 ? 6 : 4)
    .attr("fill", d => d.data.color);
  //nodes.style("stroke", "black")
  //nodes.style("stroke-width", 0.5);
  nodes.append("text")
    .attr("dy", d => {
      if (d.children) {
        if (d.depth === 1) {
          return "-1em";
        } else if (d.depth === 0 || d.depth === 2) {
          return "0.31em";
        }
      } else {
        return "0.31em";
      }
    })
    .attr("x", d => {
      if (d.children) {
        if (d.depth === 0) {
          return "-5";
        } else if (d.depth === 1) {
          return "0"
        } else if (d.depth === 2) {
          return "5"
        }
      } else {
        return "7";
      }
    })
    .attr("text-anchor", d => {
      if (d.children) {
        if (d.depth === 0) {
          return "end";
        } else if (d.depth === 1) {
          return "middle";
        } else if (d.depth === 2) {
          return "start";
        }
      } else {
        return "start";
      }
    })
    .text(d => d.data.name)
  const classBody = document.body.getAttribute("class");
  if (classBody === "dark-mode") {
    nodes.style("font-size", "12px")
      .attr("fill", "white");
    nodes.style("stroke", "white");
    nodes.style("stroke-width", 0.3)
  } else {
    nodes.style("font-size", "12px")
      .attr("fill", "black");
    nodes.style("stroke", "black");
    nodes.style("stroke-width", 1);
  }
}  */

/* commented out to begin with
export function updateVisualization(data, svgLocation, nodeArray) {
  root = hierarchy({ children: data });
  treeLayout = tree()
  treeLayout.size([400, 400]);
  treeLayout.separation((a, b) => {
    if (a.depth === 1 && b.depth === 1) {
      return 2;
    } else if ((nodeArray.includes(a.data.uniqueId) && a.depth === b.depth) || (nodeArray.includes(b.data.uniqueId) && a.depth === b.depth)) {
      console.log("condition met");
      return 2;
    }
    return 1;
  });
  treeData = treeLayout(root);
  treeData.descendants().forEach(node => {
    const x = node.x;
    node.x = node.y;
    node.y = x;
  });
  svg = select(svgLocation)
    .append("svg")
    .attr("width", 700)
    .attr("height", 500)
    .append("g")
    .attr("transform", "translate(50,50)");
  links = svg.selectAll(".link")
    .data(treeData.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d => {
      const sourceX = d.source.y;
      const sourceY = d.source.x;
      const targetX = d.target.y;
      const targetY = d.target.x;

      return `M${sourceY},${sourceX}L${targetY},${targetX}`;

    })
    .style("fill", "none")
    .style("stroke", "darkgrey")
    .style("stroke-width", 2);
  //links.exit().remove();
  nodes = svg.selectAll(".node")
    .data(treeData.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`);
  nodes.append("circle")
    .attr("r", d => d.depth === 1 ? 6 : 4)
    .attr("fill", d => d.data.color);
  //nodes.style("stroke", "black")
  //nodes.style("stroke-width", 0.5);
  nodes.append("text")
    .attr("dy", d => {
      if (d.children) {
        if (d.depth === 1) {
          return "-1em";
        } else if (d.depth === 0 || d.depth === 2) {
          return "0.31em";
        }
      } else {
        return "0.31em";
      }
    })
    .attr("x", d => {
      if (d.children) {
        if (d.depth === 0) {
          return "-5";
        } else if (d.depth === 1) {
          return "0"
        } else if (d.depth === 2) {
          return "5"
        }
      } else {
        return "7";
      }
    })
    .attr("text-anchor", d => {
      if (d.children) {
        if (d.depth === 0) {
          return "end";
        } else if (d.depth === 1) {
          return "middle";
        } else if (d.depth === 2) {
          return "start";
        }
      } else {
        return "start";
      }
    })
    .text(d => d.data.name)
  const classBody = document.body.getAttribute("class");
  if (classBody === "dark-mode") {
    nodes.style("font-size", "12px")
      .attr("fill", "white");
    nodes.style("stroke", "white");
    nodes.style("stroke-width", 0.3)
  } else {
    nodes.style("font-size", "12px")
      .attr("fill", "black");
    nodes.style("stroke", "black");
    nodes.style("stroke-width", 1);
  }
} */

/* export function removeVisualization(svgLocation) {
  //const treeContainer = select("#tree-container");
  const treeContainer = select(svgLocation);
  //const treeNodes = treeContainer.selectAll(".node");
  //const treeLinks = treeContainer.selectAll(".link");
  treeContainer.selectAll(".node").remove();
  treeContainer.selectAll(".link").remove();

} */

//view tree button (put this into a function called viewTree())

/* const viewTreeBtn = document.getElementById("viewTree");
const treeBackdrop = document.getElementById("tree-backdrop");
let treeOpen = false;

viewTreeBtn.addEventListener("click", function() {

  if (treeOpen === false) {
    treeBackdrop.style.display = "block";
    viewTreeBtn.innerHTML = "Close Tree";
    treeOpen = true;
  } else {
    treeBackdrop.style.display = "none"
    viewTreeBtn.innerHTML = "View Tree";
    treeOpen = false;
  }
}) */

viewTree();

//FOLDER SYSTEM

//checks if user needs to select a new legend or if user already has an existing legend to view
//because initializeFolders must be located after createClickHandler(), all of the async functions are nested here

checkDatabaseForFirstTime()
  .then((boolean) => {
    if (boolean === true) {
      console.log("boolean is true");
    
      initializeChoice();

      updateVisualization(data, "#tree-container");
      initializeFolders(data);

    } else if (boolean === undefined || boolean === false) {
      receiveLegendFromDatabase()
        .then((legend) => {
          console.log("boolean is undefined");

          //for tree formatting purposes
          /*let nodeArray = [];
          function findNodesWhichNeedSpace(data) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].children !== undefined) {
                if (data[i].children.length > 2) {
                  nodeArray.push(data[i].uniqueId);
                }
                findNodesWhichNeedSpace(data[i].children);
              }
            }
          }
          findNodesWhichNeedSpace(legend); */

          updateVisualization(legend, "#tree-container");
          initializeFolders(legend); //must be after createClickHandler();
          receiveTagsFromDatabase()
            .then((tags) => {
              updateTags(tags);
            })
        })
    }
  })


//Functions for setting up first user with a legend
function initializeChoice() {
  document.getElementById("choose").style.display = "block";
  document.getElementById("or").style.display = "block";
  document.getElementById("then").style.display = "block";

  document.getElementById("choice-one-button").style.display = "block";
  document.getElementById("choice-two-button").style.display = "block";
  document.getElementById("submit-initialization").style.display = "block";

  document.getElementById("app-url").classList.add("deactivated-link");
  document.getElementById("app-url").addEventListener("click", function (event) {
    event.preventDefault();
  })
  document.getElementById("data-url").classList.add("deactivated-link");
  document.getElementById("data-url").addEventListener("click", function (event) {
    event.preventDefault();
  })
  document.getElementById("calendar-url").classList.add("deactivated-link");
  document.getElementById("calendar-url").addEventListener("click", function (event) {
    event.preventDefault();
  })
  document.getElementById("settings-url").classList.add("deactivated-link");
  document.getElementById("settings-url").addEventListener("click", function (event) {
    event.preventDefault();
  })
  //will have to also add event.preventDefault() to the interactive legend components once the icons have been adjusted or the buttons moved
}
function endInitialization() {
  document.getElementById("choose").style.display = "none";
  document.getElementById("or").style.display = "none";
  document.getElementById("then").style.display = "none";

  document.getElementById("choice-one-button").style.display = "none";
  document.getElementById("choice-two-button").style.display = "none";
  document.getElementById("submit-initialization").style.display = "none";

  document.getElementById("app-url").classList.remove("deactivated-link");
  document.getElementById("data-url").classList.remove("deactivated-link");
  document.getElementById("calendar-url").classList.remove("deactivated-link");
  document.getElementById("settings-url").classList.remove("deactivated-link");
}

document.getElementById("choice-one-button").addEventListener("click", function() {
  console.log("choice one button");

  removeVisualization("#tree-container");
  removeFolders();

  updateVisualization(data, "#tree-container");
  initializeFolders(data);

  initializationOption = "A";

})

document.getElementById("choice-two-button").addEventListener("click", function() {
  console.log("choice one button");

  removeVisualization("#tree-container");
  removeFolders();

  updateVisualization(data2, "#tree-container");
  initializeFolders(data2);
  
  initializationOption = "B";

})

document.getElementById("submit-initialization").addEventListener("click", function() {
  console.log("submit:", initializationOption);
  if (initializationOption === "A") {
    saveLegendToDatabase(data);
    setPlaceholderToFalse();
    endInitialization();

    removeVisualization("#tree-container");
    removeFolders();

    updateVisualization(data, "#tree-container");
    initializeFolders(data);
  } else if (initializationOption === "B") {
    saveLegendToDatabase(data2);
    setPlaceholderToFalse();
    endInitialization();

    removeVisualization("#tree-container");
    removeFolders();

    updateVisualization(data2, "#tree-container");
    initializeFolders(data2);
  }
})

//Functions for folders (there are 3 functions here)
/* function createElements(arrayParameter, parentDiv) {
  var remakeDropdownContainer = document.getElementById("remake-dropdown-container");


  console.log("creatingElements for ", arrayParameter, " and appending to ", parentDiv);
  for (const x of arrayParameter) {
    const childDiv = document.createElement('div');
    const icon = document.createElement('i');

    if (x.children !== undefined) { //if (x.children.length !== 0)
      icon.setAttribute("class", "fa-solid fa-chevron-right");
      icon.style.fontSize = "1.2em";
      icon.style.color = "gray";

      const clickHandler = createClickHandler(x, chevronRightBtn);
      icon.addEventListener('click', clickHandler);
    } else {
      icon.setAttribute("class", "empty-icon");
      icon.style.display = "inline-block";
      icon.style.width = "1.5em";
    }

    const folder = document.createElement('i');
    folder.setAttribute("class", "fa-solid fa-folder");
    folder.style.fontSize = "1em"; //1.2em
    folder.style.color = x.color;

    const text = document.createElement('span');
    text.textContent = x.name;
    text.style.fontFamily = "var(--font-family)";

    childDiv.setAttribute("class", "category");
    childDiv.setAttribute("id", `category-${x.name}`);

    if (parentDiv == remakeDropdownContainer) {
      childDiv.classList.add("depth-0");
    } else {
      const classParent = parentDiv.getAttribute("class");
      const match = classParent.match(/depth-(\d+)/);
      if (match) {
        const depth = parseInt(match[1]) + 1;
        childDiv.classList.add(`depth-${depth}`);
        childDiv.style.marginLeft = "2.3em"; //marginLeft = `${depth * 2.3}em`;
        childDiv.style.display = "none";
      }
    }

    childDiv.appendChild(icon);
    childDiv.appendChild(folder);
    childDiv.appendChild(text);

    parentDiv.append(childDiv);

    if (x.children !== undefined) { //if (x.children.length !== 0)
      const childArray = x.children;
      createElements(childArray, childDiv);
    }
  }
}
function initializeFolders(data) {
  var remakeDropdownContainer = document.getElementById("remake-dropdown-container");

  console.log("initializeFolders() with", data);
  createElements(data, remakeDropdownContainer);
}

function removeFolders() {
  const dropdownContainer = document.getElementById("remake-dropdown-container");
  dropdownContainer.innerHTML = "";
} */

//package all of this below to a function called myLegendBtnFunctions

myLegendBtnFunctions();

//Output Tags
/* function updateTags(tags) {

  tagContainer.innerHTML = "";

  for (const tag of tags) {
    const tagElement = document.createElement("span");

    tagElement.textContent = tag.tagName;
    tagElement.classList.add('tag');
    if (settings.darkLightMode === "dark-mode") {
      tagElement.classList.add("dark-mode");
    } else if (settings.darkLightMode === "light-mode") {
      tagElement.classList.add('light-mode');
    }

    tagContainer.appendChild(tagElement);
  }
}  */








