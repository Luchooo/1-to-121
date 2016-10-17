 $(function()
{

var cuentaTiempo = 0;
var total_numeros=121;
var usados = []; 
var dimensiones=11;
var mostrando = false;
var objetivo=1;
var ayudas=6;
var alto= screen.height;
var ancho= screen.width;
var matriz=[[],[],[],[],[],[],[],[],[],[],[]];
var animaciones=["animated tada","animated flash","animated wobble","animated zoomIn","animated rotateIn","animated swing"];
var numeroAnimacion=0;
var volumen=true;
var palabra=0;
huevoPascuaPosicion=[];
var huevoPascua="0_0,10_0,10_10,0_10"
var cancion=true;


iniciarJuego();

function iniciarJuego () 
  {
    parametrosIniciales();
    cargarSonidos();
    crearEscenario();
    llenarMatriz();
  }


function llenarMatriz () 
  {
    do
        {
        for (var i = 0; i < matriz.length; i++) 
            {
                for (e=0; e<matriz.length; e++)
                {
                            
                         matriz[i][e]=aleatorio(total_numeros);
                };
            };
        }

        while(matriz.length===12)
        
        for (i=0; i<matriz.length; i++)
            {
                for (e=0; e<matriz.length; e++)
                  {
                    $('#'+i+"_"+e).html(matriz[i][e]).css('color', randomColor());
                  };
            };
  }



function crearEscenario () 
    {
        var txt = "<table id = 'chess_board' cellpadding = '0' cellspacing = '0' >";
        var divTabla = "";
        for(var i = 0; i < dimensiones; i++)
        {
            txt += "<tr>";
            for(var c = 0; c < dimensiones; c++)
            {
                divTabla = i + "_" + c;
                txt += "<td id = '"+(divTabla)+"'></td>";
            }
            txt += "</tr>";
            

        }
        txt += "</table>";
        $("#escenario").html(txt);


          $("#chess_board").css
                          ({
                             "width"                : (ancho-20)+"px",
                              "height"              : (alto-150 )+"px",
                           // "border"              : "1px solid red",
                              "font-weight"         : "bold",
                              "font-family"         : "Arial",
                              "line-height"         : 5+"px",
                           // "cursor"              : "pointer",
                              "text-align"          :"center",
                              "font-size"           : (ancho/35)+"px"
                                 
                         });

        clickCelda();
        
      
    };


function aleatorio(min)
{ 
    if (usados.length !=  min)
    {   
        var num; 
        var repe= false; 
            do 
            { 
                var num=Math.floor((Math.random()*min)+1);
                repe = repetido(num); 
            } 
            
            while (repe != false); 
                usados.push(num); 
                return num; 
    } 

    else 
    { 
    return 0; 
    } 
}   


function repetido(num)
{ 
    var repe = false; 
        for (var i = 0; i < usados.length; i++) 
        {
            if (num == usados[i]) 
            { 
                repe = true; 
            } 
        } 
  return repe; 

}  



function clickCelda () 
    {
        for(var i = 0; i < dimensiones; i++)
        {
            for(var c = 0; c < dimensiones; c++)
            {
             $("#" + i + "_" + c).click(function(event)
                {
                  if (event.toElement.innerHTML==objetivo) 
                  {
                        $("#"+event.toElement.id).removeClass();
                        $("#"+event.toElement.id).addClass("animated rubberBand").css
                        ({
                             "color"              : 'white',
                             "background-color"   : "#268C9F",
                             "font-weight"        : "bold",
                             "border-radius"      : "15%"
                        });
                       
                        //console.log(event);
                             
                         objetivo++;
                        if (palabra!=huevoPascua) 
                        {
                            createjs.Sound.play("encontro_numero");   
                        };
                        
                        if ((objetivo%10)===0)
                        {
                            if (palabra!=huevoPascua) 
                            {
                              createjs.Sound.play("ouh_yeah");  
                              navigator.vibrate(500);
                            };
                        };

                        if (objetivo==121)
                        {
                            swal({   
                                    title   : "!Felicitaciones!",   
                                    text    : "Lo haz conseguido",
                                    imageUrl: "imagenes/like.png" 
                                });
                            navigator.vibrate(3000);
                            location.reload();
                        };


                        $("#objetivo").html("<i class='fa fa-eye'></i> "+objetivo);

    

                        //Validacion Huevo de Pascua
                        if (huevoPascuaPosicion.length==4) 
                        {
                            palabra=huevoPascuaPosicion.join();

                            if (palabra==huevoPascua)
                            {     
                                  ayudas=99;

                                  if (cancion) 
                                    {
                                      swal
                                      ({   
                                        title   : "!!Huevo de Pascua!!",   
                                        text    : "Encontrado",
                                        imageUrl: "imagenes/huevo.png" 
                                      });
                                      createjs.Sound.play("cancion",  { loop : "handleLoop" });
                                      cancion=false;
                                    };
                                 
                                  $("#"+event.toElement.id).addClass("animated rubberBand").css
                                  ({
                                      "color"              : 'white',
                                      "background-color"   : randomColor(),
                                      "font-weight"        : "bold",
                                      "border-radius"      : "15%"
                                  });
                
                                  $("header").css
                                  ({
                                      "background"     : randomColor(),
                                      "border-bottom"  : "15px solid "+randomColor()
                                  });
                                  
                                  $( "#tiempo" ).css('margin-left', '1.5%');
                                  $( "#volumen" ).css('margin-left', '1.5%'); 
                                  $( "#objetivo" ).css('margin-left', '1.5%');
                                  $( "ayuda" ).css('margin-left', '1.5%');
                                  $( "#salir" ).css('margin-left', '1.5%');
                            };
                        };
                  };

                   
                   if (event.toElement.id==="0_0"||event.toElement.id==="10_0"||event.toElement.id=="10_10"||event.toElement.id==="0_10")
                      {
                          huevoPascuaPosicion.push(event.toElement.id);
                      };
 
                });
            };
        };
    };



$("#play").click(function(event) 
  {
    mostrarOpciones();
    tiempo = setInterval(function()
      {
        cuentaTiempo++;
        if ((cuentaTiempo%20)===0)
          {
            if (palabra!=huevoPascua) 
              {
                createjs.Sound.play("reloj", {startTime: 0, duration: 3000});
              };
          };

        if((cuentaTiempo)%200===0)
          {
            navigator.vibrate(1000);
          }
    
        $("#tiempo").html("<div id = 'tiempo' > <i class='fa fa-clock-o fa-pulse'></i> "+cuentaTiempo+"'</div>");
      }, 1000);  
  });

 

$("#ayuda").click(function(event)
  {
    ayudas--;

    for (i=0; i<matriz.length; i++)
      {
        for (e=0; e<matriz.length; e++)
          {   
            if($('#'+i+"_"+e).html()==objetivo)
              {
                  $('#'+i+"_"+e).removeClass();
                  $('#'+i+"_"+e).addClass(animaciones[numeroAnimacion]).css
                  ({
                      "color"              : 'white',
                      "background-color"   : "#013D22",
                      "font-weight"        : "bold",
                      "border-radius"      : "15%"
                  });

                  numeroAnimacion++;
                  if (numeroAnimacion==6)
                    {
                      numeroAnimacion=0;
                    };

                  if (palabra!=huevoPascua) 
                    {
                      createjs.Sound.play("ayuda");
                    }; 

                   $("#ayuda").html("<i class = 'fa fa-heart faa-pulse animated-hover '></i>"+"x"+ayudas).css
                    ({
                       "font-size": '4em',
                       "font": 'normal normal normal FontAwesome'
                    });
              };

              if (ayudas===0) 
               {
                    $("#ayuda").hide();
                    swal
                      ({     
                          title               : "!OOOPPPS!",  
                          text                :"Se han acabado las ayudas.", 
                          showCancelButton    : false,   
                          confirmButtonColor  : "#DD6B55",  
                          confirmButtonText   : "Aceptar", 
                          closeOnConfirm      : false,
                          timer               : 5000,    
                          imageUrl            : "imagenes/sad.png"
                      });
                                
                    $( "#tiempo" ).css('margin-left', '8%');
                    $( "#volumen" ).css('margin-left', '8%'); 
                    $( "#objetivo" ).css('margin-left', '8%');
                    $( "#salir" ).css('margin-left', '8%');
                    navigator.vibrate(1000);
                };
          };
      };
  });


$("#info").click(function(event) 
  {
    swal({   
            title: "HOLA",   
            text: " Te saluda el gran Batman. Te voy a explicar en que consiste el juego",   
            imageUrl:"imagenes/batman.png", 
            showCancelButton: true,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "Siguiente",   
            cancelButtonText: "No, cancel plx!",   
            closeOnConfirm: false,   
            closeOnCancel: false 
          }, 
          function(isConfirm)
          {   
            if (isConfirm) 
              {    
                swal
                  ({   
                      title               : "Ayudame :(",   
                      text                : " HellBoy a desordenado mis números :(. ¿Me podrias ayudar? No soporto el desorden. Relax son POCOS :)",   
                      imageUrl            :"imagenes/batman.png", 
                      showCancelButton    : true,   
                      confirmButtonColor  : "#DD6B55",   
                      confirmButtonText   : "Siguiente",   
                      cancelButtonText    : "No, cancel plx!",   
                      closeOnConfirm      : false,   
                      closeOnCancel       : false 
                    }, 
                    function(isConfirm)
                      {   
                        if (isConfirm) 
                          {     
                            swal
                              ({   
                                  title               : "Play",   
                                  text                : "!Pulsa el boton play para comenzar a jugar :)!",   
                                  imageUrl            : "imagenes/play.png",   
                                  showCancelButton    : true,   
                                  confirmButtonColor  : "#DD6B55",   
                                  confirmButtonText   : "Siguiente",   
                                  cancelButtonText    : "No, cancel plx!",  
                                  closeOnConfirm      : false,   
                                  closeOnCancel       : false 
                                }, 
                                function(isConfirm)
                                  {
                                    if (isConfirm) 
                                      {     
                                        swal
                                          ({   
                                              title               : "Debes buscar el nùmero al lado del ojo",   
                                              text                : "Recuerda el ojo :D, el tiempo apremia entre mas rapido lo hagas mucho mejor",   
                                              imageUrl            : "imagenes/ojo.png",   
                                              showCancelButton    : true,   
                                              confirmButtonColor  : "#DD6B55",   
                                              confirmButtonText   : "Siguiente",   
                                              cancelButtonText    : "No, cancel plx!",   
                                              closeOnConfirm      : false,   
                                              closeOnCancel       : false 
                                            }, 
                                            function(isConfirm)
                                              {   
                                                if (isConfirm) 
                                                  {     
                                                    swal
                                                      ({   
                                                          title               : "Ayudas",   
                                                          text                : "Si en algun momento no encuentras un numero, utilizar ayudas te vendria bien. !!Clickea el corazon!!",  
                                                          imageUrl            : "imagenes/corazon.png",   
                                                          showCancelButton    : true,  
                                                          confirmButtonColor  : "#DD6B55",   
                                                          confirmButtonText   : "Siguiente",   
                                                          cancelButtonText    : "No, cancel plx!",   
                                                          closeOnConfirm      : false,   
                                                          closeOnCancel       : false 
                                                        }, 
                                                        function(isConfirm)
                                                          {   
                                                            if (isConfirm) 
                                                              {     
                                                                swal
                                                                  ({   
                                                                      title               : "¿Esta listo?",   
                                                                      text                : "Hagas, lo que hagas no le creas a HellBoy :). Adios",   
                                                                      imageUrl            : "imagenes/batman.png",   
                                                                      showCancelButton    : true,   
                                                                      confirmButtonColor  : "#DD6B55",   
                                                                      confirmButtonText   : "Siguiente",   
                                                                      cancelButtonText    : "No, cancel plx!",   
                                                                      closeOnConfirm      : false,   
                                                                      closeOnCancel       : false 
                                                                    }, 
                                                                    function(isConfirm)
                                                                      {   
                                                                        if (isConfirm) 
                                                                          {     
                                                                            swal
                                                                              ({   
                                                                                  title               : "Hola Amigo",   
                                                                                  text                : "Soy Hellboy, seguramente ya hablaste con Batman, y lo que te diria es que YO e desordenado sus numeros. !!ES MENTIRA!!",   
                                                                                  imageUrl            : "imagenes/hellboy.png",   
                                                                                  showCancelButton    : true,   
                                                                                  confirmButtonColor  : "#DD6B55",   
                                                                                  confirmButtonText   : "Siguiente",   
                                                                                  cancelButtonText    : "No, cancel plx!",   
                                                                                  closeOnConfirm      : false,   
                                                                                  closeOnCancel       : false 
                                                                                }, 
                                                                                function(isConfirm)
                                                                                  {   
                                                                                    if (isConfirm) 
                                                                                      {     
                                                                                        swal
                                                                                          ({   
                                                                                              title               : "Consejo",   
                                                                                              text                : "Las esquinas son una buena opcion para oprimir, pero todo tiene un orden recuerda.",   
                                                                                              imageUrl            : "imagenes/hellboy.png",   
                                                                                              showCancelButton    : true,   
                                                                                              confirmButtonColor  : "#DD6B55",   
                                                                                              confirmButtonText   : "Siguiente",   
                                                                                              cancelButtonText    : "No, cancel plx!",   
                                                                                              closeOnConfirm      : false,  
                                                                                              closeOnCancel       : false 
                                                                                            }, 
                                                                                            function(isConfirm)
                                                                                              {   
                                                                                                if (isConfirm) 
                                                                                                  {     
                                                                                                    swal
                                                                                                      ({   
                                                                                                          title               : "¿A quien apoyaras?",   
                                                                                                          imageUrl            : "imagenes/Rivales.png",   
                                                                                                          showCancelButton    : true,   
                                                                                                          confirmButtonColor  : "#DD6B55",   
                                                                                                          confirmButtonText   : "BATMAN",   
                                                                                                          cancelButtonText    : "HELLBOY",   
                                                                                                          closeOnConfirm      : false,   
                                                                                                          closeOnCancel       : false 
                                                                                                        }, 
                                                                                                        function(isConfirm)
                                                                                                          {   
                                                                                                            if (isConfirm) 
                                                                                                              {     
                                                                                                                swal
                                                                                                                  ({
                                                                                                                      title     :"Excelente", 
                                                                                                                      text      :"Destruyamos a HellBoy el desordena numeros.", 
                                                                                                                      imageUrl  :"imagenes/batman.png"
                                                                                                                  });   
                                                                                                              } 
                                                                                                              else 
                                                                                                                {     
                                                                                                                  swal
                                                                                                                    ({
                                                                                                                        title     :"Gracias por elegirme", 
                                                                                                                        text      :"Recuerda las esquinas :D", 
                                                                                                                        imageUrl  :"imagenes/hellboy.png"
                                                                                                    });   
                                                                                                    } 
                                                                                                    });   
                                                                                                    }       
                                                                                                    else 
                                                                                                    {     
                                                                                                    swal(":(", "Tu te lo pierdes", "error");   
                                                                                                    } 
                                                                                                    });   
                                                                                                    } 
                                                                                                    else 
                                                                                                    {     
                                                                                                    swal(":(", "Tu te lo pierdes", "error");  ;   
                                                                                                    } 
                                                                                                    });   
                                                                                                    } 
                                                                                                    else
                                                                                                    {
                                                                                                    swal(":(", "Tu te lo pierdes", "error");     
                                                                                                    } 
                                                                                                    });
                                                                                                    } 
                                                                                                    else
                                                                                                    {     
                                                                                                    swal(":(", "Tu te lo pierdes", "error");    
                                                                                                    } 
                                                                                                    });   
                                                                                                    } 
                                                                                                    else
                                                                                                    {
                                                                                                    swal(":(", "Tu te lo pierdes", "error");     
                                                                                                    } 
                                                                                                    });   
                                                                                                    } 
                                                                                                    else 
                                                                                                    {     
                                                                                                    swal(":(", "Tu te lo pierdes", "error");    
                                                                                                    } 
                                                                                                    });   
                                                                                                    } 
                                                                                                    else 
                                                                                                    {
                                                                                                    swal(":(", "Tu te lo pierdes", "error");     
                                                                                                    } 
                                                                                                    });
                                                                                                    } 
                                                                                                    else
                                                                                                    {
                                                                                                    swal(":(", "Tu te lo pierdes", "error");     
                                                                                                    } 
                                                                                                    });
                                                                                                    });










$("#salir").click(function(event)
  {
    createjs.Sound.play("rana");  
    swal({   
            title               : "¿Estas seguro?",   
            text                : "!Comenzara de nuevo el juego!",  
            type                : "warning",   
            showCancelButton    : true,   
            confirmButtonColor  : "#DD6B55",   
            confirmButtonText   : "Si, Reiniciar!",
            cancelButtonText    : "No, Cancelar please!",   
            closeOnConfirm      : false,   
            closeOnCancel       : false 
          },

        function(isConfirm)
        {   
          if (isConfirm) 
            {     
                createjs.Sound.stop("rana"); 
                createjs.Sound.play("salirse");  
                swal
                ({
                    title             : "Cargando",   
                    text              : "Recargando página...",   
                    showConfirmButton : false 
                });

                setTimeout("location.href='../loading/index.html'", 2000);
            } 
            else 
              {  
                createjs.Sound.stop("rana");  
                createjs.Sound.play("cancelar_salida");     
                swal
                ({
                    title   : "Reinicio Cancelado",   
                    text: ":)", 
                    type:"error",
                    timer:2200 
                });   
              }; 
        });
  });




$("#volumen").click(function(event) 
  {
    if (volumen==true)
    {
        $("#volumen").html("<i class='fa fa-volume-off faa-ring animated-hover fa-4x'></i>")
        volumen=false;
        createjs.Sound.muted = true;
    }
    else 
    {

      $("#volumen").html("<i class='fa fa-volume-up faa-ring animated-hover fa-4x'></i>")
      volumen=true;
      createjs.Sound.muted = false;
    };

  });



function cargarSonidos () 
  {
    var audios = [
                      
                      {
                          sonido  :   "cancelar_salida.mp3", 
                          label   :   "cancelar_salida"
                      }, 
                      {
                          sonido  :   "encontro_numero.mp3", 
                          label   :   "encontro_numero"
                      }, 
                      {
                          sonido  :   "loading.mp3", 
                          label   :   "loading"
                      }, 
                      {
                          sonido  :   "rana.mp3", 
                          label   :   "rana"
                      }, 
                      {
                          sonido  :   "salirse.mp3", 
                          label   :   "salirse"
                      }, 
                      {
                          sonido  :   "reloj.mp3", 
                          label   :   "reloj"
                      }, 
                      {
                          sonido  :   "doh.mp3", 
                          label   :   "fin_ayudas"
                      }, 
                      {
                          sonido  :   "ayuda.mp3", 
                          label   :   "ayuda"
                      }, 
                      {
                          sonido  :   "ouh_yeah.mp3", 
                          label   :   "ouh_yeah"
                      }, 
                      {
                          sonido  :   "Dancing_Police.mp3", 
                          label   :   "cancion"
                      }  
                  ];

    //Para cargar los audios del juego...
    for(var audio = 0; audio < audios.length; audio++)
    {
        createjs.Sound.registerSound("sonidos/" + audios[audio].sonido, audios[audio].label);
    };
  };


function parametrosIniciales ()
  {
    
    $("#escenario").hide();
    $("#tiempo").hide();
    $("#volumen").hide();
    $("#salir").hide();
    $("#ayuda").hide();
    $("#objetivo").hide();
  };

function mostrarOpciones () 
  {
    $("#play").hide('slow');
    $("#info").hide('slow');
    $("#escenario").show();
    $("#tiempo").css('display', 'inline-block').show();
    $("#volumen").css('display', 'inline-block').show();
    $("#salir").css('display', 'inline-block').show();
    $("#ayuda").css('display', 'inline-block').show();
    $("#objetivo").css('display', 'inline-block').show();
  };


function randomColor () 
    {
        // from http://www.paulirish.com/2009/random-hex-color-code-snippets/
        return '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] +
        (c && lol(m,s,c-1))})(Math,'0123456789ABCDEF',4);
    };

});
