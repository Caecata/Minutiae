/* const legend = [
   {name: "Sleep", subcategory: ["Nap"], color: '#5F05B3'},
   {name: "Work", subcategory: ["Job Search", "Programming", "Learning"], color: '#09BC8A'},
   {name: "Transition", subcategory: ["Driving", "Teeth", "Cleaning"], color: '#3587A4'},
   {name: "Meal", subcategory: ["Breakfast", "Lunch", "Dinner", "Snack"], color: '#F21B3F'},
   {name: "TV", subcategory: ["LoL", "Show"], color: '#FF9914'},
   {name: "Remaining", subcategory: [], color: 'white'},
];   */
/*
//less efficient (requires loop)
const fully_delete_catagories = [
    {
        legend_catagory_id: 'asasdasdasd',
        instances: 5
    },
    {
        legend_catagory_id: 'asasd74asdasd',
        instances: 5
    },
    {
        legend_catagory_id: 'asasdasda4sd',
        instances: 5
    }, 
    {
        legend_catagory_id: 'as21asdasdasd',
        instances: 5
    }
]
//more efficient 
const fully_delete_catagories_ids = {
    asasdasdasd: 5,
    asasd74asdasd: 5,
    asdfsdf2sdf: 5,
    legend_catagory_id: 5
}
fully_delete_catagories_ids["asasdasda4sd"] // returns 5
*/
const legend = [
    {
        name: "Sleep",
        children: [{ name: "Nap", color: "#5F05B3" }],
        color: "#5F05B3",
        //legendcategory_id - firebase unique identifier generator or library
        //id can be used for checking if any changes have happened to the node and then it will overwrite those properties even though 
        //slice has the properties extracted independently
        //pie slice will have NO index saved
        //it is good to have pie slices have the unique identifer of the legend node used so that if the node is deleted with the 
        //identifier, you can still recreate it with the independent properties but you know that it has been deleted as a existing category
        //so you can choose to tell it to delete the slice
        //give the pie slice the unique identifier so that they can access the identifier in the legend to update itself if changes are made to the legend (ex. change color, name, or deleting itself)
        //example: delete category --> now you have two choices as user: delete all past instances or keep past instances related SO
        //first search if the identifier exists in the legend. if not, it will check if its identifier is in the list of fully deleted
        //nodes and if it is, it will delete itself (default is existence)
        //object has a counter that counts up every time it is used in as a slice and decounted every time it is deleted; when it hits 0, it will delete itself from the delete array
        //hash map
    },
    {
        name: "Work",
        children: [
            { name: "Job Search", color: "#09BC8A" /*id, instances*/},
            { name: "Programming", color: "#09BC8A" },
            { name: "Learning", color: "#09BC8A" },
        ],
        color: "#09BC8A",
        //id
        //instances
    },
    {
        name: "Transition",
        children: [
            { name: "Driving", color: "#3587A4" },
            { name: "Teeth", color: "#3587A4" },
            { name: "Cleaning", color: "#3587A4" },
        ],
        color: "#3587A4",
    },
    {
        name: "Meal",
        children: [
            { name: "Breakfast", color: "#F21B3F" },
            { name: "Lunch", color: "#F21B3F" },
            { name: "Dinner", color: "#F21B3F" },
            { name: "Snack", color: "#F21B3F" },
        ],
        color: "#F21B3F",
    },
    {
        name: "TV",
        children: [
            { name: "LoL", color: "#FF9914" },
            { name: "Show", color: "#FF9914" },
        ],
        color: "#FF9914",
    },
    { name: "Remaining", children: [], color: "white" }
]



const locations = ["Home", "Starbucks", "Dan"];


export { legend, locations };