'use strict' //es para mejor programacion con estandares js

$(document).ready(function()
{
    console.log("Documento LISTO!");

    //Declaracion de Variables GLobales especiales
    var lotesProcess = 0;//variable para sincronizacion de lotes y mostrado de elementos
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

    //comienzo API
    GetDataDays();


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


    function getDataRest(inicio, fin, lote, cantLotes){

        //https://api.covid19tracking.narrativa.com/api/country/argentina?date_from=2020-03-20&date_to=2020-03-22
        //https://api.covid19tracking.narrativa.com/api/2020-06-22/country/argentina
        var rest = "https://api.covid19tracking.narrativa.com/api/country/argentina?date_from="+inicio+"&date_to="+fin;
        var result;

        $.when(
            $.ajax({
                type: "GET",
                url: rest,

                beforeSend: function (response) {
                    console.log("Enviando!");
                },//que haga algo antes que se envie

                success: function (response) {
                    console.log("TERMINO UN REQUEST:" + lote);
                    result = response.dates;
                },

                error: function (response) {
                    console.log("OCURRIO UN ERROR");
                    console.log("No se ha podido obtener la información");
                    requestsError = true;
                    console.log(response);
                },
            })
        ).then(function() {      
            
            loadJsonData(result);
            
            lotesProcess = lotesProcess+1;

            //llegue al ultimo? muestro tabla
            if (lotesProcess == cantLotes){
                //todos los request fueron OK?
                if(!requestsError){
                    requestComplete();
                }
                else{
                    requestError();
                }    
            }
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


        var iteraFin = moment(inicio, 'YYYY-MM-DD').add(loteDias, 'days').format('YYYY-MM-DD');

        for (var i = 1; i <= cantLotes; i++){
            console.log(inicio, iteraFin);
            //llamo a la rest
            getDataRest(inicio, iteraFin, i, cantLotes);
            inicio = moment(iteraFin).add(1, 'days').format('YYYY-MM-DD');//hay que quitar el ultimo dia inclusivo del between
            iteraFin = moment(iteraFin , 'YYYY-MM-DD').add(loteDias, 'days').format('YYYY-MM-DD');
        }
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //se guardara los datos del request en un cache para luego tener los datos correlativos y ordenados
    function loadJsonData(objeto){

        $.each(objeto, function(fecha, elemento) {

            $.each(elemento.countries, function(index, elemento1) {
                //lleno array 
                cacheData.push(
                    {
                        dia: fecha,
                        infectadosNuevos: elemento1.today_new_confirmed,
                        infectadosAlDia: elemento1.today_confirmed,
                        infectadosAlDiaAyer: elemento1.yesterday_confirmed,
                        muertesNuevos:  elemento1.today_new_deaths,
                        muertesAlDia: elemento1.today_deaths,
                        recuperadosNuevos: elemento1.today_new_recovered,
                        recuperadosAlDia: elemento1.today_recovered
                    }
                );                
            });  
        });
    }

    function custom_sort(a, b) {
        return new Date(a.dia).getTime() - new Date(b.dia).getTime();
    }
    
    function prepareData(objeto){

        var ultimoDia;
        var previsionMañana = 0;

        objeto.forEach((item, index) => {

            //la prevision sera cero para el primer dato
            var prevision = calculatePrevisionLastDay(objeto, item.dia); //obtengo los datos del dia anterior
      
            //busco el ultimo dato
            ultimoDia = item.dia;
            previsionMañana = Math.round(item.infectadosNuevos * (item.infectadosAlDia/item.infectadosAlDiaAyer));

            var localLocale = moment(item.dia);
            moment.locale('es');
            localLocale.locale(false);
        
            if (item.infectadosNuevos > prevision){
                var post = `
                    <tr>
                        <td><span>${item.dia}</span>${localLocale.format('LL')}</td>
                        <td>${item.infectadosNuevos}</td>
                        <td>${item.infectadosAlDia}</td>
                        <td>${(item.infectadosAlDia/item.infectadosAlDiaAyer).toFixed(3)}</td>
                        <td style="background:rgb(182, 38, 38);color:white;">${prevision}</td>
                    </tr>
                `;
            }
            else{
                var post = `
                    <tr>
                        <td><span>${item.dia}</span>${localLocale.format('LL')}</td>
                        <td>${item.infectadosNuevos}</td>
                        <td>${item.infectadosAlDia}</td>
                        <td>${(item.infectadosAlDia/item.infectadosAlDiaAyer).toFixed(3)}</td>
                        <td style="background:green;color:white;">${prevision}</td>
                    </tr>
                `;
            }
            $('#tablaCuerpo').append(post);
        });

        //llegue al ultimo
        addFinalRow(moment(ultimoDia , 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD'),previsionMañana);
    }


    /*calcular la prevision*/
    function calculatePrevisionLastDay(objeto, fechaHoy){

        var datosAyer = 0;

        objeto.forEach((item, index) => {
            var hoy = moment(item.dia).format('YYYY-MM-DD');
            var ayer = moment(fechaHoy).subtract(1, 'd').format('YYYY-MM-DD');

            if (hoy == ayer){             
                datosAyer = Math.round(item.infectadosNuevos * (item.infectadosAlDia/item.infectadosAlDiaAyer));
            }
        });

        return datosAyer;
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

        //ordeno el lote de datos
        cacheData.sort(custom_sort);

        //carga datos tabla
        prepareData(cacheData);
        //prepara los graficos



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


});//FIN CODIGO MAIN

