var InformacionId = [];
var InformacionTipo = [];
var InformacionValor = [];
var Valores = [];
var prueba = "|---";
var prueba2 = "---";

function Agrupador(){
	nivelesDeProfundidad = 0;
	profundidadActual = 0;
	resultadoPadre = undefined;
}

Agrupador.prototype = {
	constructor: Agrupador,
	llamarInfo: function(archivo, miArreglo, criterioBusqueda, tabulacion) {
		criterioBusqueda = criterioBusqueda || false;
		tabulacion = tabulacion || "|---";
		$.ajax({
			url: archivo,
			dataType: "json",
			success: function(data){
				Agrupador.almacenamientoDatos(miArreglo, data, false);
				$("#demo").append("<br>");/*
				$("#demo").append("<br> Niveles de profundidad: "+nivelesDeProfundidad);
				$("#demo").append("<br> Profunidad Actual: "+profundidadActual);
				$("#demo").append("<br> Informacion recopilada: <br><br>"+InformacionId[0][2]);
				$("#demo").append("<br><br> Informacion recopilada: <br><br>"+InformacionId[0][2][2][2]);
				$("#demo").append("<br><br> Registros en la cache: "+InformacionId[0][2].length+"<br><br>");*/
	Agrupador.displayDatos(InformacionId);
			},
			error: function (jqXHR, exception){
				var msg = '';
		        if (jqXHR.status === 0) {
		            msg = 'Not connect.\n Verify Network.';
		        } else if (jqXHR.status == 404) {
		            msg = 'Requested page not found. [404]';
		        } else if (jqXHR.status == 500) {
		            msg = 'Internal Server Error [500].';
		        } else if (exception === 'parsererror') {
		            msg = 'Requested JSON parse failed.';
		        } else if (exception === 'timeout') {
		            msg = 'Time out error.';
		        } else if (exception === 'abort') {
		            msg = 'Ajax request aborted.';
		        } else {
		            msg = 'Uncaught Error.\n' + jqXHR.responseText;
		        }
				$("#demo").append(msg);
			}
		});
	},
	almacenamientoDatos: function(miArreglo, data, criterioBusqueda, resultset, tabulacion, esArray) {
		var resultado = resultset || data;	
		var longitud = 1;
		tabulacion = tabulacion || "|---";
		var esArray = esArray || false;
		var criterioBusqueda = criterioBusqueda || false;
		profundidadActual++;


		if(criterioBusqueda != false){
			for(x in resultado){
				var nodos = Object.keys(resultado).length;
				var miRegistro = [];
				longitud++;
				if(x == criterioBusqueda){
					$("#demo").append(tabulacion+"("+typeof resultado[x] + " | " + nodos +") " + x + " (Profd. Actual: " + profundidadActual + "), Arr: " + esArray);
					miRegistro.push(x);
					miRegistro.push(typeof resultado[x]);

					if(typeof resultado[x] == "object"){
						//$("#demo").append(" {RAMIFICACION}");
						$("#demo").append("<br>");
						var resultado2 = resultado[x];
						var miCache = [];
						tabulacion2 = tabulacion + "---";

						miRegistro.push(Agrupador.almacenamientoDatos(miCache, data, false, resultado2, tabulacion2, $.isArray(resultado[x])));
					}
					else{
						miRegistro.push(resultado[x]);
						if(longitud > nodos){
							if(profundidadActual > nivelesDeProfundidad){
								nivelesDeProfundidad = profundidadActual;
							}

							profundidadActual--;
							//$("#demo").append(" [BACKTRACKING]");
						}
						$("#demo").append("<br>");
					}

					miArreglo.push(miRegistro);
				}
			}
		}
		else{
			for(x in resultado){
				var nodos = Object.keys(resultado).length;
				var miRegistro = [];
				longitud++;
				
				$("#demo").append(tabulacion+"("+typeof resultado[x] + " | " + nodos +") " + x + " (Profd. Actual: " + profundidadActual + "), Arr: " + esArray);
				miRegistro.push(x);
				miRegistro.push(typeof resultado[x]);

				if(typeof resultado[x] == "object"){
					//$("#demo").append(" {RAMIFICACION}");
					$("#demo").append("<br>");
					var resultado2 = resultado[x];
					var miCache = [];
					tabulacion2 = tabulacion + "---";

					miRegistro.push(Agrupador.almacenamientoDatos(miCache, data, false, resultado2, tabulacion2, $.isArray(resultado[x])));
				}
				else{
					miRegistro.push(resultado[x]);
					if(longitud > nodos){
						if(profundidadActual > nivelesDeProfundidad){
							nivelesDeProfundidad = profundidadActual;
						}

						profundidadActual--;
						//$("#demo").append(" [BACKTRACKING]");
					}
					$("#demo").append("<br>");
				}

				miArreglo.push(miRegistro);
			}
		}
		return miArreglo;
	},
	displayDatos: function(miArreglo, tabulacion) {
		var longitud = 1;
		tabulacion = tabulacion || "||===";

		for(var i = 0; i < miArreglo.length; i++){
			$("#demo").append(tabulacion+"Nombre del registro: "+miArreglo[i][0]+"<br>");
			$("#demo").append(tabulacion+" - Tipo: "+miArreglo[i][1]+"<br>");

			if(typeof miArreglo[i][2] == "object"){
				$("#demo").append(tabulacion+" - Numero de registros contenidos: "+miArreglo[i][2].length+"<br>");
				var tabulacion2 = tabulacion + "===";
				var miCache = miArreglo[i][2];
				Agrupador.displayDatos(miCache, tabulacion2);
			}
			else{
				$("#demo").append(tabulacion+" - Valor: "+miArreglo[i][2]+"<br>");
			}
		}
	}
}
var Agrupador = new Agrupador();
$(document).ready(function(){
	Agrupador.llamarInfo("usuario.json", InformacionId);
});