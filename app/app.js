'use strict' //es para mejor programacion con estandares js

$(document).ready(function()
{
    console.log("Documento LISTO!");

    //Declaracion de Variables GLobales especiales
    let screen = window.matchMedia("(max-width: 560px)"); //variable que es usada para determinar el UMBRAL de cambio de RESOLUCION
    let targetScreen = 0;
    var cacheData = [];
    var requestsError = false;

    scroll();

    detectScreen(screen) // Call listener function at run time
    screen.addListener(detectScreen) // Attach listener function on state changes


    //este es para la 1ra vez...
    $( document ).ajaxStart(function() {
        $("#loading").show();
       
      });

    
    getDataRepoCSV();


    //////////////////////////////////////////////////////////////////FUNCTIONS SPACE//////////////////////////////////////////////////////////////////////////////////

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


    function scroll(){
        $('#scroll').click(function(e){

            e.preventDefault();//para que se vaya a otra pagina sino que quede en la misma

            $('html, body').animate({
                scrollTop: 0
            }, 500);
            return false;
        });
    }


    /*****************************************************************************/ 
    function getDataRepoCSV(){

        var csv = "repoData/listado.csv";
 
        $.ajax({
            type: "GET",
            url: csv,
            dataType: "text",

            beforeSend: function (response) {
                console.log("Enviando!");
            },//que haga algo antes que se envie

            success: function (response) {
                console.log("TERMINO UN REQUEST:");
                cacheData = $.csv.toObjects(response);//CSV to JSON
                requestComplete();
            },

            error: function (response) {
                console.log("OCURRIO UN ERROR");
                console.log("No se ha podido obtener la información");
                console.log(response);
                requestError();
            },
        });
    }



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    function prepareData(objeto){

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


    function requestComplete(){

        //carga datos tabla
        prepareData(cacheData);
        //prepara los graficos
        loadCanvas(cacheData);

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
        
        
        $("#tblDinamica").show();
        
    }

    function requestError(){

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


    function loadCanvas() {

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Top Oil Reserves"
            },
            axisY: {
                title: "Reserves(MMbbl)"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "MMbbl = one million barrels",
                dataPoints: [      
                    { y: 300878, label: "Venezuela" },
                    { y: 266455,  label: "Saudi" },
                    { y: 169709,  label: "Canada" },
                    { y: 158400,  label: "Iran" },
                    { y: 142503,  label: "Iraq" },
                    { y: 101500, label: "Kuwait" },
                    { y: 97800,  label: "UAE" },
                    { y: 80000,  label: "Russia" }
                ]
            }]
        });
        chart.render();
        
    }

});//FIN CODIGO MAIN

