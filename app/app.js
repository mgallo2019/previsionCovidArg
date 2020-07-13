'use strict' //es para mejor programacion con estandares js

$(document).ready(function()
{
    console.log("Documento LISTO!");

    //Declaracion de Variables GLobales especiales
    let screen = window.matchMedia("(max-width: 560px)"); //variable que es usada para determinar el UMBRAL de cambio de RESOLUCION
    let targetScreen = 0;
    var cacheData = [];
    var chart = [];//para poder redenrizar globalmente los graficos, porque inician en HIDE (ver ducumentacion)


    window.onscroll = function() {scrollFunction()};
    scroll();

    detectScreen(screen) // Call listener function at run time
    screen.addListener(detectScreen) // Attach listener function on state changes

    //muestro div con gif de carga
    $( document ).ajaxStart(function() {
        $("#loading").show();
    });


    getDataRepoCSV();

    //////////////////////////////////////////////////////////////////FUNCTIONS SPACE//////////////////////////////////////////////////////////////////////////////////

    /* funcion para dejar un flag sobre que pantalla estoy trabajando, cambiara con el cambio ya que hay un listener */
    function detectScreen(x){
        if (x.matches) { // If media query matches
            console.log("phone format");
            targetScreen = 1;
        }
        else {
            console.log("web format");
            targetScreen = 2;
        }
    }

    function scrollFunction(){

        var mybutton = $('#scroll');
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          mybutton.show();
        } else {
          mybutton.hide();
        }
    }
      
    function scroll(){
        $('#scroll').click(function(e){

            e.preventDefault();//para que se vaya a otra pagina sino que quede en la misma

            $('html, body').animate({
                scrollTop: 0
            }, 500);
            return false;
        });
    }

    function addFinalRow(fecha,prevision){

        var localLocale = moment(fecha);
        moment.locale('es');
        localLocale.locale(false);
     
        var post = `
            <tr>
                <td><span>${fecha}</span>${localLocale.format('LL')}</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td style="background:green;color:white;font-weight: bold;">${prevision}</td>
            </tr>
        `;
        
        $('#tablaCuerpo').append(post);
    }

    //////////////////////////////////////////////MANAGEMENT CSV///////////////////////////////////////////////////////////////
    function getDataRepoCSV(){

        var csv = "repoData/listado.csv";//ruta FTP
 
        $.ajax({
            type: "GET",
            url: csv,
            dataType: "text",

            beforeSend: function (response) {
                console.log("Enviando REQUEST!");
            },//que haga algo antes que se envie

            success: function (response) {
                console.log("TERMINO UN REQUEST:");
                launchProcess(response);  
            },

            error: function (response) {
                console.log("OCURRIO UN ERROR, No se ha podido obtener la información");
                console.log(response);
                requestErrorCSV();
            },
        });
    }
    
    function launchProcess(response){

        //emulo que tarda, porque el CSV lo hace rapido y asi muestra la animacion
        setTimeout( () => {
                            
            cacheData = $.csv.toObjects(response);//CSV to JSON
            requestCompleteCSV();

        } , 3000); 
    }
    
    function prepareDataCSV(objeto){

        var previsionMañana = 0;
        var datosDiaAnterior = null;
        var prevision = 0;
        var factor = 0;

        objeto.forEach((item, index) => {

            //la prevision sera cero para el primer dato
            if (datosDiaAnterior != null){
                prevision = Math.round(datosDiaAnterior.CasosNuevos * factor);
            }
            else{
                datosDiaAnterior = item; //correra una sola ves para tener el dato la primera corrida
            }

            factor = (item.CasosAcumulado/datosDiaAnterior.CasosAcumulado);

            var localLocale = moment(item.Fecha);
            moment.locale('es');
            localLocale.locale(false);
        

            if (item.CasosNuevos > prevision){
                var post = `
                    <tr>
                        <td><span>${item.Fecha}</span>${localLocale.format('LL')}</td>
                        <td>${item.CasosNuevos}</td>
                        <td>${item.CasosAcumulado}</td>
                        <td>${factor.toFixed(3)}</td>
                        <td style="background:rgb(182, 38, 38);color:white;">${prevision}</td>
                    </tr>
                `;
            }
            else{
                var post = `
                    <tr>
                        <td><span>${item.Fecha}</span>${localLocale.format('LL')}</td>
                        <td>${item.CasosNuevos}</td>
                        <td>${item.CasosAcumulado}</td>
                        <td>${factor.toFixed(3)}</td>
                        <td style="background:green;color:white;">${prevision}</td>
                    </tr>
                `;
            }
            $('#tablaCuerpo').append(post);


            //guardo el dato del dia actual que sera ayer en la proxima corrida
            datosDiaAnterior = item;
        
            //busco el ultimo dato usando los datos de hoy y los de ayer
            previsionMañana = Math.round(item.CasosNuevos * factor);
        });


        //llegue al ultimo
        addFinalRow(moment(datosDiaAnterior.Fecha , 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD'),previsionMañana);
    }

    function requestCompleteCSV(){

        //carga datos tabla
        prepareDataCSV(cacheData);
      
        //escondo el msge de carga
        $("#loading").hide();
        
         //tiene que llamarse luego de llenada la tabla
        $('#tablaProb').DataTable(
            {
                responsive: true,
                "language": {
                    "sProcessing":     "Procesando...",
                    "sLengthMenu":     "Mostrar _MENU_ registros",
                    "sZeroRecords":    "No se encontraron resultados",
                    "sEmptyTable":     "Ningún dato disponible en esta tabla",
                    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix":    "",
                    "sSearch":         "Buscar:",
                    "sUrl":            "",
                    "sInfoThousands":  ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst":    "Primero",
                        "sLast":     "Último",
                        "sNext":     "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    },
                    "buttons": {
                        "copy": "Copiar",
                        "colvis": "Visibilidad"
                    }

                },

                "pagingType": "full_numbers",
                "pageLength": 50
            }
        ).page('last').draw('page');;//uso de plugin apuntando a la ultima pagina!
        
        
        $("#tblDinamica").slideUp(300).fadeIn(400); //.show() alternative

        //prepara los graficos
        chartInfAlDia(cacheData);
        chartInfxDia(cacheData);

    
        $("#chartInfAlDia").show();
        $("#chartInfxDia").show();
       
        chart[1].render(); 
        chart[0].render();  //si el GRAFICO inicia hide, hay que redendirar ANTES! sino luego hay que renderizar con un loop 
         
        
    }

    function requestErrorCSV(){

        //escondo el msge de carga
        $("#loading").hide();

        var post = `
            <div id="errorMsge">
            <p><img src="img/error.png" width="5%" height="5%"/></p>
            <p style="color:red;">OCURRIO UN ERROR AL CONSULTAR DATOS, INTENTE NUEVAMENTE MAS TARDE</p>
            </div>
        `;

        $("#lastP").append(post);
    }

    ///////////////////////////////////////////////GRAFICOS///////////////////////////////////////////////////////////////////
    function chartInfxDia(objeto) {

        var datos = chartInfxDiacreateJsonGraphics(objeto);

        CanvasJS.addColorSet("rojo",["#c4391c"]);

        chart[0] = new CanvasJS.Chart("chartInfxDia", {
            animationEnabled: true,
            colorSet: "rojo",
            title:{
                text: "Total de Infectados x día en ARGENTINA"
            },
            axisY: {
                title: "Infectados Por Día",
                gridThickness: 1,
                gridColor: "#e0e0e0"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "Día",
                dataPoints: datos
            }]
        });
        chart[0].render();  //si el GRAFICO inicia hide, hay que redendirar ANTES! o LUEGO
    }

    function chartInfAlDia(objeto) {

        var datos = chartInfAlDiacreateJsonGraphics(objeto);

        CanvasJS.addColorSet("azul",["#2d3dd4"]);

        chart[1] = new CanvasJS.Chart("chartInfAlDia", {
            animationEnabled: true,
            colorSet: "azul",
            title:{
                text: "Total de Infectados al día en ARGENTINA"
            },
            axisY: {
                title: "Total al Día",
                gridThickness: 1,
                gridColor: "#e0e0e0"
            },
            data: [{        
                type: "line",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "Día",
                dataPoints: datos
            }]
        });
        chart[1].render();  
    }

    function chartInfxDiacreateJsonGraphics (objeto){

        var datos = [];

        objeto.forEach((item, index) => {

            datos.push(
                {
                    y: parseInt(item.CasosNuevos), //tener en cuenta que deben ser NROs no string
                    label: item.Fecha,
                }
            );      
        });

        return datos;
    }

    function chartInfAlDiacreateJsonGraphics (objeto){

        var datos = [];

        objeto.forEach((item, index) => {

            datos.push(
                {
                    y: parseInt(item.CasosAcumulado), //tener en cuenta que deben ser NROs no string
                    label: item.Fecha,
                }
            );      
        });

        return datos;
    }

});//FIN CODIGO MAIN

