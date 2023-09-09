//import { legend } from './legend.js';
//import { checkDeviceWidth, isMobile } from './responsiveness.js'; ASK JANSEN WHY THIS IMPORT IS NOT WORKING 
import { tree, select, drag, selectAll } from 'd3'
import * as d3 from 'd3'
console.log(d3);
//import * as d3 from 'd3'
const { DateTime } = require('luxon');
import { initializeDarkLightMode } from './darklightmodecustomize.js'
import { registerVersion } from 'firebase/app';
import { checkDatabaseForFirstTime, saveLegendToDatabase, receiveLegendFromDatabase, setPlaceholderToFalse, saveRemoveArray, getRemoveArray, receiveTagsFromDatabase, saveTagsToDatabase, receiveSettingsFromDatabase, getTutorialState, saveTutorialState } from './firebase/dbHandler.js'
import { signOutUser } from './firebase/authentication.js'

import { closeLegendForms, updateVisualization, removeVisualization, viewTree, chevronRightBtn, angleDownBtn, createClickHandler, createElements, initializeFolders, removeFolders, myLegendBtnFunctions, updateTags } from './mylegendexperience.js'
import { initializeChoice, endInitialization, data, data2, updateTutorial, updateMenuElements, identifyNextStep } from './tutorial.js'

//enables signing out on this page
let signInBtn = document.getElementById("sign-in");
signInBtn.addEventListener("click", signOutUser);

//close button event listeners for the forms 
closeLegendForms();

//loading screen
const loadingScreen = document.getElementById('loading-screen');

//global variables
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

viewTree();

//FOLDER SYSTEM
//checks if user needs to select a new legend or if user already has an existing legend to view
//because initializeFolders must be located after createClickHandler(), all of the async functions are nested here

/* checkDatabaseForFirstTime()
  .then((boolean) => {
    if (boolean === true) {

      //putting the below into updateTutorial
    console.log("boolean is true");
    
    initializeChoice();

    updateVisualization(data, "#tree-container");
    initializeFolders(data);

  } else if (boolean === undefined || boolean === false) {
    receiveLegendFromDatabase()
        .then((legend) => {
          console.log("boolean is undefined");

          updateVisualization(legend, "#tree-container");
          initializeFolders(legend); //must be after createClickHandler();
          receiveTagsFromDatabase()
            .then((tags) => {
              updateTags(tags);
            })
        }) 
  }
}) */

  getTutorialState()
    .then((tutorialState) => {
      console.log("tutorialState:", tutorialState);
      if (tutorialState.finalMessage === false) {
        updateTutorial(tutorialState);
      } else {
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


    
    
    //else if (boolean === undefined || boolean === false) {
      /* receiveLegendFromDatabase()
        .then((legend) => {
          console.log("boolean is undefined");

          updateVisualization(legend, "#tree-container");
          initializeFolders(legend); //must be after createClickHandler();
          receiveTagsFromDatabase()
            .then((tags) => {
              updateTags(tags);
            })
        }) */
    //}
  //})

//initializeChoice() and endInitialization() 

myLegendBtnFunctions();








