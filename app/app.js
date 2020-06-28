'use strict' //es para mejor programacion con estandares

window.addEventListener('load', () => {

    /* uRLS DE GOOGLEDOCS */
    const srcWeb = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiWtjqEb8TbAnwHkLFHL2uLItKLnfZXSnF7MbAol5icgDe8YeGtU2T7zclZfMUBw/pubhtml?widget=true&amp;headers=false";
    const srcCel = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0NY_qnyQAMUouBHG913dOAINbf75JXR5S3Eeu3cN9IHujjENeO2WdrvUv60g0w/pubhtml?widget=true&amp;headers=false";

    //variable que es usada para determinar el UMBRAL de cambio de RESOLUCION 
    let screen = window.matchMedia("(max-width: 560px)")

    /*global var*/
    let targetScreen = 0;
    let contentFrame = document.querySelector("#tablegraphics"); 

      /* funcion para dejar un flag sobre que pantalla estoy trabajando, cambiara con el cambio ya que hay un listener */
    function detectScreen(x) {
        
        if (x.matches) { // If media query matches
            console.log("phone format");
            targetScreen = 1;
        } 
        else {
            console.log("web format");
            targetScreen = 2;
        }
    }

    /* Retorna el codigo HTML */
    function dinamicSrcIframe() {

        if(targetScreen === 2) {
            return `<iframe  id='frame' name='frame' src='${srcWeb}' allowfullscreen>Cargando...</iframe>`;
        }
        else {
            return `<iframe  id='frame' name='frame' src='${srcCel}' allowfullscreen>Cargando...</iframe>`;
        }
    }
    
    detectScreen(screen) // Call listener function at run time
    screen.addListener(detectScreen) // Attach listener function on state changes 

    //agrego el IFRAME que correspode dinamicamente a la vista
    contentFrame.innerHTML = dinamicSrcIframe();

});