export function createLegend(detailsArray2) {
    console.log("detailsArray2 in createLegend():", detailsArray2);

    let legend = document.getElementById("legend");
    let legendArray = [];

    legend.innerHTML = "";

    //for loop with each slice in detailsArray2, create a color icon + description for each new item and add
    //to a local array which will be checked before creating any new items
    //<i class="fa-solid fa-chart-pie"></i>

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