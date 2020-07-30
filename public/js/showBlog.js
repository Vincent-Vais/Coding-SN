const baseUrl = window.location.href
const verticalMenuEls = Array.from(document.querySelectorAll("#show-vertical-menu a"));
const commentText = document.querySelector("#comments");

commentText.addEventListener("click", clickButtonHandler);

verticalMenuEls.forEach(item => {
    item.addEventListener("click", handleVerticalClicks);
});

function handleVerticalClicks(e){
    const aTag = e.target.closest('a');
    e.preventDefault();
    const type = aTag.dataset["postTo"];
    const url = `${baseUrl}/${type}`;
    if(type==="comment"){
        console.log("comment");
        addComment();
    }else{
        sendData(url, type);
    }
}

async function sendData(url, type, data){
    try{
        const response = await fetch(url, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"type":type, "data":data}) 
          }
        );
    }catch(err){
        console.log("Error! ", err);
    }
}

function addComment(){
    const markup = `
    <div class="ui segment">
        <div class="show-comment">
            <textarea rows=10 cols=10 class="comment-default"></textarea>
        </div>
        <button><i class="ui check icon grn"></i></button>
    </div>
    `
    document.querySelector("#comments .segments").insertAdjacentHTML("beforeend", markup);
}

function clickButtonHandler(e){
    const btn = e.target.closest("button");
    const icon = e.target.closest("i");
    console.log(e.target);
    if(e.target === btn || e.target === icon){
        const text = document.querySelector("#comments textarea").value;
        const type = "comment";
        const url = `${baseUrl}/${type}`;
        sendData(url, type, text);
    }
    
}