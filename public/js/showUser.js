const initialSettings = {
        widthThreshold: 765,
        defaultTabSelector: "#Bio"
}

// CLASSES
class DynamicUI{
    constructor(source, fill){
        this._source= source;
        this._fill = fill;
        this._children = undefined;
    }
    addSourceToHtml(){
        if(this.source){
            let source = this._source.innerHTML;
            const template = Handlebars.compile(source);
            const compiledHtml = template();
            this._fill.innerHTML = compiledHtml;
        }
    }
    addChild(child){
        if(!this._children){
            this._children = [];
        }
        this._children.push(child);
    }
    removeHtml(){
        if(this._fill && this._fill.children){ 
            let child = this._fill.lastElementChild;  
            while (child) { 
                this._fill.removeChild(child); 
                child = this._fill.lastElementChild; 
            }
        }
    }
    get children(){
        if(this._children){
            return this._children;
        }
    }
    get source(){
        return this._source;
    }
    set source(element){
        this._source = element;
    }
    set fill(element){
        this._fill = element;
    }
    get fill(){
        return this._fill;
    }
}

class Menu extends DynamicUI{
    constructor(source, fill, active){
        super(source, fill);
        this._active = active;
        this._menuTab = document.querySelector(`#${this._source.id.split('-')[1]}`);
    }
    get active(){
        return this._active;
    }
    set active(bool){
        this._active = bool;
    }
    get menuTab(){
        return this._menuTab;
    }
    activate(){
        this.active = true;
        this._menuTab.classList.add("active");
        this.addSourceToHtml();
    }
    deactivate(){
        if(this._active){
            this.active = false;
            this._menuTab.classList.remove("active");
            this.removeHtml();
        }
    }

}

class Version extends DynamicUI{
    constructor(source, fill, type, selector){
        super(source, fill);
        this._currentTab = undefined;
        this.addSourceToHtml();
        this._type = type;
        this.setUp(selector);
    }
    get type(){
        return this._type;
    }
    get currentTab(){
        return this._currentTab;
    }
    set currentTab(tab){
        if(this._currentTab){
            this._currentTab.deactivate();
        }
        this._currentTab = tab;
        this._currentTab.activate();
    }
    setUp(selector){
        this._fill.querySelectorAll("a").forEach(element => {
            let source = document.querySelector(`#${this.type}-${element.id}`);
            let fill = document.querySelector('#parent');
            let newMenu = new Menu(source,fill, false);
            this.addChild(newMenu);
            if(document.getElementById(element.id) === document.querySelector(selector)){
                this.currentTab = newMenu;
            }
        });
    }
}

// DESKTOP
const handlers = (function(){
    // ############## DOM STRINGS ##############
    const DOM = {
        imagebig : "#big-Image img",
        imagesmall: "#small-Image img",
        filePickerbig : "#bigImgInput",
        filePickersmall : "#smallImgInput",
        btnSubmitSmlPic: ".icon-container button"
    }
    // ############## LINKS HANDLER ##############
    const createFieldHTML = function(option){
        let parent = document.querySelector("#anchor");
        const html = `<div id="${option.value}" class="field">
                    <label>${option.text}</label>
                    <input name="${option.value}" type="text" placeholder="URL">
                </div>`
        parent.insertAdjacentHTML('beforeend', html);
    }
    const gatherElements = function(element){
        let addIcon = element.fill.querySelector(".circle");
        let selectBar = element.fill.querySelector(".dropdown")
        let options = element.fill.querySelectorAll(".dropdown option");
        let divButton = element.fill.querySelector("#form-button");
        return [addIcon, selectBar, options, divButton];
    }
    const checkIfUninque = function(option){
        let parent = document.querySelector("#anchor");
        if(parent.children.length){
            for (let child of parent.children){
                if(child.id === option.value){
                    return false
                }
            }
        }
        return true;
    }
    const createIcon = function(element){
        let div = document.createElement("div");
        div.classList.add("div-removeIcon");
        let icon = document.createElement("i");
        icon.classList.add("trash","alternate","icon","rd");
        icon.addEventListener("click", () => {
            document.querySelector("#anchor").removeChild(element);
        });
        div.appendChild(icon);
        element.appendChild(div);
    }
    const handleNewLink = function(element){
        const [addIcon, selectBar, options, divButton] = gatherElements(element);
        addIcon.addEventListener("click", (e) => {
            if(divButton.classList[0] === "hidden") divButton.classList.remove("hidden");
            let idx = selectBar.options.selectedIndex
            let selectedOption = options[idx];
            if(checkIfUninque(selectedOption)){
                createFieldHTML(selectedOption);
                createIcon(document.querySelector(`#${selectedOption.value}`));
            }
        });
    }
    const linksHandler = function(element){
        element.menuTab.addEventListener("click", () => {
            setTimeout(handleNewLink.bind(null, element), 0)
        })
    }
    // ############################

    // ############## PICTURE HANDLER ##############
    const pictureHandler = function(size){
        let inputElement = document.querySelector(DOM["filePicker"+size]);
        let img = document.querySelector(DOM["image"+size]);
        let btn = document.querySelector(DOM.btnSubmitSmlPic);
        console.log(img);
        let reader = new FileReader();
        inputElement.addEventListener("change", (e) => {
            let file = inputElement.files[0];
            reader.onload = function() {
                img.src = reader.result;
                if(size === "small") btn.classList.remove("hidden");
            }
            reader.readAsDataURL(file);
        }, false);   
    }
    // ############################
    return {
        mainHandler: function(version, size){
            version.children.forEach(child => {
                if(child.menuTab.id === "Links"){
                    linksHandler(child);
                }
                child.menuTab.addEventListener("click", function(e){
                    let foundChild = version.children.find(child => {
                        return e.target.id === child.menuTab.id;
                    });
                    version.currentTab = foundChild;
                });
            });
            pictureHandler(size);
        }
    }
})();

function init(settings, handlers){
    let source, fill, version, size;
    if(window.innerWidth > settings.widthThreshold){
        document.querySelector("#big-Image").style.display = "flex";
        source = document.querySelector("#big-Menu");
        fill = document.querySelector("#dynamic-menu");
        size = "big";
    }else{
        source = document.querySelector("#small-Menu");
        fill = document.querySelector("#dynamic-menu");
        size = "small";
        settings.defaultTabSelector = "#Picture";
    }
    version = new Version(source, fill, size, settings.defaultTabSelector);
    handlers.mainHandler(version, size);
}

init(initialSettings, handlers);