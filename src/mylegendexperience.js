import { tree, select, drag, selectAll } from 'd3'
import * as d3 from 'd3'
console.log(d3);

const { DateTime } = require('luxon');

import { saveLegendToDatabase, receiveLegendFromDatabase, saveRemoveArray, getRemoveArray, receiveTagsFromDatabase, saveTagsToDatabase, receiveSettingsFromDatabase } from './firebase/dbHandler.js'


export function closeLegendForms() {
    document.getElementById("close-add-category").addEventListener("click", function(event) {
      event.preventDefault();
      document.getElementById("categoryForm").style.display = "none";
      document.getElementById("blurred-overlay-legend").style.display = "none";
    })
    
    document.getElementById("close-delete-category").addEventListener("click", function(event) {
      event.preventDefault();
      document.getElementById("deleteForm").style.display = "none";
      document.getElementById("blurred-overlay-legend").style.display = "none";
    })
    
    document.getElementById("close-rename-category").addEventListener("click", function(event) {
      event.preventDefault();
      document.getElementById("renameForm").style.display = "none";
      document.getElementById("blurred-overlay-legend").style.display = "none";
    })
    
    document.getElementById("close-change-color").addEventListener("click", function(event) {
      event.preventDefault();
      document.getElementById("changeColorForm").style.display = "none";
      document.getElementById("blurred-overlay-legend").style.display = "none";
    })
    
    document.getElementById("close-add-tag").addEventListener("click", function(event) {
      event.preventDefault();
      document.getElementById("addTagForm").style.display = "none";
      document.getElementById("blurred-overlay-legend").style.display = "none";
    })
    
    document.getElementById("close-delete-tag").addEventListener("click", function(event) {
      event.preventDefault();
      document.getElementById("deleteTagForm").style.display = "none";
      document.getElementById("blurred-overlay-legend").style.display = "none";
    })
    
    document.getElementById("close-rename-tag").addEventListener("click", function(event) {
      event.preventDefault();
      document.getElementById("renameTagForm").style.display = "none";
      document.getElementById("blurred-overlay-legend").style.display = "none";
    })
  }

export function updateVisualization(data, svgLocation) {

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
} 

export function removeVisualization(svgLocation) {
    //const treeContainer = select("#tree-container");
    const treeContainer = select(svgLocation);
    //const treeNodes = treeContainer.selectAll(".node");
    //const treeLinks = treeContainer.selectAll(".link");
    treeContainer.selectAll(".node").remove();
    treeContainer.selectAll(".link").remove();
  
  }

export function viewTree() {
    const viewTreeBtn = document.getElementById("viewTree");
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
    })
}

export const chevronRightBtn = (clickData) => {
    console.log("Click event occurred with data:", clickData);
    const parentFolderName = clickData.name;
    console.log("parentFolderName:", parentFolderName);
  
    console.log("event", event.target);
  
    const icon = event.target;
    icon.classList.remove("fa-chevron-right");
    icon.classList.add("fa-angle-down");
    icon.removeEventListener("click", chevronRightBtn);
  
    const clickHandler = createClickHandler(clickData, angleDownBtn);
    icon.addEventListener("click", clickHandler);
  
    const parentDiv = document.getElementById(`category-${parentFolderName}`);
  
    const elementsToReveal = parentDiv.children;
    for (let i = 0; i < elementsToReveal.length; i++) {
      if (elementsToReveal[i].tagName === "DIV") {
        elementsToReveal[i].style.display = "block";
      }
    }
  };
  
export const angleDownBtn = (clickData) => {
console.log("Angle down button clicked with data:", clickData);
const parentFolderName = clickData.name;
console.log("parentFolderName:", parentFolderName);

console.log("event", event.target);

const icon = event.target;
icon.classList.remove("fa-angle-down");
icon.classList.add("fa-chevron-right");
icon.removeEventListener("click", angleDownBtn);

const clickHandler = createClickHandler(clickData, chevronRightBtn);
icon.addEventListener("click", clickHandler);

const parentDiv = document.getElementById(`category-${parentFolderName}`);

const elementsToReveal = parentDiv.children;
for (let i = 0; i < elementsToReveal.length; i++) {
    if (elementsToReveal[i].tagName === "DIV") {
    elementsToReveal[i].style.display = "none";
    }
}
}

export const createClickHandler = (clickData, clickedOn) => {
return function () {
    clickedOn(clickData);
};
};  

export function createElements(arrayParameter, parentDiv) {
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
  
export function initializeFolders(data) {
    var remakeDropdownContainer = document.getElementById("remake-dropdown-container");
  
    console.log("initializeFolders() with", data);
    createElements(data, remakeDropdownContainer);
  }
  
export function removeFolders() {
    const dropdownContainer = document.getElementById("remake-dropdown-container");
    dropdownContainer.innerHTML = "";
  }

export function myLegendBtnFunctions() {
    var remakeDropdownContainer = document.getElementById("remake-dropdown-container");

    var addCategoryButton = document.getElementById("addCategoryButton");
    var categoryForm = document.getElementById("categoryForm");
    var blurredOverlayLegend = document.getElementById("blurred-overlay-legend");
    var parentUid;
    var newCategoryName = "";
    var color = "";
    const arrayOfCategories = [];
    
    var deleteForm = document.getElementById("deleteForm");
    const renameForm = document.getElementById("renameForm");
  
  //ADD BUTTONS code
  function createNewCategory(data) {
    console.log("in createNewCategory()");
    console.log("data[data.length - 1]:", data[data.length - 1]);
  
    const parentDiv = document.createElement('div');
  
    const icon = document.createElement('i');
    icon.setAttribute("class", "empty-icon");
    icon.style.display = "inline-block";
    icon.style.width = "1.5em";
  
    const folder = document.createElement('i');
    folder.setAttribute("class", "fa-solid fa-folder");
    folder.style.fontSize = "1em";
    folder.style.color = data[data.length - 1].color;
  
    const text = document.createElement('span');
    text.textContent = data[data.length - 1].name;
    text.style.fontFamily = "var(--font-family)";
  
    parentDiv.setAttribute("class", "category");
    parentDiv.setAttribute("id", `category-${data[data.length - 1].name}`)
    parentDiv.classList.add("depth-0");
  
    parentDiv.appendChild(icon);
    parentDiv.appendChild(folder);
    parentDiv.appendChild(text);
  
    remakeDropdownContainer.appendChild(parentDiv);
  }
  
  function createNewSubcategory(parentFolder, addIconBool, newSubcategory) {
    console.log("in createNewSubcategory()");
    console.log("parentFolder:", parentFolder);
    console.log("addIconBool:", addIconBool);
    console.log("newSubcategory:", newSubcategory);
  
    const parentFolderName = parentFolder.name;
    const parentDiv = document.getElementById(`category-${parentFolderName}`);

    //this section sets up the new subcategory to be "block" or "none" based on whether the parent folder is uncollapsed or collapsed
    const parentDropdownIcon = parentDiv.querySelector("i");
    console.log("parentDropdownIcon:", parentDropdownIcon);
    const isParentCollapsed = parentDropdownIcon.classList.contains("fa-chevron-right");
  
    const childDiv = document.createElement('div');
  
    if (addIconBool) {
      const iconForParent = parentDiv.querySelector("i.empty-icon")
      iconForParent.classList.remove("empty-icon");
      iconForParent.classList.add("fa-solid");
      iconForParent.classList.add("fa-chevron-right");
      iconForParent.style.width = "";
      iconForParent.style.fontSize = "1.2em";
      iconForParent.style.color = "gray";
      const clickHandler = createClickHandler(parentFolder, chevronRightBtn);
      iconForParent.addEventListener("click", clickHandler);
    }
  
    const iconForChild = document.createElement('i');
    iconForChild.setAttribute("class", "empty-icon");
    iconForChild.style.display = "inline-block";
    iconForChild.style.width = "1.5em";
  
    const folder = document.createElement('i');
    folder.setAttribute("class", "fa-solid fa-folder");
    folder.style.fontSize = "1em";
    folder.style.color = newSubcategory.color;
  
    const text = document.createElement('span');
    text.textContent = newSubcategory.name;
    text.style.fontFamily = "var(--font-family)";
  
    childDiv.setAttribute("class", "category");
    childDiv.setAttribute("id", `category-${newSubcategory.name}`);
  
    const classParent = parentDiv.getAttribute("class");
    const match = classParent.match(/depth-(\d+)/);
    if (match) {
      const depth = parseInt(match[1]) + 1;
      childDiv.classList.add(`depth-${depth}`);
      childDiv.style.marginLeft = "2.3em";
      childDiv.style.display = isParentCollapsed ? "none" : "block";
    }
  
    childDiv.appendChild(iconForChild);
    childDiv.appendChild(folder);
    childDiv.appendChild(text);
  
    parentDiv.appendChild(childDiv);
  }
  
  addCategoryButton.addEventListener("click", function () {
    console.log("addCategoryButton()")
  
    receiveLegendFromDatabase()
      .then((legend) => {
  
        categoryForm.style.display = "block";
        blurredOverlayLegend.style.display = "block";
  
        var formSubmissionPromise = new Promise(function (resolve, reject) {
          categoryForm.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log("form submitted");
  
            parentUid = document.querySelector('#options').value;
            console.log("Selected option uid:", parentUid);
  
            if (parentUid !== "No parent") {
              parentUid = (JSON.parse(parentUid)).uniqueId;
            }
  
            console.log("parentUid:", parentUid);
  
            newCategoryName = document.querySelector('#textInput').value;
            console.log('Entered text:', newCategoryName);
  
            color = document.querySelector('#colorInputForNewCategory').value;
            console.log('Entered color:', color);
  
            categoryForm.style.display = "none";
            blurredOverlayLegend.style.display = "none";
  
            resolve({
              parentUid: parentUid,
              newCategoryName: newCategoryName,
              color: color
            });
          });
        });
  
        const selectElement = document.getElementById('options');
  
        createDropdownOptions(legend);
        arrayOfCategories.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
  
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
  
        const noParentOption = document.createElement('option');
        noParentOption.value = "No parent";
        noParentOption.textContent = "No parent";
        selectElement.appendChild(noParentOption);
  
        for (let i = 0; i < arrayOfCategories.length; i++) {
          if (arrayOfCategories[i].name === "Remaining") {
          } else {
            const option = document.createElement('option');
            option.value = JSON.stringify(arrayOfCategories[i]);
            option.textContent = arrayOfCategories[i].name;
            selectElement.appendChild(option);
          }
        }
  
        formSubmissionPromise.then(function (formValues) {
  
          const now = DateTime.now();
          const uniqueId = now.toFormat('yyyyMMddHHmmssSSS');
  
          var newData = {
            name: formValues.newCategoryName,
            color: formValues.color,
            uniqueId: uniqueId,
            children: []
          };
  
          if (formValues.parentUid !== "No parent") {
            const result = findDataPoint(legend, formValues.parentUid, newData);
  
            removeVisualization("#tree-container");
            updateVisualization(legend, "#tree-container");
            console.log("newData:", newData);
            console.log("parentData:", result.parentData);
            console.log("needToAddIcon:", result.needToAddIcon);
            createNewSubcategory(result.parentData, result.needToAddIcon, newData);
            saveLegendToDatabase(legend);
          } else if (formValues.parentUid === "No parent") {
            console.log("No parent");
            console.log("newData:", newData);
  
            legend.push(newData);
  
            removeVisualization("#tree-container");
            updateVisualization(legend, "#tree-container");
            ////addNewFolder();
            createNewCategory(legend);
            ////removeFolders()
            ////initializeFolders(data);
            saveLegendToDatabase(legend);
          }
        })
      })
  });
  
  function createDropdownOptions(data) {
    for (const x of data) {
        const obj = { name: "", uniqueId: "", color: "" }
  
        obj.name = x.name;
        obj.uniqueId = x.uniqueId;
        obj.color = x.color;
  
        arrayOfCategories.push(obj);
        if (x.children !== undefined) {
            createDropdownOptions(x.children)
        }
    }
  }
  
  function findDataPoint(legend, parentUid, newData) {
    console.log("legend parameter in findDataPoint:", legend);
    for (const x of legend) {
      if (x.uniqueId === parentUid) {
        let parentData = x;
        console.log("parentData is ", parentData);
        if (x.children === undefined) {
          var needToAddIcon = true;
          console.log("needtoAddIcon is true");
        } else {
          needToAddIcon = false;
          console.log("needtoAddIcon is false");
        }
        //newData.color = x.color;
  
        if (x.children === undefined) {
          x.children = [];
          x.children.push(newData);
        } else {
          x.children.push(newData);
        }
        return { parentData, needToAddIcon };
      }
      if (x.children !== undefined) {
        const result = findDataPoint(x.children, parentUid, newData);
        if (result) {
          return { parentData: result.parentData, needToAddIcon: result.needToAddIcon }
        }
      }
    }
  }
  
  //DELETE BUTTON code
  document.getElementById("deleteButton").addEventListener("click", function () {
    console.log("deleteButton()");
  
    receiveLegendFromDatabase()
      .then((legend) => {
  
        deleteForm.style.display = "block";
        blurredOverlayLegend.style.display = "block";
  
        var deleteFormSubmissionPromise = new Promise(function (resolve, reject) {
          deleteForm.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log("form submitted");
  
            const deleteOption = document.querySelector('#optionsForDelete').value;
            console.log('Selected option:', deleteOption);
  
            resolve({
              deleteOption: deleteOption
            });
          });
        });
  
        const selectElement = document.getElementById('optionsForDelete');
  
        const categoryDivs = document.getElementsByClassName("category");
        const arrayOfCategories = [];
        for (const x of categoryDivs) {
          arrayOfCategories.push(x.querySelector("span").textContent);
        }
        arrayOfCategories.sort();
        for (let i = 0; i < arrayOfCategories.length; i++) {
          const option = document.createElement('option');
          option.value = arrayOfCategories[i];
          option.textContent = arrayOfCategories[i];
          selectElement.appendChild(option);
        }
  
        deleteFormSubmissionPromise.then(function (formValues) {
  
          deleteForm.style.display = "none";
          blurredOverlayLegend.style.display = "none";
  
          var newData = { //tree to delete
            name: formValues.deleteOption,
          };
  
          console.log("formValues.deleteOption:", formValues.deleteOption);
  
          const removedItem = findDataPointToDelete(legend, formValues.deleteOption, newData);
  
          console.log("removedItem:", removedItem);
          console.log(typeof removedItem);
          console.log("legend after findDataPointToDelete", legend);
  
          getRemoveArray()
            .then((removeArray) => {
              console.log("removeArray after received:", removeArray);
              if (removedItem.instances === 0 || removedItem.instances === undefined) {
                console.log("no instances of deleted item so not saved into removeArray");
              } else {
                removeArray.push(removedItem);
                console.log("removeArray:", removeArray);
                saveRemoveArray(removeArray);
              }
            })
          saveLegendToDatabase(legend);
          removeVisualization("#tree-container")
          updateVisualization(legend, "#tree-container");
          removeFolders();
          initializeFolders(legend);
        })
      })
  })
  
  function findDataPointToDelete(legend, deleteName, newData) {
    for (let i = 0; i < legend.length; i++) {
      if (legend[i].name === deleteName) {
        removedItem = legend.splice(i, 1);
        console.log("removedItem in findDataPointToDelete:", removedItem);
        return removedItem[0];
      }
      if (legend[i].children !== undefined) {
        removedItem = findDataPointToDelete(legend[i].children, deleteName, newData);
        if (removedItem) {
          return removedItem;
        }
      }
    }
  }
  
  //RENAME BUTTON code
  function findDataPointToRenameOrChangeColor(legend, targetName) {
    console.log("findDataPointToRenameOrChangeColor");
    for (const x of legend) {
      if (x.name === targetName) {
        return x;
      }
      if (x.children !== undefined) {
        const objFromLegend = findDataPointToRenameOrChangeColor(x.children, targetName);
        if (objFromLegend) {
          return objFromLegend;
        }
      }
    }
  }
    
  document.getElementById("renameButton").addEventListener("click", function () {
    console.log("renameButton");
  
    receiveLegendFromDatabase()
      .then((legend) => {
  
        renameForm.style.display = "block";
        blurredOverlayLegend.style.display = "block";
  
        var renameFormSubmissionPromise = new Promise(function (resolve, reject) {
          renameForm.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log("form submitted");
  
            const targetName = document.querySelector('#optionsForRename').value;
            console.log('Selected option:', targetName);
  
            const renameValue = document.querySelector('#renameValue').value;
            console.log('Entered text:', renameValue);
  
            renameForm.style.display = "none";
  
            resolve({
              targetName: targetName,
              renameValue: renameValue
            });
          });
        });
  
        const selectElement = document.getElementById('optionsForRename');
  
        const categoryDivs = document.getElementsByClassName("category");
        const arrayOfCategories = [];
        for (const x of categoryDivs) {
          arrayOfCategories.push(x.querySelector("span").textContent);
        }
        arrayOfCategories.sort();
        for (let i = 0; i < arrayOfCategories.length; i++) {
          const option = document.createElement('option');
          option.value = arrayOfCategories[i];
          option.textContent = arrayOfCategories[i];
          selectElement.appendChild(option);
        }
  
        renameFormSubmissionPromise.then(function (formValues) {
  
          const objFromLegend = findDataPointToRenameOrChangeColor(legend, formValues.targetName);
          objFromLegend.name = formValues.renameValue;
  
          removeVisualization("#tree-container");
          updateVisualization(legend, "#tree-container");
          removeFolders();
          initializeFolders(legend);
          saveLegendToDatabase(legend);
        })
      })
  })
  
  const changeColorForm = document.getElementById("changeColorForm");
  
  //CHANGE COLOR BUTTON code
  
  document.getElementById("changeColorButton").addEventListener("click", function () {
    console.log("changeColorButton");
  
    receiveLegendFromDatabase()
      .then((legend) => {
  
        changeColorForm.style.display = "block";
        blurredOverlayLegend.style.display = "block";
  
        var changeColorFormSubmissionPromise = new Promise(function (resolve, reject) {
          changeColorForm.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log("form submitted");
  
            const targetName = document.querySelector('#optionsForChangeColor').value;
            console.log('Selected option:', targetName);
  
            const colorValue = document.querySelector('#colorInputForChangeColor').value;
            console.log('Entered color:', colorValue);
  
            changeColorForm.style.display = "none";
  
            resolve({
              targetName: targetName,
              colorValue: colorValue
            });
          });
        });
  
        const selectElement = document.getElementById('optionsForChangeColor');
  
        const categoryDivs = document.getElementsByClassName("category");
        const arrayOfCategories = [];
        for (const x of categoryDivs) {
          arrayOfCategories.push(x.querySelector("span").textContent);
        }
        arrayOfCategories.sort();
        for (let i = 0; i < arrayOfCategories.length; i++) {
          const option = document.createElement('option');
          option.value = arrayOfCategories[i];
          option.textContent = arrayOfCategories[i];
          selectElement.appendChild(option);
        }
  
        changeColorFormSubmissionPromise.then(function (formValues) {
  
          const objFromLegend = findDataPointToRenameOrChangeColor(legend, formValues.targetName);
          objFromLegend.color = formValues.colorValue;
  
          console.log("objFromLegend:", objFromLegend);
          removeVisualization("#tree-container");
          updateVisualization(legend, "#tree-container");
          removeFolders();
          initializeFolders(legend);
          saveLegendToDatabase(legend);
        })
      })
  })
  
  //ADD and DELETE and RENAME tags code
  const addTagForm = document.getElementById("addTagForm");
  const tagContainer = document.getElementById("tag-container");
  const deleteTagForm = document.getElementById("deleteTagForm");
  const renameTagForm = document.getElementById("renameTagForm"); 
  
  document.getElementById("addTag").addEventListener("click", function () {
  
    receiveTagsFromDatabase()
      .then((tags) => {
  
        addTagForm.style.display = "block";
        blurredOverlayLegend.style.display = "block";
  
        var addTagFormSubmissionPromise = new Promise(function (resolve, reject) {
          addTagForm.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log("form submitted");
  
            const tagName = document.querySelector('#tagName').value;
  
            const now = DateTime.now();
            const uniqueId = now.toFormat('yyyyMMddHHmmssSSS');
  
            addTagForm.style.display = "none";
  
            resolve({
              tagName: tagName,
              uniqueId: uniqueId
            });
          });
        });
        addTagFormSubmissionPromise.then(function (formValues) {
  
          const newData = {
            tagName: formValues.tagName,
            uniqueId: formValues.uniqueId
          }
  
          tags.push(newData);
  
          updateTags(tags);
          saveTagsToDatabase(tags);
        })
  
      })
  })
  
  document.getElementById("deleteTag").addEventListener("click", function () {
    console.log("deleteTag()");
  
    receiveTagsFromDatabase()
      .then((tags) => {
        deleteTagForm.style.display = "block";
        blurredOverlayLegend.style.display = "block";
        var deleteTagFormSubmissionPromise = new Promise(function (resolve, reject) {
          deleteTagForm.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("form submitted");
  
            const deleteOption = document.querySelector("#tagOptionsToDelete").value;
            console.log("deleteOption:", deleteOption);
  
            resolve({
              deleteOption: deleteOption
            });
          })
        })
        const selectElement = document.getElementById("tagOptionsToDelete");
  
        tags.sort((a, b) => {
          const tagNameA = a.tagName.toLowerCase();
          const tagNameB = b.tagName.toLowerCase();
  
          if (tagNameA > tagNameB) {
            return 1;
          }
          if (tagNameA < tagNameB) {
            return -1;
          }
          return 0;
        })
  
        for (let i = 0; i < tags.length; i++) {
          const option = document.createElement("option");
          option.value = tags[i].uniqueId;
          option.textContent = tags[i].tagName;
          selectElement.appendChild(option);
        }
  
        deleteTagFormSubmissionPromise.then((formValues) => {
          deleteTagForm.style.display = "none";
  
          let removedTag = {};
          
          for (let j = 0; j < tags.length; j++) {
            if (tags[j].uniqueId === formValues.deleteOption) {
              removedTag = tags.splice(j, 1);
            }
          }
          console.log("removedTag:", removedTag);
  
          getRemoveArray(removedTag)
            .then((removeArray) => {
              if (removedTag[0].instances === 0 || removedTag[0].instances === undefined) {
                console.log("no instances of deleted tag so not saved into removeArray");
              } else {
                removeArray.push(removedTag[0]);
                console.log("removeArray:", removeArray);
                saveRemoveArray(removeArray);
              }
            })
          updateTags(tags);
          saveTagsToDatabase(tags);
        })
      })
  })
  
  document.getElementById("renameTag").addEventListener("click", function () {
    console.log("renameTag()");
  
    receiveTagsFromDatabase()
      .then((tags) => {
  
        renameTagForm.style.display = "block";
        blurredOverlayLegend.style.display = "block";
  
        var renameTagFormSubmissionPromise = new Promise(function (resolve, reject) {
          renameTagForm.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log("form submitted");
  
            const targetUid = document.querySelector('#tagOptionsForRename').value;
            console.log('Selected option:', targetUid);
  
            const renameValue = document.querySelector('#tagRenameValue').value;
            console.log('Entered text:', renameValue);
  
            renameTagForm.style.display = "none";
  
            resolve({
              targetUid: targetUid,
              renameValue: renameValue
            });
          });
        });
  
        const selectElement = document.getElementById("tagOptionsForRename");
  
        tags.sort((a, b) => {
          const tagNameA = a.tagName.toLowerCase();
          const tagNameB = b.tagName.toLowerCase();
  
          if (tagNameA > tagNameB) {
            return 1;
          }
          if (tagNameA < tagNameB) {
            return -1;
          }
          return 0;
        })
  
        for (let i = 0; i < tags.length; i++) {
          const option = document.createElement("option");
          option.value = tags[i].uniqueId;
          option.textContent = tags[i].tagName;
          selectElement.appendChild(option);
        }
  
        renameTagFormSubmissionPromise.then(function (formValues) {
  
          for (const x of tags) {
            if (x.uniqueId === formValues.targetUid) {
              x.tagName = formValues.renameValue;
            }
          } 
          updateTags(tags);
          saveTagsToDatabase(tags);
        })
      })
  })
  
  }

//commented out some settings (dark/light mode code in below function)
export function updateTags(tags) {

    const tagContainer = document.getElementById("tag-container");

    tagContainer.innerHTML = "";
  
    for (const tag of tags) {
      const tagElement = document.createElement("span");
  
      tagElement.textContent = tag.tagName;
      tagElement.classList.add('tag');
      /* if (settings.darkLightMode === "dark-mode") {
        tagElement.classList.add("dark-mode");
      } else if (settings.darkLightMode === "light-mode") {
        tagElement.classList.add('light-mode');
      } */
  
      tagContainer.appendChild(tagElement);
    }
  }