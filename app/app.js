'use strict' //es para mejor programacion con estandares

window.addEventListener('load', () => {

    /* uRLS DE GOOGLEDOCS */
    //const srcWeb = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiWtjqEb8TbAnwHkLFHL2uLItKLnfZXSnF7MbAol5icgDe8YeGtU2T7zclZfMUBw/pubhtml?widget=true&amp;headers=false";
    
    
    const srcWeb = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8w4lNfZ7Qxt4qMNYegaKNGt2cD3m5RkSUw5T_5DdJ1dcjnki5V742jmQb-GNfNg/pubhtml?widget=true&amp;headers=false";
    
    const srcCel = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQj0NY_qnyQAMUouBHG913dOAINbf75JXR5S3Eeu3cN9IHujjENeO2WdrvUv60g0w/pubhtml?widget=true&amp;headers=false";

    //variable que es usada para determinar el UMBRAL de cambio de RESOLUCION 
    let screen = window.matchMedia("(max-width: 560px)")

    /*global var*/
    let targetScreen = 0;
    let contentFrame = document.querySelector("#tablegraphics"); 
    let alto1 = document.querySelector("#Iframe-Liason-Sheet"); 

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

            //return `<embed id='frame' name='frame' src='${srcWeb}' + "' width='100%' style='height:100%'></embed>`;
            

            return `<iframe  id='frame' name='frame' frameborder='0' style='overflow:hidden;height:100%;width:100%' height='100%' width='100%' src='${srcWeb}' allowfullscreen>Cargando...</iframe>`;
        }
        else {
            return `<iframe  id='frame' name='frame' src='${srcCel}' allowfullscreen>Cargando...</iframe>`;
        }
    }

    /*en base al alto de la tabla del iframe que cambia calculo */
    function adjustDinamicAltoFrame(){

        /*lo obtiene aca porque se agrego dinamicamente*/ 
        let largoFrame = document.querySelector("#frame"); 

        console.log(largoFrame.offsetHeight);
      
        //h/w as a %
        //alto1.style.maxHeight = (largoFrame.offsetHeight - 250) + "px";
        //contentFrame.style.paddingBottom = Math.round(((largoFrame.offsetHeight / largoFrame.offsetWidth) * 100)) + "%";
    }


    function iframeLoaded() {
        var iFrameID = document.getElementById('frame');
        if(iFrameID) {
              // here you can make the height, I delete it first, then I make it again
              iFrameID.height = "";
              iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + "px";
        }   
    }




    function garlopa(){

        if(targetScreen === 2){
            document.write(" <iframe  id='frame' name='frame' src='" + srcWeb + "' allowfullscreen>Cargando...</iframe>");


            //document.write(" <embed id='frame' name='frame' src='" + srcWeb + "' width='100%' style='height:100%'></embed>");

            //document.write(" <iframe  id='frame' name='frame'  frameborder='0' style='overflow:hidden;height:100%;width:100%' height='100%' width='100%' src='" + srcWeb + "' allowfullscreen>Cargando...</iframe>");
        }else{
            document.write(" <iframe  id='frame' name='frame' src='" + srcCel + "' allowfullscreen>Cargando...</iframe>");
        }
    }


 

    
    detectScreen(screen) // Call listener function at run time
    screen.addListener(detectScreen) // Attach listener function on state changes 

    //agrego el IFRAME que correspode dinamicamente a la vista
    contentFrame.innerHTML = dinamicSrcIframe();


    //adjustDinamicAltoFrame();

   
});