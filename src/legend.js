export function createLegend(detailsArray2) {
    console.log("detailsArray2 in createLegend():", detailsArray2);

    let legend = document.getElementById("legend");
    let legendArray = [];

    legend.innerHTML = "";

    //for loop looping through each unique slice in detailsArray2 
    //create a pie chart icon + label for each new item
    //add uniqueId to a local array to prevent duplicate entries

    for (let i = 0; i < detailsArray2.length; i++) {
        if (!legendArray.includes(detailsArray2[i].uniqueId)) {
            const legendEntry = document.createElement("div");
            legendEntry.classList.add("legend-entry");

            const icon = document.createElement("i");
            icon.classList.add("fas", "fa-chart-pie", "legend-icon");
            icon.style.color = detailsArray2[i].color;
            icon.style.padding = "0.2em";

            const label = document.createElement("div");
            label.classList.add("legend-label");

            const OGName = detailsArray2[i].name;
            if (OGName.length > 11) {
                label.textContent = OGName.slice(0, 11) + "...";
            } else {
                label.textContent = OGName;
            }
            label.style.color = "black";

            legendEntry.appendChild(icon);
            legendEntry.appendChild(label);

            legend.appendChild(legendEntry);

            legendArray.push(detailsArray2[i].uniqueId);
        }
    }
}