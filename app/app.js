/* uRLS DE GOOGLEDOCS */
const srcWeb = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiWtjqEb8TbAnwHkLFHL2uLItKLnfZXSnF7MbAol5icgDe8YeGtU2T7zclZfMUBw/pubhtml?widget=true&amp;headers=false";
const srcCel = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0NY_qnyQAMUouBHG913dOAINbf75JXR5S3Eeu3cN9IHujjENeO2WdrvUv60g0w/pubhtml?widget=true&amp;headers=false";

let screen = window.matchMedia("(max-width: 560px)")
/*global var*/
let targetScreen

function myFunction(x) {
    if (x.matches) { // If media query matches
        console.log("phone format");
        targetScreen = 1;
    } else {
        console.log("web format");
        targetScreen = 2;

    }
  }

function dinamicSrcIframe(){

    if(targetScreen === 2){
        document.write(" <iframe  id='frame' name='frame' src='" + srcWeb + "' allowfullscreen>Cargando...</iframe>");
    }else{
        document.write(" <iframe  id='frame' name='frame' src='" + srcCel + "' allowfullscreen>Cargando...</iframe>");
    }
}

myFunction(screen) // Call listener function at run time
screen.addListener(myFunction) // Attach listener function on state changes 