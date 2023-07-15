export const legendData = [
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