const widthOutput = window.innerWidth;
const widthThreshold = 765;
let currentSize = "big";
let currentTab = "Bio";
let bigTabs = ["Bio", "Links", "Settings"];
let smallTabs = ["MyPicture", "Bio", "Links", "Settings"];

const data = {name: document.getElementById("name").innerText};


const image = document.querySelector(".img-container");


const removeChildren = parent => {
    if(parent.children){ 
        let child = parent.lastElementChild;  
        while (child) { 
            parent.removeChild(child); 
            child = parent.lastElementChild; 
        }
    }
    console.log(parent.children);
}

const createBigBio = () => {
    let parent = document.querySelector("#parent");
    removeChildren(parent);

    const source = document.getElementById("bigBio").innerHTML;

    const template = Handlebars.compile(source);

    const compiledHtml = template(data);

    parent.innerHTML = compiledHtml;
    
};


const createBigLinks = () => {
    let parent = document.querySelector("#parent");
    removeChildren(parent);
    
    const source = document.getElementById("bigLinks").innerHTML;

    const template = Handlebars.compile(source);

    const compiledHtml = template(data);

    parent.innerHTML = compiledHtml;

};

// creating imput fields to add links in form

const createBigSettings = () => {
    let parent = document.querySelector("#parent");
    removeChildren(parent);

    let a = document.getElementById("test");
    console.log(a.innerText);
}

// mapper to functions
const info = {
    big: {
        Bio: createBigBio,
        Links: createBigLinks,
        Settings: createBigSettings
    },
    small: {
        MyPicture: {},
        Bio: {},
        Links: {},
        Settings: {}
    } 
}

const eventHandlers = {
    big: {
        Bio: "createBigBio",
        Links: createBigLinksEventHandlers,
        Settings: "createBigSettings"
    },
    small: {
        MyPicture: {},
        Bio: {},
        Links: {},
        Settings: {}
    } 
}

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
        // addRemoveFunctionality(element);
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
        input.setAttribute("type", "text");
        input.setAttribute("name", `${option.value}`);
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

// changing between two types of menu
const renderDynamicMenu = (source) => {
    const template = Handlebars.compile(source);

    const context = {
    greeting: 'Hello World!',
    opinion: false,
    languages: [
        {name: "HTML"},
        {name: "CSS"},
        {name: "JavaScript"}
        ]
    };

    const compiledHtml = template(context);

    const fill = document.getElementById('dynamic-menu');

    fill.innerHTML = compiledHtml;
}

async function changeMenus(currentSize) { 
    if(widthOutput>widthThreshold){
        const source = document.getElementById('bigMenu').innerHTML;
        renderDynamicMenu(source);
        return currentSize;
    }else{
        const source = document.getElementById('smallMenu').innerHTML;
        renderDynamicMenu(source);
        image.style.display = "none";
        currentSize = "small";
        return currentSize;
    }
};

changeMenus(currentSize).then(currentSize => {
    if(currentSize === "big"){
        let elems = getBigDOMElements();
        let currentElement = elems.bio;
        let currentElementText = currentElement.text.trim();
        info[currentSize][currentElementText]();
        for (const e in elems) {
            elems[e].addEventListener("click", (e) => {
                currentElement.classList.remove("active");
                currentElement = e.target;
                currentElement.classList.add("active");
                currentElementText = currentElement.text.trim();
                info[currentSize][currentElementText](); // changing content
                eventHandlers[currentSize][currentElementText](); // creating event handlers
            })
          }
    }
    else{
        alert("OTHER STATE");
    }
});

const getBigDOMElements = () => {
    let elems = {
        bio: document.querySelector("#dynamic-menu a:first-child"),
        links: document.querySelector("#dynamic-menu a:nth-child(2)"),
        settings: document.querySelector("#dynamic-menu a:last-child"),
    };
    return elems;
}





