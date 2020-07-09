'use strict' //es para mejor programacion con estandares js

$(document).ready(function()
{
    console.log("Documento LISTO!");

    //Declaracion de Variables GLobales especiales
    var lotesProcess = 0;//variable para sincronizacion de lotes y mostrado de elementos
    let screen = window.matchMedia("(max-width: 560px)"); //variable que es usada para determinar el UMBRAL de cambio de RESOLUCION
    let targetScreen = 0;

    scroll();

    detectScreen(screen) // Call listener function at run time
    screen.addListener(detectScreen) // Attach listener function on state changes


    //este es para la 1ra vez...
    $( document ).ajaxStart(function() {
        $("#loading").show();
        console.log("garlopa chota");
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

                complete: function () {
                    $("#loading").hide();
                    console.log("Complete!");
                },

                success: function (response) {
                    console.log("TERMINO UN REQUEST:" + lote);
                    result = response.dates;
                },

                error: function (response) {
                    console.log("OCURRIO UN ERROR");
                    console.log("No se ha podido obtener la información");
                    console.log(response);
                },
            })
        ).then(function() {
            loadData(result);
            lotesProcess = lotesProcess+1;

            //llegue al ultimo? muestro tabla
            if (lotesProcess == cantLotes){
                 //tiene que llamarse luego de llenada la tabla
                $('#tablaProb').DataTable(
                    {
                        responsive: true,
                        "language": {
                            "lengthMenu": "Mostrando _MENU_ Registros Por Página",
                            "zeroRecords": "No hay registros",
                            "info": "Mostrando página _PAGE_ de _PAGES_",
                            "infoEmpty": "No registros disponibles",
                            "infoFiltered": "(filtrado desde _MAX_ total de registros)",
                        },
                        "pagingType": "full_numbers",
                        "pageLength": 50
                    }
                );//uso de plugin
                $("#tblDinamica").show();
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



        console.log("NO ESTA TODO EL DATASET EN MEMORIA");

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














});

