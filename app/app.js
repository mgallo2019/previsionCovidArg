'use strict' //es para mejor programacion con estandares js

$(document).ready(function()
{
    console.log("Documento LISTO!");

    //Declaracion de Variables GLobales especiales
    var cacheData = [];
    var chart = [];//para poder redenrizar globalmente los graficos, porque inician en HIDE (ver ducumentacion)
    var table = null;

    window.onscroll = function() {scrollFunction()};
    scroll();

    //muestro div con gif de carga
    $( document ).ajaxStart(function() {
        $("#loading").show();
    });


    getData();
    
    //////////////////////////////////////////////////////////////////FUNCTIONS SPACE//////////////////////////////////////////////////////////////////////////////////
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
                <td class='details-control'></td>     
                <td><span>${fecha}</span>${localLocale.format('LL')}</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td style="background:green;color:white;font-weight: bold;">${prevision}</td>          
            </tr>
        `;
        
        $('#tablaCuerpo').append(post);
    }

    function getData(){
        
        const PrimerDia = "2020-07-13";//ya que lo anterior esta localmente

        var inicio = moment(PrimerDia).format('YYYY-MM-DD');//segun api es el inicio de los datos
        var fin = moment().format('YYYY-MM-DD');//dia actual
 
        //llamo a la rest
        getDataRest(inicio, fin);
        
    }

    //devuelve los datos locales con integridad de los mismos validados hasta el 12/07
    function getJSONDataDB(){

        /* se harcodea datos validos hasta la fecha por integridad insufieciente de las apirest publicas */
        var data = [
            {
              "Fecha": "2020-03-03",
              "CasosNuevos": "1",
              "CasosAcumulado": "1",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "0",
              "RecuperadosNuevos": "0",
              "RecuperadosAcumulado": "0"
            },
            {
              "Fecha": "2020-03-04",
              "CasosNuevos": "0",
              "CasosAcumulado": "1",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "0",
              "RecuperadosNuevos": "0",
              "RecuperadosAcumulado": "0"
            },
            {
              "Fecha": "2020-03-05",
              "CasosNuevos": "1",
              "CasosAcumulado": "2",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "0",
              "RecuperadosNuevos": "0",
              "RecuperadosAcumulado": "0"
            },
            {
              "Fecha": "2020-03-06",
              "CasosNuevos": "6",
              "CasosAcumulado": "8",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "0",
              "RecuperadosNuevos": "0",
              "RecuperadosAcumulado": "0"
            },
            {
              "Fecha": "2020-03-07",
              "CasosNuevos": "0",
              "CasosAcumulado": "8",
              "MuertesNuevos": "1",
              "MuertesAcumulado": "1",
              "RecuperadosNuevos": "0",
              "RecuperadosAcumulado": "0"
            },
            {
              "Fecha": "2020-03-08",
              "CasosNuevos": "3",
              "CasosAcumulado": "12",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "1",
              "RecuperadosNuevos": "0",
              "RecuperadosAcumulado": "0"
            },
            {
              "Fecha": "2020-03-09",
              "CasosNuevos": "5",
              "CasosAcumulado": "17",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "1",
              "RecuperadosNuevos": "0",
              "RecuperadosAcumulado": "0"
            },
            {
              "Fecha": "2020-03-10",
              "CasosNuevos": "2",
              "CasosAcumulado": "19",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "1",
              "RecuperadosNuevos": "0",
              "RecuperadosAcumulado": "0"
            },
            {
              "Fecha": "2020-03-11",
              "CasosNuevos": "2",
              "CasosAcumulado": "21",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "1",
              "RecuperadosNuevos": "0",
              "RecuperadosAcumulado": "0"
            },
            {
              "Fecha": "2020-03-12",
              "CasosNuevos": "10",
              "CasosAcumulado": "31",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "1",
              "RecuperadosNuevos": "1",
              "RecuperadosAcumulado": "1"
            },
            {
              "Fecha": "2020-03-13",
              "CasosNuevos": "3",
              "CasosAcumulado": "34",
              "MuertesNuevos": "1",
              "MuertesAcumulado": "2",
              "RecuperadosNuevos": "3",
              "RecuperadosAcumulado": "4"
            },
            {
              "Fecha": "2020-03-14",
              "CasosNuevos": "11",
              "CasosAcumulado": "45",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "2",
              "RecuperadosNuevos": "1",
              "RecuperadosAcumulado": "5"
            },
            {
              "Fecha": "2020-03-15",
              "CasosNuevos": "11",
              "CasosAcumulado": "56",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "2",
              "RecuperadosNuevos": "0",
              "RecuperadosAcumulado": "5"
            },
            {
              "Fecha": "2020-03-16",
              "CasosNuevos": "9",
              "CasosAcumulado": "65",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "2",
              "RecuperadosNuevos": "7",
              "RecuperadosAcumulado": "12"
            },
            {
              "Fecha": "2020-03-17",
              "CasosNuevos": "14",
              "CasosAcumulado": "79",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "2",
              "RecuperadosNuevos": "0",
              "RecuperadosAcumulado": "12"
            },
            {
              "Fecha": "2020-03-18",
              "CasosNuevos": "19",
              "CasosAcumulado": "97",
              "MuertesNuevos": "1",
              "MuertesAcumulado": "3",
              "RecuperadosNuevos": "4",
              "RecuperadosAcumulado": "16"
            },
            {
              "Fecha": "2020-03-19",
              "CasosNuevos": "31",
              "CasosAcumulado": "128",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "3",
              "RecuperadosNuevos": "2",
              "RecuperadosAcumulado": "18"
            },
            {
              "Fecha": "2020-03-20",
              "CasosNuevos": "30",
              "CasosAcumulado": "158",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "3",
              "RecuperadosNuevos": "5",
              "RecuperadosAcumulado": "23"
            },
            {
              "Fecha": "2020-03-21",
              "CasosNuevos": "67",
              "CasosAcumulado": "225",
              "MuertesNuevos": "1",
              "MuertesAcumulado": "4",
              "RecuperadosNuevos": "8",
              "RecuperadosAcumulado": "31"
            },
            {
              "Fecha": "2020-03-22",
              "CasosNuevos": "41",
              "CasosAcumulado": "266",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "4",
              "RecuperadosNuevos": "7",
              "RecuperadosAcumulado": "38"
            },
            {
              "Fecha": "2020-03-23",
              "CasosNuevos": "36",
              "CasosAcumulado": "301",
              "MuertesNuevos": "0",
              "MuertesAcumulado": "4",
              "RecuperadosNuevos": "13",
              "RecuperadosAcumulado": "51"
            },
            {
              "Fecha": "2020-03-24",
              "CasosNuevos": "86",
              "CasosAcumulado": "387",
              "MuertesNuevos": "2",
              "MuertesAcumulado": "6",
              "RecuperadosNuevos": "1",
              "RecuperadosAcumulado": "52"
            },
            {
              "Fecha": "2020-03-25",
              "CasosNuevos": "117",
              "CasosAcumulado": "502",
              "MuertesNuevos": "2",
              "MuertesAcumulado": "8",
              "RecuperadosNuevos": "11",
              "RecuperadosAcumulado": "63"
            },
            {
              "Fecha": "2020-03-26",
              "CasosNuevos": "87",
              "CasosAcumulado": "589",
              "MuertesNuevos": "4",
              "MuertesAcumulado": "12",
              "RecuperadosNuevos": "9",
              "RecuperadosAcumulado": "72"
            },
            {
              "Fecha": "2020-03-27",
              "CasosNuevos": "101",
              "CasosAcumulado": "690",
              "MuertesNuevos": "5",
              "MuertesAcumulado": "17",
              "RecuperadosNuevos": "4",
              "RecuperadosAcumulado": "76"
            },
            {
              "Fecha": "2020-03-28",
              "CasosNuevos": "55",
              "CasosAcumulado": "745",
              "MuertesNuevos": "2",
              "MuertesAcumulado": "19",
              "RecuperadosNuevos": "4",
              "RecuperadosAcumulado": "80"
            },
            {
              "Fecha": "2020-03-29",
              "CasosNuevos": "75",
              "CasosAcumulado": "820",
              "MuertesNuevos": "2",
              "MuertesAcumulado": "21",
              "RecuperadosNuevos": "11",
              "RecuperadosAcumulado": "91"
            },
            {
              "Fecha": "2020-03-30",
              "CasosNuevos": "146",
              "CasosAcumulado": "966",
              "MuertesNuevos": "3",
              "MuertesAcumulado": "24",
              "RecuperadosNuevos": "137",
              "RecuperadosAcumulado": "228"
            },
            {
              "Fecha": "2020-03-31",
              "CasosNuevos": "88",
              "CasosAcumulado": "1054",
              "MuertesNuevos": "3",
              "MuertesAcumulado": "27",
              "RecuperadosNuevos": "12",
              "RecuperadosAcumulado": "240"
            },
            {
              "Fecha": "2020-04-01",
              "CasosNuevos": "79",
              "CasosAcumulado": "1133",
              "MuertesNuevos": "6",
              "MuertesAcumulado": "33",
              "RecuperadosNuevos": "8",
              "RecuperadosAcumulado": "248"
            },
            {
              "Fecha": "2020-04-02",
              "CasosNuevos": "132",
              "CasosAcumulado": "1265",
              "MuertesNuevos": "4",
              "MuertesAcumulado": "37",
              "RecuperadosNuevos": "8",
              "RecuperadosAcumulado": "256"
            },
            {
              "Fecha": "2020-04-03",
              "CasosNuevos": "88",
              "CasosAcumulado": "1353",
              "MuertesNuevos": "5",
              "MuertesAcumulado": "42",
              "RecuperadosNuevos": "10",
              "RecuperadosAcumulado": "266"
            },
            {
              "Fecha": "2020-04-04",
              "CasosNuevos": "98",
              "CasosAcumulado": "1451",
              "MuertesNuevos": "1",
              "MuertesAcumulado": "43",
              "RecuperadosNuevos": "13",
              "RecuperadosAcumulado": "279"
            },
            {
              "Fecha": "2020-04-05",
              "CasosNuevos": "103",
              "CasosAcumulado": "1554",
              "MuertesNuevos": "5",
              "MuertesAcumulado": "48",
              "RecuperadosNuevos": "1",
              "RecuperadosAcumulado": "280"
            },
            {
              "Fecha": "2020-04-06",
              "CasosNuevos": "74",
              "CasosAcumulado": "1628",
              "MuertesNuevos": "6",
              "MuertesAcumulado": "54",
              "RecuperadosNuevos": "45",
              "RecuperadosAcumulado": "325"
            },
            {
              "Fecha": "2020-04-07",
              "CasosNuevos": "87",
              "CasosAcumulado": "1715",
              "MuertesNuevos": "6",
              "MuertesAcumulado": "60",
              "RecuperadosNuevos": "13",
              "RecuperadosAcumulado": "338"
            },
            {
              "Fecha": "2020-04-08",
              "CasosNuevos": "80",
              "CasosAcumulado": "1795",
              "MuertesNuevos": "5",
              "MuertesAcumulado": "65",
              "RecuperadosNuevos": "20",
              "RecuperadosAcumulado": "358"
            },
            {
              "Fecha": "2020-04-09",
              "CasosNuevos": "99",
              "CasosAcumulado": "1894",
              "MuertesNuevos": "14",
              "MuertesAcumulado": "79",
              "RecuperadosNuevos": "7",
              "RecuperadosAcumulado": "365"
            },
            {
              "Fecha": "2020-04-10",
              "CasosNuevos": "81",
              "CasosAcumulado": "1975",
              "MuertesNuevos": "4",
              "MuertesAcumulado": "83",
              "RecuperadosNuevos": "10",
              "RecuperadosAcumulado": "375"
            },
            {
              "Fecha": "2020-04-11",
              "CasosNuevos": "167",
              "CasosAcumulado": "2142",
              "MuertesNuevos": "7",
              "MuertesAcumulado": "90",
              "RecuperadosNuevos": "65",
              "RecuperadosAcumulado": "440"
            },
            {
              "Fecha": "2020-04-12",
              "CasosNuevos": "66",
              "CasosAcumulado": "2208",
              "MuertesNuevos": "5",
              "MuertesAcumulado": "95",
              "RecuperadosNuevos": "28",
              "RecuperadosAcumulado": "468"
            },
            {
              "Fecha": "2020-04-13",
              "CasosNuevos": "69",
              "CasosAcumulado": "2277",
              "MuertesNuevos": "3",
              "MuertesAcumulado": "98",
              "RecuperadosNuevos": "47",
              "RecuperadosAcumulado": "515"
            },
            {
              "Fecha": "2020-04-14",
              "CasosNuevos": "166",
              "CasosAcumulado": "2443",
              "MuertesNuevos": "7",
              "MuertesAcumulado": "105",
              "RecuperadosNuevos": "44",
              "RecuperadosAcumulado": "559"
            },
            {
              "Fecha": "2020-04-15",
              "CasosNuevos": "128",
              "CasosAcumulado": "2571",
              "MuertesNuevos": "7",
              "MuertesAcumulado": "112",
              "RecuperadosNuevos": "37",
              "RecuperadosAcumulado": "596"
            },
            {
              "Fecha": "2020-04-16",
              "CasosNuevos": "98",
              "CasosAcumulado": "2669",
              "MuertesNuevos": "10",
              "MuertesAcumulado": "122",
              "RecuperadosNuevos": "35",
              "RecuperadosAcumulado": "631"
            },
            {
              "Fecha": "2020-04-17",
              "CasosNuevos": "88",
              "CasosAcumulado": "2758",
              "MuertesNuevos": "7",
              "MuertesAcumulado": "129",
              "RecuperadosNuevos": "35",
              "RecuperadosAcumulado": "666"
            },
            {
              "Fecha": "2020-04-18",
              "CasosNuevos": "81",
              "CasosAcumulado": "2839",
              "MuertesNuevos": "3",
              "MuertesAcumulado": "132",
              "RecuperadosNuevos": "19",
              "RecuperadosAcumulado": "685"
            },
            {
              "Fecha": "2020-04-19",
              "CasosNuevos": "102",
              "CasosAcumulado": "2941",
              "MuertesNuevos": "2",
              "MuertesAcumulado": "134",
              "RecuperadosNuevos": "24",
              "RecuperadosAcumulado": "709"
            },
            {
              "Fecha": "2020-04-20",
              "CasosNuevos": "90",
              "CasosAcumulado": "3031",
              "MuertesNuevos": "8",
              "MuertesAcumulado": "142",
              "RecuperadosNuevos": "28",
              "RecuperadosAcumulado": "737"
            },
            {
              "Fecha": "2020-04-21",
              "CasosNuevos": "112",
              "CasosAcumulado": "3144",
              "MuertesNuevos": "9",
              "MuertesAcumulado": "151",
              "RecuperadosNuevos": "103",
              "RecuperadosAcumulado": "840"
            },
            {
              "Fecha": "2020-04-22",
              "CasosNuevos": "144",
              "CasosAcumulado": "3288",
              "MuertesNuevos": "8",
              "MuertesAcumulado": "159",
              "RecuperadosNuevos": "32",
              "RecuperadosAcumulado": "872"
            },
            {
              "Fecha": "2020-04-23",
              "CasosNuevos": "147",
              "CasosAcumulado": "3435",
              "MuertesNuevos": "8",
              "MuertesAcumulado": "167",
              "RecuperadosNuevos": "47",
              "RecuperadosAcumulado": "919"
            },
            {
              "Fecha": "2020-04-24",
              "CasosNuevos": "172",
              "CasosAcumulado": "3607",
              "MuertesNuevos": "12",
              "MuertesAcumulado": "179",
              "RecuperadosNuevos": "57",
              "RecuperadosAcumulado": "976"
            },
            {
              "Fecha": "2020-04-25",
              "CasosNuevos": "173",
              "CasosAcumulado": "3780",
              "MuertesNuevos": "8",
              "MuertesAcumulado": "187",
              "RecuperadosNuevos": "54",
              "RecuperadosAcumulado": "1030"
            },
            {
              "Fecha": "2020-04-26",
              "CasosNuevos": "112",
              "CasosAcumulado": "3892",
              "MuertesNuevos": "5",
              "MuertesAcumulado": "192",
              "RecuperadosNuevos": "77",
              "RecuperadosAcumulado": "1107"
            },
            {
              "Fecha": "2020-04-27",
              "CasosNuevos": "111",
              "CasosAcumulado": "4003",
              "MuertesNuevos": "5",
              "MuertesAcumulado": "197",
              "RecuperadosNuevos": "33",
              "RecuperadosAcumulado": "1140"
            },
            {
              "Fecha": "2020-04-28",
              "CasosNuevos": "124",
              "CasosAcumulado": "4127",
              "MuertesNuevos": "10",
              "MuertesAcumulado": "207",
              "RecuperadosNuevos": "22",
              "RecuperadosAcumulado": "1162"
            },
            {
              "Fecha": "2020-04-29",
              "CasosNuevos": "158",
              "CasosAcumulado": "4285",
              "MuertesNuevos": "7",
              "MuertesAcumulado": "214",
              "RecuperadosNuevos": "30",
              "RecuperadosAcumulado": "1192"
            },
            {
              "Fecha": "2020-04-30",
              "CasosNuevos": "143",
              "CasosAcumulado": "4428",
              "MuertesNuevos": "4",
              "MuertesAcumulado": "218",
              "RecuperadosNuevos": "64",
              "RecuperadosAcumulado": "1256"
            },
            {
              "Fecha": "2020-05-01",
              "CasosNuevos": "105",
              "CasosAcumulado": "4532",
              "MuertesNuevos": "7",
              "MuertesAcumulado": "225",
              "RecuperadosNuevos": "36",
              "RecuperadosAcumulado": "1292"
            },
            {
              "Fecha": "2020-05-02",
              "CasosNuevos": "149",
              "CasosAcumulado": "4681",
              "MuertesNuevos": "12",
              "MuertesAcumulado": "237",
              "RecuperadosNuevos": "28",
              "RecuperadosAcumulado": "1320"
            },
            {
              "Fecha": "2020-05-03",
              "CasosNuevos": "103",
              "CasosAcumulado": "4783",
              "MuertesNuevos": "9",
              "MuertesAcumulado": "246",
              "RecuperadosNuevos": "34",
              "RecuperadosAcumulado": "1354"
            },
            {
              "Fecha": "2020-05-04",
              "CasosNuevos": "104",
              "CasosAcumulado": "4887",
              "MuertesNuevos": "14",
              "MuertesAcumulado": "260",
              "RecuperadosNuevos": "88",
              "RecuperadosAcumulado": "1442"
            },
            {
              "Fecha": "2020-05-05",
              "CasosNuevos": "134",
              "CasosAcumulado": "5020",
              "MuertesNuevos": "4",
              "MuertesAcumulado": "264",
              "RecuperadosNuevos": "30",
              "RecuperadosAcumulado": "1472"
            },
            {
              "Fecha": "2020-05-06",
              "CasosNuevos": "188",
              "CasosAcumulado": "5208",
              "MuertesNuevos": "9",
              "MuertesAcumulado": "273",
              "RecuperadosNuevos": "52",
              "RecuperadosAcumulado": "1524"
            },
            {
              "Fecha": "2020-05-07",
              "CasosNuevos": "163",
              "CasosAcumulado": "5371",
              "MuertesNuevos": "9",
              "MuertesAcumulado": "282",
              "RecuperadosNuevos": "77",
              "RecuperadosAcumulado": "1601"
            },
            {
              "Fecha": "2020-05-08",
              "CasosNuevos": "240",
              "CasosAcumulado": "5611",
              "MuertesNuevos": "11",
              "MuertesAcumulado": "293",
              "RecuperadosNuevos": "58",
              "RecuperadosAcumulado": "1659"
            },
            {
              "Fecha": "2020-05-09",
              "CasosNuevos": "165",
              "CasosAcumulado": "5776",
              "MuertesNuevos": "7",
              "MuertesAcumulado": "300",
              "RecuperadosNuevos": "69",
              "RecuperadosAcumulado": "1728"
            },
            {
              "Fecha": "2020-05-10",
              "CasosNuevos": "258",
              "CasosAcumulado": "6034",
              "MuertesNuevos": "5",
              "MuertesAcumulado": "305",
              "RecuperadosNuevos": "29",
              "RecuperadosAcumulado": "1757"
            },
            {
              "Fecha": "2020-05-11",
              "CasosNuevos": "244",
              "CasosAcumulado": "6278",
              "MuertesNuevos": "9",
              "MuertesAcumulado": "314",
              "RecuperadosNuevos": "80",
              "RecuperadosAcumulado": "1837"
            },
            {
              "Fecha": "2020-05-12",
              "CasosNuevos": "285",
              "CasosAcumulado": "6563",
              "MuertesNuevos": "5",
              "MuertesAcumulado": "319",
              "RecuperadosNuevos": "25",
              "RecuperadosAcumulado": "1862"
            },
            {
              "Fecha": "2020-05-13",
              "CasosNuevos": "316",
              "CasosAcumulado": "6879",
              "MuertesNuevos": "10",
              "MuertesAcumulado": "329",
              "RecuperadosNuevos": "404",
              "RecuperadosAcumulado": "2266"
            },
            {
              "Fecha": "2020-05-14",
              "CasosNuevos": "255",
              "CasosAcumulado": "7134",
              "MuertesNuevos": "24",
              "MuertesAcumulado": "353",
              "RecuperadosNuevos": "119",
              "RecuperadosAcumulado": "2385"
            },
            {
              "Fecha": "2020-05-15",
              "CasosNuevos": "345",
              "CasosAcumulado": "7479",
              "MuertesNuevos": "3",
              "MuertesAcumulado": "356",
              "RecuperadosNuevos": "112",
              "RecuperadosAcumulado": "2497"
            },
            {
              "Fecha": "2020-05-16",
              "CasosNuevos": "326",
              "CasosAcumulado": "7805",
              "MuertesNuevos": "7",
              "MuertesAcumulado": "363",
              "RecuperadosNuevos": "37",
              "RecuperadosAcumulado": "2534"
            },
            {
              "Fecha": "2020-05-17",
              "CasosNuevos": "263",
              "CasosAcumulado": "8068",
              "MuertesNuevos": "10",
              "MuertesAcumulado": "373",
              "RecuperadosNuevos": "35",
              "RecuperadosAcumulado": "2569"
            },
            {
              "Fecha": "2020-05-18",
              "CasosNuevos": "303",
              "CasosAcumulado": "8371",
              "MuertesNuevos": "9",
              "MuertesAcumulado": "382",
              "RecuperadosNuevos": "56",
              "RecuperadosAcumulado": "2625"
            },
            {
              "Fecha": "2020-05-19",
              "CasosNuevos": "438",
              "CasosAcumulado": "8809",
              "MuertesNuevos": "11",
              "MuertesAcumulado": "393",
              "RecuperadosNuevos": "247",
              "RecuperadosAcumulado": "2872"
            },
            {
              "Fecha": "2020-05-20",
              "CasosNuevos": "474",
              "CasosAcumulado": "9283",
              "MuertesNuevos": "10",
              "MuertesAcumulado": "403",
              "RecuperadosNuevos": "61",
              "RecuperadosAcumulado": "2933"
            },
            {
              "Fecha": "2020-05-21",
              "CasosNuevos": "648",
              "CasosAcumulado": "9931",
              "MuertesNuevos": "13",
              "MuertesAcumulado": "416",
              "RecuperadosNuevos": "99",
              "RecuperadosAcumulado": "3032"
            },
            {
              "Fecha": "2020-05-22",
              "CasosNuevos": "718",
              "CasosAcumulado": "10649",
              "MuertesNuevos": "17",
              "MuertesAcumulado": "433",
              "RecuperadosNuevos": "30",
              "RecuperadosAcumulado": "3062"
            },
            {
              "Fecha": "2020-05-23",
              "CasosNuevos": "704",
              "CasosAcumulado": "11353",
              "MuertesNuevos": "12",
              "MuertesAcumulado": "445",
              "RecuperadosNuevos": "468",
              "RecuperadosAcumulado": "3530"
            },
            {
              "Fecha": "2020-05-24",
              "CasosNuevos": "723",
              "CasosAcumulado": "12076",
              "MuertesNuevos": "7",
              "MuertesAcumulado": "452",
              "RecuperadosNuevos": "202",
              "RecuperadosAcumulado": "3732"
            },
            {
              "Fecha": "2020-05-25",
              "CasosNuevos": "552",
              "CasosAcumulado": "12628",
              "MuertesNuevos": "15",
              "MuertesAcumulado": "467",
              "RecuperadosNuevos": "267",
              "RecuperadosAcumulado": "3999"
            },
            {
              "Fecha": "2020-05-26",
              "CasosNuevos": "600",
              "CasosAcumulado": "13228",
              "MuertesNuevos": "23",
              "MuertesAcumulado": "490",
              "RecuperadosNuevos": "168",
              "RecuperadosAcumulado": "4167"
            },
            {
              "Fecha": "2020-05-27",
              "CasosNuevos": "706",
              "CasosAcumulado": "13933",
              "MuertesNuevos": "10",
              "MuertesAcumulado": "500",
              "RecuperadosNuevos": "182",
              "RecuperadosAcumulado": "4349"
            },
            {
              "Fecha": "2020-05-28",
              "CasosNuevos": "769",
              "CasosAcumulado": "14702",
              "MuertesNuevos": "8",
              "MuertesAcumulado": "508",
              "RecuperadosNuevos": "268",
              "RecuperadosAcumulado": "4617"
            },
            {
              "Fecha": "2020-05-29",
              "CasosNuevos": "717",
              "CasosAcumulado": "15419",
              "MuertesNuevos": "12",
              "MuertesAcumulado": "520",
              "RecuperadosNuevos": "171",
              "RecuperadosAcumulado": "4788"
            },
            {
              "Fecha": "2020-05-30",
              "CasosNuevos": "795",
              "CasosAcumulado": "16214",
              "MuertesNuevos": "8",
              "MuertesAcumulado": "528",
              "RecuperadosNuevos": "312",
              "RecuperadosAcumulado": "5100"
            },
            {
              "Fecha": "2020-05-31",
              "CasosNuevos": "637",
              "CasosAcumulado": "16851",
              "MuertesNuevos": "11",
              "MuertesAcumulado": "539",
              "RecuperadosNuevos": "236",
              "RecuperadosAcumulado": "5336"
            },
            {
              "Fecha": "2020-06-01",
              "CasosNuevos": "564",
              "CasosAcumulado": "17415",
              "MuertesNuevos": "17",
              "MuertesAcumulado": "556",
              "RecuperadosNuevos": "185",
              "RecuperadosAcumulado": "5521"
            },
            {
              "Fecha": "2020-06-02",
              "CasosNuevos": "904",
              "CasosAcumulado": "18319",
              "MuertesNuevos": "13",
              "MuertesAcumulado": "569",
              "RecuperadosNuevos": "188",
              "RecuperadosAcumulado": "5709"
            },
            {
              "Fecha": "2020-06-03",
              "CasosNuevos": "949",
              "CasosAcumulado": "19268",
              "MuertesNuevos": "14",
              "MuertesAcumulado": "583",
              "RecuperadosNuevos": "187",
              "RecuperadosAcumulado": "5896"
            },
            {
              "Fecha": "2020-06-04",
              "CasosNuevos": "929",
              "CasosAcumulado": "20197",
              "MuertesNuevos": "25",
              "MuertesAcumulado": "608",
              "RecuperadosNuevos": "97",
              "RecuperadosAcumulado": "5993"
            },
            {
              "Fecha": "2020-06-05",
              "CasosNuevos": "840",
              "CasosAcumulado": "21037",
              "MuertesNuevos": "24",
              "MuertesAcumulado": "632",
              "RecuperadosNuevos": "95",
              "RecuperadosAcumulado": "6088"
            },
            {
              "Fecha": "2020-06-06",
              "CasosNuevos": "983",
              "CasosAcumulado": "22020",
              "MuertesNuevos": "16",
              "MuertesAcumulado": "648",
              "RecuperadosNuevos": "92",
              "RecuperadosAcumulado": "6180"
            },
            {
              "Fecha": "2020-06-07",
              "CasosNuevos": "774",
              "CasosAcumulado": "22794",
              "MuertesNuevos": "16",
              "MuertesAcumulado": "664",
              "RecuperadosNuevos": "729",
              "RecuperadosAcumulado": "6909"
            },
            {
              "Fecha": "2020-06-08",
              "CasosNuevos": "826",
              "CasosAcumulado": "23620",
              "MuertesNuevos": "29",
              "MuertesAcumulado": "693",
              "RecuperadosNuevos": "396",
              "RecuperadosAcumulado": "7305"
            },
            {
              "Fecha": "2020-06-09",
              "CasosNuevos": "1141",
              "CasosAcumulado": "24761",
              "MuertesNuevos": "24",
              "MuertesAcumulado": "717",
              "RecuperadosNuevos": "263",
              "RecuperadosAcumulado": "7568"
            },
            {
              "Fecha": "2020-06-10",
              "CasosNuevos": "1226",
              "CasosAcumulado": "25987",
              "MuertesNuevos": "18",
              "MuertesAcumulado": "735",
              "RecuperadosNuevos": "423",
              "RecuperadosAcumulado": "7991"
            },
            {
              "Fecha": "2020-06-11",
              "CasosNuevos": "1386",
              "CasosAcumulado": "27373",
              "MuertesNuevos": "30",
              "MuertesAcumulado": "765",
              "RecuperadosNuevos": "341",
              "RecuperadosAcumulado": "8332"
            },
            {
              "Fecha": "2020-06-12",
              "CasosNuevos": "1391",
              "CasosAcumulado": "28764",
              "MuertesNuevos": "20",
              "MuertesAcumulado": "785",
              "RecuperadosNuevos": "411",
              "RecuperadosAcumulado": "8743"
            },
            {
              "Fecha": "2020-06-13",
              "CasosNuevos": "1531",
              "CasosAcumulado": "30295",
              "MuertesNuevos": "30",
              "MuertesAcumulado": "815",
              "RecuperadosNuevos": "340",
              "RecuperadosAcumulado": "9083"
            },
            {
              "Fecha": "2020-06-14",
              "CasosNuevos": "1282",
              "CasosAcumulado": "31577",
              "MuertesNuevos": "18",
              "MuertesAcumulado": "833",
              "RecuperadosNuevos": "481",
              "RecuperadosAcumulado": "9564"
            },
            {
              "Fecha": "2020-06-15",
              "CasosNuevos": "1208",
              "CasosAcumulado": "32785",
              "MuertesNuevos": "21",
              "MuertesAcumulado": "854",
              "RecuperadosNuevos": "327",
              "RecuperadosAcumulado": "9891"
            },
            {
              "Fecha": "2020-06-16",
              "CasosNuevos": "1374",
              "CasosAcumulado": "34159",
              "MuertesNuevos": "24",
              "MuertesAcumulado": "878",
              "RecuperadosNuevos": "283",
              "RecuperadosAcumulado": "10174"
            },
            {
              "Fecha": "2020-06-17",
              "CasosNuevos": "1393",
              "CasosAcumulado": "35552",
              "MuertesNuevos": "35",
              "MuertesAcumulado": "913",
              "RecuperadosNuevos": "338",
              "RecuperadosAcumulado": "10512"
            },
            {
              "Fecha": "2020-06-18",
              "CasosNuevos": "1958",
              "CasosAcumulado": "37510",
              "MuertesNuevos": "35",
              "MuertesAcumulado": "948",
              "RecuperadosNuevos": "209",
              "RecuperadosAcumulado": "10721"
            },
            {
              "Fecha": "2020-06-19",
              "CasosNuevos": "2060",
              "CasosAcumulado": "39570",
              "MuertesNuevos": "31",
              "MuertesAcumulado": "979",
              "RecuperadosNuevos": "1130",
              "RecuperadosAcumulado": "11851"
            },
            {
              "Fecha": "2020-06-20",
              "CasosNuevos": "1634",
              "CasosAcumulado": "41204",
              "MuertesNuevos": "14",
              "MuertesAcumulado": "992",
              "RecuperadosNuevos": "355",
              "RecuperadosAcumulado": "12206"
            },
            {
              "Fecha": "2020-06-21",
              "CasosNuevos": "1581",
              "CasosAcumulado": "42785",
              "MuertesNuevos": "19",
              "MuertesAcumulado": "1011",
              "RecuperadosNuevos": "522",
              "RecuperadosAcumulado": "12728"
            },
            {
              "Fecha": "2020-06-22",
              "CasosNuevos": "2146",
              "CasosAcumulado": "44931",
              "MuertesNuevos": "32",
              "MuertesAcumulado": "1043",
              "RecuperadosNuevos": "425",
              "RecuperadosAcumulado": "13153"
            },
            {
              "Fecha": "2020-06-23",
              "CasosNuevos": "2285",
              "CasosAcumulado": "47216",
              "MuertesNuevos": "35",
              "MuertesAcumulado": "1078",
              "RecuperadosNuevos": "423",
              "RecuperadosAcumulado": "13576"
            },
            {
              "Fecha": "2020-06-24",
              "CasosNuevos": "2635",
              "CasosAcumulado": "49851",
              "MuertesNuevos": "38",
              "MuertesAcumulado": "1116",
              "RecuperadosNuevos": "240",
              "RecuperadosAcumulado": "13816"
            },
            {
              "Fecha": "2020-06-25",
              "CasosNuevos": "2606",
              "CasosAcumulado": "52457",
              "MuertesNuevos": "34",
              "MuertesAcumulado": "1150",
              "RecuperadosNuevos": "972",
              "RecuperadosAcumulado": "14788"
            },
            {
              "Fecha": "2020-06-26",
              "CasosNuevos": "2886",
              "CasosAcumulado": "55343",
              "MuertesNuevos": "34",
              "MuertesAcumulado": "1184",
              "RecuperadosNuevos": "3628",
              "RecuperadosAcumulado": "18416"
            },
            {
              "Fecha": "2020-06-27",
              "CasosNuevos": "2401",
              "CasosAcumulado": "57744",
              "MuertesNuevos": "23",
              "MuertesAcumulado": "1207",
              "RecuperadosNuevos": "727",
              "RecuperadosAcumulado": "19143"
            },
            {
              "Fecha": "2020-06-28",
              "CasosNuevos": "2189",
              "CasosAcumulado": "59933",
              "MuertesNuevos": "26",
              "MuertesAcumulado": "1232",
              "RecuperadosNuevos": "991",
              "RecuperadosAcumulado": "20134"
            },
            {
              "Fecha": "2020-06-29",
              "CasosNuevos": "2335",
              "CasosAcumulado": "62268",
              "MuertesNuevos": "48",
              "MuertesAcumulado": "1280",
              "RecuperadosNuevos": "1004",
              "RecuperadosAcumulado": "21138"
            },
            {
              "Fecha": "2020-06-30",
              "CasosNuevos": "2262",
              "CasosAcumulado": "64530",
              "MuertesNuevos": "27",
              "MuertesAcumulado": "1307",
              "RecuperadosNuevos": "890",
              "RecuperadosAcumulado": "22028"
            },
            {
              "Fecha": "2020-07-01",
              "CasosNuevos": "2667",
              "CasosAcumulado": "67197",
              "MuertesNuevos": "44",
              "MuertesAcumulado": "1351",
              "RecuperadosNuevos": "1012",
              "RecuperadosAcumulado": "23040"
            },
            {
              "Fecha": "2020-07-02",
              "CasosNuevos": "2744",
              "CasosAcumulado": "69941",
              "MuertesNuevos": "34",
              "MuertesAcumulado": "1385",
              "RecuperadosNuevos": "1146",
              "RecuperadosAcumulado": "24186"
            },
            {
              "Fecha": "2020-07-03",
              "CasosNuevos": "2845",
              "CasosAcumulado": "72786",
              "MuertesNuevos": "52",
              "MuertesAcumulado": "1437",
              "RecuperadosNuevos": "1038",
              "RecuperadosAcumulado": "25224"
            },
            {
              "Fecha": "2020-07-04",
              "CasosNuevos": "2590",
              "CasosAcumulado": "75376",
              "MuertesNuevos": "44",
              "MuertesAcumulado": "1481",
              "RecuperadosNuevos": "706",
              "RecuperadosAcumulado": "25930"
            },
            {
              "Fecha": "2020-07-05",
              "CasosNuevos": "2439",
              "CasosAcumulado": "77815",
              "MuertesNuevos": "26",
              "MuertesAcumulado": "1507",
              "RecuperadosNuevos": "1667",
              "RecuperadosAcumulado": "27597"
            },
            {
              "Fecha": "2020-07-06",
              "CasosNuevos": "2632",
              "CasosAcumulado": "80447",
              "MuertesNuevos": "75",
              "MuertesAcumulado": "1582",
              "RecuperadosNuevos": "934",
              "RecuperadosAcumulado": "28531"
            },
            {
              "Fecha": "2020-07-07",
              "CasosNuevos": "2979",
              "CasosAcumulado": "83426",
              "MuertesNuevos": "62",
              "MuertesAcumulado": "1644",
              "RecuperadosNuevos": "1564",
              "RecuperadosAcumulado": "30095"
            },
            {
              "Fecha": "2020-07-08",
              "CasosNuevos": "3604",
              "CasosAcumulado": "87030",
              "MuertesNuevos": "51",
              "MuertesAcumulado": "1694",
              "RecuperadosNuevos": "6407",
              "RecuperadosAcumulado": "36502"
            },
            {
              "Fecha": "2020-07-09",
              "CasosNuevos": "3663",
              "CasosAcumulado": "90693",
              "MuertesNuevos": "26",
              "MuertesAcumulado": "1720",
              "RecuperadosNuevos": "1811",
              "RecuperadosAcumulado": "38313"
            },
            {
              "Fecha": "2020-07-10",
              "CasosNuevos": "3367",
              "CasosAcumulado": "94060",
              "MuertesNuevos": "54",
              "MuertesAcumulado": "1774",
              "RecuperadosNuevos": "671",
              "RecuperadosAcumulado": "38984"
            },
            {
              "Fecha": "2020-07-11",
              "CasosNuevos": "3449",
              "CasosAcumulado": "97509",
              "MuertesNuevos": "36",
              "MuertesAcumulado": "1810",
              "RecuperadosNuevos": "2424",
              "RecuperadosAcumulado": "41408"
            },
            {
              "Fecha": "2020-07-12",
              "CasosNuevos": "2657",
              "CasosAcumulado": "100166",
              "MuertesNuevos": "35",
              "MuertesAcumulado": "1845",
              "RecuperadosNuevos": "1286",
              "RecuperadosAcumulado": "42694"
            }
          ];


          return data;
    }

    //obtiene datos al dia de hoy
    function getDataRest(inicio, fin){

        var rest = "https://api.covid19api.com/country/argentina?from="+inicio+"T00:00:00Z&to="+fin+"T00:00:00Z";
    
        $.ajax({
            type: "GET",
            url: rest,

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
                requestError();
            },
        });
    }

    //tiene que calcular y llenar los valores que traigo de la rest
    function loadJsonData(objeto){

        var datosDiaAnterior = null;
    
        $.each(objeto, (index, elemento) => {
                //la prevision sera cero para el primer dato
                if (datosDiaAnterior == null){                    
                    datosDiaAnterior = cacheData[cacheData.length-1];//es el ultimo dia! para poder realizar las restas y cuentas       
                }

                cacheData.push(
                {
                    Fecha: moment(elemento.Date , 'YYYY-MM-DD').format('YYYY-MM-DD'),
                    CasosNuevos: (elemento.Confirmed - datosDiaAnterior.CasosAcumulado),   
                    CasosAcumulado: elemento.Confirmed,
                    MuertesNuevos: (elemento.Deaths - datosDiaAnterior.MuertesAcumulado),                   
                    MuertesAcumulado: elemento.Deaths,
                    RecuperadosNuevos: (elemento.Recovered - datosDiaAnterior.RecuperadosAcumulado),
                    RecuperadosAcumulado: elemento.Recovered
                });   
                
                datosDiaAnterior = cacheData[cacheData.length-1];//el elemento recientemente añadido;
            });
    }

    function launchProcess(response){

        //emulo que tarda, porque el CSV lo hace rapido y asi muestra la animacion
        setTimeout( () => {                  
            cacheData = getJSONDataDB();
            loadJsonData(response);
            requestComplete();
        } , 2000); 
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                        <td class='details-control'></td>     
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
                        <td class='details-control'></td>     
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

    function requestComplete(){

        //carga datos tabla
        prepareData(cacheData);
      
        //escondo el msge de carga
        $("#loading").hide();
        
        //tiene que llamarse luego de llenada la tabla
        table = $('#tablaProb').DataTable(
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
                
                "order": [[1, 'asc']],

                "pagingType": "full_numbers",
                "pageLength": 50
            }
        ).page('last').draw('page');;//uso de plugin apuntando a la ultima pagina!
        
        addTroggleTbl();
        
        $("#tblDinamica").slideUp(300).fadeIn(400); //.show() alternative

        //prepara los graficos
        chartInfAlDia(cacheData);
        chartInfxDia(cacheData);

    
        $("#chartInfAlDia").show();
        $("#chartInfxDia").show();
       
        chart[1].render(); 
        chart[0].render();  //si el GRAFICO inicia hide, hay que redendirar ANTES! sino luego hay que renderizar con un loop    
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

    /* Formatting function for row details - modify as you need */
    function format (d) {
      // `d` is the original data object for the row
    
      var fecha = d[1].substring(d[1].lastIndexOf("<span>") + 6, d[1].lastIndexOf("</span>"));
      var datos = getMoreData(fecha);
 
      return '<table cellpadding="5" cellspacing="0" border="0" style="background:white; padding-left:5px; text-align:left;">'+
          '<tr>'+
              '<td>Muertes:</td>'+
              '<td>'+datos[0].MuertesNuevos+'</td>'+
          '</tr>'+
          '<tr>'+
              '<td>Muertes Totales:</td>'+
              '<td>'+datos[0].MuertesAcumulado+'</td>'+
          '</tr>'+
          '<tr>'+
              '<td>Recuperados:</td>'+
              '<td>'+datos[0].RecuperadosNuevos+'</td>'+
          '</tr>'+
          '<tr>'+
            '<td>Recuperados Totales:</td>'+
            '<td>'+datos[0].RecuperadosAcumulado+'</td>'+
      '</tr>'+
      '</table>';
    }

    function getMoreData(fecha){

      var datos = [];

      cacheData.forEach((item, index) => {
      
          if (item.Fecha == fecha){
            datos.push(
              {
                  MuertesNuevos: item.MuertesNuevos,                   
                  MuertesAcumulado: item.MuertesAcumulado,
                  RecuperadosNuevos: item.RecuperadosNuevos,
                  RecuperadosAcumulado: item.RecuperadosAcumulado
              });   
          }
      });

      if (datos.length == 0){
        datos.push(
          {
              MuertesNuevos: 0,                   
              MuertesAcumulado: 0,
              RecuperadosNuevos: 0,
              RecuperadosAcumulado: 0
          });   

      }

      return datos;
    }

    function addTroggleTbl(){
      // Add event listener for opening and closing details
      $('#tablaCuerpo').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
      });
    }

    ////////////////////////////////////////////////////GRAFICOS///////////////////////////////////////////////////////////////////
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

