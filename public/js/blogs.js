$('.ui.dropdown')
  .dropdown();

$(".image-container img").mouseover(function(e){
  if(this === e.target){
    $( ".box .aside-container" ).animate({
      "flex-basis": "100%"
    }, 1000, function(){
      $(".content-container").css("display","flex");
    });
  }
});

const element = document.querySelector(".content-item");

const box = (function(elm){
  const elems = [];
  function makeTree(node){
    elems.push(node);
    if(node.children){
      let arr = Array.from(node.children);
      for (let child of arr){
        makeTree(child);
      }
    }
  }
  makeTree(elm);
  return elems;
})(element);

for (let item of box){
  item.addEventListener("mouseout", outHandler);
}

function outHandler(e){
  let elementMouseIsOver = document.elementFromPoint(event.clientX, event.clientY);
  // console.log(elementMouseIsOver);
  let inside = box.findIndex(item => item === elementMouseIsOver);
  // console.log(inside);
  if(inside === -1){
    $(".content-container").css("display","none");
    $( ".box .aside-container" ).animate({
      "flex-basis": "10%"}, 1000);
  }
}