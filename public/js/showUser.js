// Open with initial settings
// Change content depending on screen width and key pressed
// Add some element if necessary
// const dataUI = {
//     screenWidth: window.innerWidth,
//     widthThreshold: 765,
//     sizes: ["big", "small"],
//     bigTabs: ["Bio", "Links", "Settings"],
//     smallTabs: ["MyPicture", "Bio", "Links", "Settings"],
//     DOM:{
//         big: {
//             bio: "#dynamic-menu a:first-child",
//             links: "#dynamic-menu a:nth-child(2)",
//             settings: "#dynamic-menu a:last-child"
//         },
//         small:{

//         }
//     }
// }

// class currentUI{
//     constructor(width, curTab, elems){
//         this._curWidth = this.width;
//         this._curTab = curTab;
//         this._elems = elems;
//     }

//     // Setters and getters
//     set curWidth(width){
//         this._curWidth = width;
//     }
//     get curWidth(){
//         return this._curWidth
//     }

//     set curTab(tab){
//         this._curTab = tab;
//     }
//     get curTab(){
//         return this._curTab
//     }
// }

class controllerUI{
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
    getMenuTabs(num){
        let elems, nodeList;
        elems = {}
        nodeList = document.querySelectorAll("#dynamic-menu a");
        for(let i = 0; i < nodeList.length; i++){
            elems[nodeList[i].id] = nodeList[i]
        }
        return elems
    }
}

    // 1. Initialize currentUI with dataUI
    // init(){
        // 1. Set width and current tab in currentUI
        // 2. Set event Listeners
    // }
    // 2. Change currentUI accorging to event Listeners
// }
// GLOBAL VARIABLES
const widthOutput = window.innerWidth;
const widthThreshold = 765;
let currentSize = "big";
let currentTab = "Bio";
let bigTabs = ["Bio", "Links", "Settings"];
let smallTabs = ["MyPicture", "Bio", "Links", "Settings"];

// MAPPERS
const info = {
    big: {
        Bio: createBigBio,
        Links: createBigLinks,
        Settings: createBigSettings
    },
    small: {
        MyPicture: createSmallPicture,
        Bio: createSmallBio,
        Links: createSmallLinks,
        Settings: createBigSettings
    } 
}

const eventHandlers = {
    big: {
        Bio: "noHandlersNeeded",
        Links: createBigLinksEventHandlers,
        Settings: "noHandlersNeeded"
    },
    small: {
        MyPicture: createMyPictureEventHandlers,
        Bio: "noHandlersNeeded",
        Links: createSmallLinksEventHandlers,
        Settings: "noHandlersNeeded"
    } 
}

// GENERAL USE
const imageDiv = document.querySelector(".img-container");
const form = imageDiv.querySelector("form");
form.style.display = "none";

imageDiv.addEventListener("mouseover", (e) => {
    form.style.display = "block";
});

imageDiv.addEventListener("mouseout", (e) => {
    form.style.display = "none";
});

let inputElement = document.querySelector(".inputfile");
let img = document.querySelector(".img-container img");
let reader = new FileReader();
inputElement.addEventListener("change", (e) => {
    let file = inputElement.files[0];
    reader.onload = function() {
        img.src = reader.result;
    }
    reader.readAsDataURL(file);
}, false);   

const removeChildren = parent => {
    if(parent.children){ 
        let child = parent.lastElementChild;  
        while (child) { 
            parent.removeChild(child); 
            child = parent.lastElementChild; 
        }
    }
}

// ############### CHANGING MENUS ###############
// generating MENU depending on screen size
async function changeMenus(currentSize) { 
    if(widthOutput>widthThreshold){
        const source = document.getElementById('bigMenu').innerHTML;
        renderDynamicMenu(source);
        return currentSize;
    }else{
        const source = document.getElementById('smallMenu').innerHTML;
        renderDynamicMenu(source);
        imageDiv.style.display = "none";
        currentSize = "small";
        return currentSize;
    }
};

function renderDynamicMenu(source){
    const template = Handlebars.compile(source);

    const compiledHtml = template();

    const fill = document.getElementById('dynamic-menu');

    fill.innerHTML = compiledHtml;
}

// DIFFERENT ELEMENTS FOR DIFERENT SIZES
changeMenus(currentSize).then(currentSize => {
    if(currentSize === "big"){
        let elems = getBigDOMElements();
        let currentElement = elems.bio;
        let currentElementText = currentElement.text.trim();
        info[currentSize][currentElementText](); // showing current active tab
        if(typeof eventHandlers[currentSize][currentElementText] !== "string"){
            eventHandlers[currentSize][currentElementText]();
        }
        for (const e in elems) { // adding event listeners
            elems[e].addEventListener("click", (e) => {
                currentElement.classList.remove("active");
                currentElement = e.target;
                currentElement.classList.add("active");
                currentElementText = currentElement.text.trim();
                info[currentSize][currentElementText](); // changing content
                eventHandlers[currentSize][currentElementText](); // creating event handlers for elements inside the tab
            })
        }
    }
    else{
        let elems = getSmallDOMElements();
        let currentElement = elems.picture;
        let currentElementText = currentElement.text.trim();
        info[currentSize][currentElementText](); // showing current active tab
        eventHandlers[currentSize][currentElementText]();
        for (const e in elems) { // adding event listeners
            elems[e].addEventListener("click", (e) => {
                currentElement.classList.remove("active");
                currentElement = e.target;
                currentElement.classList.add("active");
                currentElementText = currentElement.text.trim();
                console.log(currentElementText);
                info[currentSize][currentElementText](); // changing content
                eventHandlers[currentSize][currentElementText](); // creating event handlers for elements inside the tab
            })
          }
    }
});

// ############### BIG ELEMENTS ###############
function getBigDOMElements(){
    let elems = {
        bio: document.querySelector("#dynamic-menu a:first-child"),
        links: document.querySelector("#dynamic-menu a:nth-child(2)"),
        settings: document.querySelector("#dynamic-menu a:last-child"),
    };
    return elems;
}

// generating HTML and CONTENT in MENU for bigger screen
function createBigBio(){
    let parent = document.querySelector("#parent");
    removeChildren(parent);

    const source = document.getElementById("bigBio").innerHTML;

    const template = Handlebars.compile(source);

    const compiledHtml = template();

    parent.innerHTML = compiledHtml;
    
};

function createBigLinks(){
    let parent = document.querySelector("#parent");
    removeChildren(parent);
    
    const source = document.getElementById("bigLinks").innerHTML;

    const template = Handlebars.compile(source);

    const compiledHtml = template();

    parent.innerHTML = compiledHtml;

};

function createBigSettings(){
    let parent = document.querySelector("#parent");
    removeChildren(parent);
    
    const source = document.getElementById("bigSettings").innerHTML;

    const template = Handlebars.compile(source);

    const compiledHtml = template();

    parent.innerHTML = compiledHtml;
}

// EVENT HANDLER FOR LINKS (BIG SCREEN)
function createBigLinksEventHandlers(){
    let addIcon = document.querySelector(".circle");
    let selectBar = document.querySelector(".dropdown")
    let options = document.querySelectorAll(".dropdown option");
    let divButton = document.querySelector("#form-button");
    addIcon.addEventListener("click", (e) => {
        if(divButton.classList[0] === "hidden") divButton.classList.remove("hidden");
        let idx = selectBar.options.selectedIndex
        let selectedOption = options[idx];
        let element = createInputForSelOption(selectedOption);
        addRemoveIcon(element);
    });
}

function createInputForSelOption(option){
    let parent = document.querySelector("#anchor");
    if(!document.querySelector(`input[name=${option.value}]`)){
        let div = document.createElement("div");
        div.classList.add("field");
        div.setAttribute("id", `${option.value}`);
        let label = document.createElement("label");
        let text = document.createTextNode(option.text);
        label.appendChild(text);
        let input = document.createElement("input");
        input.setAttribute("name", `${option.value}`);
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "URL");
        div.appendChild(label);
        div.appendChild(input);
        parent.appendChild(div);
        return div;
    }
}

function addRemoveIcon(element){
    let div = document.createElement("div");
    div.style.display = "inline";
    div.style.position = "absolute";
    div.style.left = "53vw";
    div.style.marginTop = "1vh";
    let icon = document.createElement("i");
    icon.classList.add("trash");
    icon.classList.add("alternate");
    icon.classList.add("icon");
    icon.classList.add("bad");
    icon.addEventListener("click", () => {
        document.querySelector("#anchor").removeChild(element);
    });
    div.appendChild(icon);
    element.appendChild(div);
}

// ############### SMALL ELEMENTS ###############
function getSmallDOMElements(){
    let elems = {
        picture: document.querySelector("#dynamic-menu a:first-child"),
        bio: document.querySelector("#dynamic-menu a:nth-child(2)"),
        links: document.querySelector("#dynamic-menu a:nth-child(3)"),
        settings: document.querySelector("#dynamic-menu a:last-child"),
    };
    return elems;
}
// generating HTML and CONTENT for smaller screen
function createSmallPicture(){
    let parent = document.querySelector("#parent");
    removeChildren(parent);

    const source = document.getElementById("smallPicture").innerHTML;

    const template = Handlebars.compile(source);

    const compiledHtml = template();

    parent.innerHTML = compiledHtml;
}

function createSmallBio(){
    let parent = document.querySelector("#parent");
    removeChildren(parent);

    const source = document.getElementById("smallBio").innerHTML;

    const template = Handlebars.compile(source);

    const compiledHtml = template();

    parent.innerHTML = compiledHtml;
}

function createSmallLinks(){
    let parent = document.querySelector("#parent");
    removeChildren(parent);

    const source = document.getElementById("smallLinks").innerHTML;

    const template = Handlebars.compile(source);

    const compiledHtml = template();

    parent.innerHTML = compiledHtml;
}

function createSmallSettings(){
    let parent = document.querySelector("#parent");
    removeChildren(parent);

    const source = document.getElementById("smallSettings").innerHTML;

    const template = Handlebars.compile(source);

    const compiledHtml = template();

    parent.innerHTML = compiledHtml;
}

function createMyPictureEventHandlers(){
    let inputElement = document.querySelector(".inputfile");
    let img = document.querySelector(".picture-container img");
    let reader = new FileReader();
    inputElement.addEventListener("change", (e) => {
        let file = inputElement.files[0];
        reader.onload = function() {
            img.src = reader.result;
        }
        reader.readAsDataURL(file);
    }, false);   
}

function createSmallLinksEventHandlers(){
    let addIcon = document.querySelector(".circle");
    let selectBar = document.querySelector(".dropdown")
    let options = document.querySelectorAll(".dropdown option");
    let divButton = document.querySelector("#form-button");
    addIcon.addEventListener("click", (e) => {
        if(divButton.classList[0] === "hidden") divButton.classList.remove("hidden");
        let idx = selectBar.options.selectedIndex
        let selectedOption = options[idx];
        let element = createInputForSelOption(selectedOption);
        addSmallRemoveIcon(element);
    });
}

function addSmallRemoveIcon(element){
    let div = document.createElement("div");
    div.style.display = "inline";
    div.style.position = "absolute";
    div.style.left = "67.5vw";
    div.style.marginTop = "1vh";
    let icon = document.createElement("i");
    icon.classList.add("trash");
    icon.classList.add("alternate");
    icon.classList.add("icon");
    icon.classList.add("bad");
    icon.addEventListener("click", () => {
        document.querySelector("#anchor").removeChild(element);
    });
    div.appendChild(icon);
    element.appendChild(div);
}





