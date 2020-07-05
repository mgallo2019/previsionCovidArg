'use strict' //es para mejor programacion con estandares js

$(document).ready(function()
{
    console.log("Documento LISTO!");

    checkLocalStorage();

    scroll();

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
    //contentFrame.innerHTML = dinamicSrcIframe();


    //comienzo pruebas API
    GetDataDays();
   
});

function scroll(){

    $('#scroll').click(function(e){
      
      e.preventDefault();//para que se vaya a otra pagina sino que quede en la misma
  
       $('html, body').animate({
          scrollTop: 0
       }, 500);
  
       return false;
  
      });
  
  }

function getDataRest(inicio, fin, lote){

    //https://api.covid19tracking.narrativa.com/api/country/argentina?date_from=2020-03-20&date_to=2020-03-22
    //https://api.covid19tracking.narrativa.com/api/2020-06-22/country/argentina
    var rest = "https://api.covid19tracking.narrativa.com/api/country/argentina?date_from="+inicio+"&date_to="+fin;

    $.ajax({
        type: "GET",
        url: rest,

        beforeSend: function (response) {
            console.log("Enviando!");
        },//que haga algo antes que se envie
        
        success: function (response) {
            //guardo en localstorage
            console.log("TERMINO UN REQUEST:" + lote);
            saveDataLocalStorage(response.dates, lote);
            loadData(response.dates);
        },
        
        error: function (response) {
            console.log("OCURRIO UN ERROR");
            console.log("No se ha podido obtener la información");
            console.log(response);
        },
    });
}

function GetDataDays(){

    const loteDias = 5;//de a lotes de 5 dias funciono ok la api 
    const PrimerDia = "2020-03-20";

    var inicio = moment(PrimerDia).format('YYYY-MM-DD');//segun api es el inicio de los datos
    var fin = moment().format('YYYY-MM-DD');//dia actual   
    //calculo la cantidad de lotes a procesar  
    var cantLotes = Math.round(  
                                (
                                Math.abs(
                                        moment(inicio, 'YYYY-MM-DD').startOf('day').diff(moment(fin, 'YYYY-MM-DD').startOf('day'), 'days')
                                        ) 
                                    + 1
                                ) 
                                    / loteDias 
                                );
    

    if (!validaLocalStorage(cantLotes))
    {
        console.log("NO ESTA TODO EL DATASET EN MEMORIA");
        
        var iteraFin = moment(inicio, 'YYYY-MM-DD').add(loteDias, 'days').format('YYYY-MM-DD');

        for (var i = 1; i <= cantLotes; i++){
            console.log(inicio, iteraFin);
            getDataRest(inicio, iteraFin, i);
            inicio = moment(iteraFin).add(1, 'days').format('YYYY-MM-DD');//hay que quitar el ultimo dia inclusivo del between
            iteraFin = moment(iteraFin , 'YYYY-MM-DD').add(loteDias, 'days').format('YYYY-MM-DD');  
        }     
    }
    else{
        console.log("YA ESTA TODO EL DATASET EN MEMORIA");
        loadDataLocalStorage(cantLotes);
    }
}


//chequea si el localStorage es compatible
function checkLocalStorage(){

    //compatibilidad con navegador? local storage
   if (typeof(Storage) != 'undefined'){
       console.log("Disponible");
   }else{
       console.log("NO Disponible");
   }

 }

//clean storage
function limpiar(){
    //localStorage.removeItem("usuario");
    localStorage.clear();//borra todo!!!
}

 //chequea si la KEY existe!
function checkLocalStorageItems(valor){
  
    if (valor != null && valor != "undefined")
      return true;
    else
      return false;
  
}


function parseJsonTOString(jsonNative){ 
    var string = JSON.stringify(jsonNative);

    if(typeof(string) != 'string'){
        return null;
    }    
        return string;
}


//... tiene que existir todos los lotes! en local storage
function validaLocalStorage(cantLotes){
    for (var i = 1; i <= cantLotes; i++){
        
        let id = "JsonData"+i;
    
        let dataSet = localStorage.getItem(id);

        //si alguno no existe que ya salga
        if (!checkLocalStorageItems(dataSet)){
            //por las dudas que limpie
            limpiar();
            return false;
        }
    }
    return true;
}


/*Guarda la key en el local storage*/
function saveDataLocalStorage(objeto, lote){
    let id = "JsonData"+lote;
    let string = parseJsonTOString(objeto);
    localStorage.setItem(id,string);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadDataLocalStorage(cantLotes){
    console.log("QUIERO LEVANTAR DATOS");
    for (var i = 1; i <= cantLotes; i++){
        
        //recuperar objeto JSON
        //hay que RECONVERTIR! a jSON
        let id = "JsonData"+i;
        let dataSet = localStorage.getItem(id);

        if (checkLocalStorageItems(dataSet)){
        
            dataSet = JSON.parse(localStorage.getItem(id));             
            loadData(dataSet);
        }
        else{
            console.log("NO HAY DATOS PARA LEVANTAR DEL LOCAL STORAGE "+id);
        }
    }
}



function loadData(objeto){   

    $.each(objeto, function(fecha, elemento) {
        
        //la prevision sera cero para el primer dato
        var prevision = 0;

        //obtengo los datos del dia anterior
        prevision = calculatePrevisionLastDay(objeto, fecha);

        $.each(elemento.countries, function(index, elemento1) {
            
            // console.log(fecha, elemento1.today_new_confirmed, elemento1.today_confirmed,
            //     elemento1.today_new_deaths,elemento1.today_deaths,
            //     elemento1.today_new_recovered,elemento1.today_recovered);
            
            var localLocale = moment(fecha);
            moment.locale('es');
            localLocale.locale(false);
           
            if (elemento1.today_new_confirmed > prevision){
                var post = `
                    <tr>
                        <td>${localLocale.format('LL')}</td>
                        <td>${elemento1.today_new_confirmed}</td>
                        <td>${elemento1.today_confirmed}</td>
                        <td>${elemento1.today_confirmed/elemento1.yesterday_confirmed}</td>
                        <td style="background:rgb(182, 38, 38);">${prevision}</td>
                    </tr>
                `;
            }
            else{
                var post = `
                    <tr>
                        <td>${localLocale.format('LL')}</td>
                        <td>${elemento1.today_new_confirmed}</td>
                        <td>${elemento1.today_confirmed}</td>
                        <td>${elemento1.today_confirmed/elemento1.yesterday_confirmed}</td>
                        <td style="background:green;">${prevision}</td>
                    </tr>
                `;
            }
            $('#tablaCuerpo').append(post);
        });
    });
}


/*calcular la prevision*/ 
function calculatePrevisionLastDay(objeto, fechaHoy){
    
    var datosAyer = 0;

    $.each(objeto, function(fecha, elemento) {
    
        var hoy = moment(fecha).format('YYYY-MM-DD');
        var ayer = moment(fechaHoy).subtract(1, 'd').format('YYYY-MM-DD');
     
        if (hoy == ayer){
            $.each(elemento.countries, function(index, elemento1) {
                datosAyer = Math.round(elemento1.today_new_confirmed * (elemento1.today_confirmed/elemento1.yesterday_confirmed));

            });
        }
    });

    return datosAyer;
}