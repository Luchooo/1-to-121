$(function () {
	var cuentaTiempo = 0;
	var total_numeros = 121;
	var usados = [];
	var dimensiones = 11;
	var mostrando = false;
	var objetivo = 1;
	var ayudas = 6;
	var alto = window.innerHeight;
	var ancho = window.innerWidth;
	var matriz = [[], [], [], [], [], [], [], [], [], [], []];
	var animaciones = [
		'animated tada',
		'animated flash',
		'animated wobble',
		'animated zoomIn',
		'animated rotateIn',
		'animated swing',
	];
	var numeroAnimacion = 0;
	var volumen = true;
	var palabra = 0;
	huevoPascuaPosicion = [];
	var huevoPascua = '0_0,0_10,10_10,10_0';
	var cancion = true;

	// Flag para evitar múltiples intentos de desbloqueo
	var audioUnlocked = false;

	// Intento de desbloquear audio en dispositivos que requieren interacción (iOS/Safari)
	function unlockAudio() {
		if (audioUnlocked) return;
		audioUnlocked = true;

		try {
			// Si CreateJS usa WebAudioPlugin, intentar reanudar el contexto
			if (window.createjs && createjs.Sound && createjs.Sound.activePlugin) {
				var plugin = createjs.Sound.activePlugin;
				if (plugin.context && typeof plugin.context.resume === 'function') {
					plugin.context.resume();
				}
			}
		} catch (e) {
			// no crítico
			console && console.log && console.log('unlockAudio resume error', e);
		}

		try {
			// Reproducir y detener inmediatamente un sonido registrado para "despertar" el sistema de audio
			if (window.createjs && createjs.Sound && createjs.Sound.play) {
				var inst = createjs.Sound.play('loading');
				// Si se creó la instancia, detenerla de inmediato
				if (inst && typeof inst.stop === 'function') {
					// Si la reproducción no ha comenzado, stop() la cancelará
					inst.stop();
				}
			}
		} catch (e) {
			console && console.log && console.log('unlockAudio play/stop error', e);
		}
	}

	// Ejecutar unlockAudio en el primer gesto del usuario (touchstart o click)
	$(document).one('touchstart click', function () {
		unlockAudio();
	});

	iniciarJuego();

	// Función para recalcular dimensiones cuando cambia el tamaño de la ventana
	function recalcularDimensiones() {
		alto = window.innerHeight;
		ancho = window.innerWidth;

		// Si el tablero ya existe, recalcular su tamaño
		if ($('#chess_board').length > 0) {
			var headerHeight = $('header').outerHeight() || 85;
			var availableHeight = alto - headerHeight - 20;
			var availableWidth = ancho - 20;

			var cellSize = Math.min(
				Math.floor(availableWidth / dimensiones),
				Math.floor(availableHeight / dimensiones)
			);

			cellSize = Math.max(cellSize, 20);

			var tableWidth = cellSize * dimensiones;
			var tableHeight = cellSize * dimensiones;
			var fontSize = Math.max(12, Math.min(35, Math.floor(cellSize * 0.4)));

			$('#chess_board').css({
				width: tableWidth + 'px',
				height: tableHeight + 'px',
				'font-size': fontSize + 'px',
				'line-height': cellSize + 'px',
			});

			$('#chess_board td').css({
				width: cellSize + 'px',
				height: cellSize + 'px',
			});
		}
	}

	// Listener para redimensionamiento de ventana
	$(window).on('resize orientationchange', function () {
		recalcularDimensiones();
	});

	// Variable global para el orden esperado del easter egg
	var ordenEsperado = ['0_0', '0_10', '10_10', '10_0'];

	function iniciarJuego() {
		parametrosIniciales();
		cargarSonidos();
		crearEscenario();
		llenarMatriz();
	}

	function llenarMatriz() {
		do {
			for (var i = 0; i < matriz.length; i++) {
				for (e = 0; e < matriz.length; e++) {
					matriz[i][e] = aleatorio(total_numeros);
				}
			}
		} while (matriz.length === 12);

		for (i = 0; i < matriz.length; i++) {
			for (e = 0; e < matriz.length; e++) {
				$('#' + i + '_' + e)
					.html(matriz[i][e])
					.css('color', randomColor());
			}
		}
	}

	function crearEscenario() {
		var txt = "<table id = 'chess_board' cellpadding = '0' cellspacing = '0' >";
		var divTabla = '';
		for (var i = 0; i < dimensiones; i++) {
			txt += '<tr>';
			for (var c = 0; c < dimensiones; c++) {
				divTabla = i + '_' + c;
				txt += "<td id = '" + divTabla + "'></td>";
			}
			txt += '</tr>';
		}
		txt += '</table>';
		$('#escenario').html(txt);

		// Recalcular dimensiones para asegurar que quepa en pantalla
		var headerHeight = $('header').outerHeight() || 85;
		var availableHeight = alto - headerHeight - 20; // 20px de margen
		var availableWidth = ancho - 20; // 10px margen a cada lado

		// Calcular tamaño de celda basado en el espacio disponible
		var cellSize = Math.min(
			Math.floor(availableWidth / dimensiones),
			Math.floor(availableHeight / dimensiones)
		);

		// Asegurar tamaño mínimo de celda
		cellSize = Math.max(cellSize, 20);

		var tableWidth = cellSize * dimensiones;
		var tableHeight = cellSize * dimensiones;

		// Calcular tamaño de fuente responsive
		var fontSize = Math.max(12, Math.min(35, Math.floor(cellSize * 0.4)));

		$('#chess_board').css({
			width: tableWidth + 'px',
			height: tableHeight + 'px',
			'max-width': '100%',
			'max-height': availableHeight + 'px',
			// "border"              : "1px solid red",
			'font-weight': 'bold',
			'font-family': 'Arial',
			'line-height': cellSize + 'px',
			cursor: 'pointer',
			'text-align': 'center',
			'font-size': fontSize + 'px',
			margin: '10px auto',
			display: 'block',
		});

		// Ajustar tamaño de celdas
		$('#chess_board td').css({
			width: cellSize + 'px',
			height: cellSize + 'px',
			padding: '0',
			'box-sizing': 'border-box',
		});

		clickCelda();
	}

	function aleatorio(min) {
		if (usados.length != min) {
			var num;
			var repe = false;
			do {
				var num = Math.floor(Math.random() * min + 1);
				repe = repetido(num);
			} while (repe != false);
			usados.push(num);
			return num;
		} else {
			return 0;
		}
	}

	function repetido(num) {
		var repe = false;
		for (var i = 0; i < usados.length; i++) {
			if (num == usados[i]) {
				repe = true;
			}
		}
		return repe;
	}

	function clickCelda() {
		for (var i = 0; i < dimensiones; i++) {
			for (var c = 0; c < dimensiones; c++) {
				$('#' + i + '_' + c).click(function (event) {
					var target = event.target || event.toElement || this;

					if (!target || !target.innerHTML) {
						return;
					}

					if (target.innerHTML == objetivo) {
						$('#' + target.id).removeClass();
						$('#' + target.id)
							.addClass('animated rubberBand')
							.css({
								color: 'white',
								'background-color': '#268C9F',
								'font-weight': 'bold',
								'border-radius': '15%',
							});

						objetivo++;
						if (palabra != huevoPascua) {
							createjs.Sound.play('encontro_numero');
						}

						if (objetivo % 10 === 0) {
							if (palabra != huevoPascua) {
								createjs.Sound.play('ouh_yeah');
								navigator.vibrate(500);
							}
						}

						if (objetivo == 122) {
							swal({
								title: '!Felicitaciones!',
								text: 'Lo haz conseguido en ' + cuentaTiempo + ' segundos',
								imageUrl: 'imagenes/like.png',
								timer: 5000,
							});
							navigator.vibrate(3000);
							setTimeout("location.href='loading/index.html'", 2000);
						}

						$('#objetivo-numero').text(objetivo);
					}

					// Detección y validación del Huevo de Pascua
					if (
						target &&
						target.id &&
						(target.id === '0_0' ||
							target.id === '10_0' ||
							target.id == '10_10' ||
							target.id === '0_10')
					) {
						// Verificar el orden esperado
						var siguienteEsperado = ordenEsperado[huevoPascuaPosicion.length];

						// Si es la siguiente esquina en el orden correcto, agregarla
						if (target.id === siguienteEsperado) {
							// Verificar que no esté duplicada (solo si ya tenemos al menos una)
							var esDuplicado = false;
							if (huevoPascuaPosicion.length > 0) {
								for (var h = 0; h < huevoPascuaPosicion.length; h++) {
									if (huevoPascuaPosicion[h] === target.id) {
										esDuplicado = true;
										break;
									}
								}
							}

							// Solo agregar si no es duplicado
							if (!esDuplicado) {
								huevoPascuaPosicion.push(target.id);

								// Verificar si se completó la secuencia
								if (huevoPascuaPosicion.length === 4) {
									palabra = huevoPascuaPosicion.join();

									if (palabra === huevoPascua) {
										ayudas = 999;

										// Actualizar visualmente el contador de ayudas inmediatamente
										$('#ayuda-texto').text('x' + ayudas);
										$('#ayuda').css('display', 'inline-block').show();

										if (cancion) {
											swal({
												title: '!!Huevo de Pascua!!',
												text: 'Encontrado',
												imageUrl: 'imagenes/huevo.png',
											});
											createjs.Sound.play('cancion', { loop: 'handleLoop' });
											cancion = false;
										}

										$('#' + target.id)
											.addClass('animated rubberBand')
											.css({
												color: 'white',
												'background-color': randomColor(),
												'font-weight': 'bold',
												'border-radius': '15%',
											});

										$('header').css({
											background: randomColor(),
											'border-bottom': '15px solid ' + randomColor(),
										});
									}
								}
							}
						} else {
							// Si no es la siguiente esquina en orden, reiniciar el array
							// Pero si es la primera esquina (0_0), empezar de nuevo
							if (target.id === '0_0') {
								huevoPascuaPosicion = ['0_0'];
							} else {
								huevoPascuaPosicion = [];
							}
						}
					}
				});
			}
		}
	}

	$('#play').click(function (event) {
		mostrarOpciones();
		tiempo = setInterval(function () {
			cuentaTiempo++;
			if (cuentaTiempo % 20 === 0) {
				if (palabra != huevoPascua) {
					createjs.Sound.play('reloj', { startTime: 0, duration: 3000 });
				}
			}

			if (cuentaTiempo % 200 === 0) {
				navigator.vibrate(1000);
			}

			$('#tiempo-texto').text(cuentaTiempo + "'");
		}, 1000);
	});

	$('#ayuda').click(function (event) {
		ayudas--;

		for (i = 0; i < matriz.length; i++) {
			for (e = 0; e < matriz.length; e++) {
				if ($('#' + i + '_' + e).html() == objetivo) {
					$('#' + i + '_' + e).removeClass();
					$('#' + i + '_' + e)
						.addClass(animaciones[numeroAnimacion])
						.css({
							color: 'white',
							'background-color': '#013D22',
							'font-weight': 'bold',
							'border-radius': '15%',
						});

					numeroAnimacion++;
					if (numeroAnimacion == 6) {
						numeroAnimacion = 0;
					}

					if (palabra != huevoPascua) {
						createjs.Sound.play('ayuda');
					}

					$('#ayuda-texto').text('x' + ayudas);
				}

				if (ayudas === 0) {
					$('#ayuda').hide();
					swal({
						title: '!OOOPPPS!',
						text: 'Se han acabado las ayudas.',
						showCancelButton: false,
						confirmButtonColor: '#DD6B55',
						confirmButtonText: 'Aceptar',
						closeOnConfirm: false,
						timer: 5000,
						imageUrl: 'imagenes/sad.png',
					});

					navigator.vibrate(1000);
				}
			}
		}
	});

	$('#info').click(function (event) {
		swal(
			{
				title: 'HOLA',
				text: ' Te saluda el gran Batman. Te voy a explicar en que consiste el juego',
				imageUrl: 'imagenes/batman.png',
				showCancelButton: true,
				confirmButtonColor: '#DD6B55',
				confirmButtonText: 'Siguiente',
				cancelButtonText: 'No, cancel plx!',
				closeOnConfirm: false,
				closeOnCancel: false,
			},
			function (isConfirm) {
				if (isConfirm) {
					swal(
						{
							title: 'Ayudame :(',
							text: ' HellBoy a desordenado mis números :(. ¿Me podrias ayudar? No soporto el desorden. Relax son POCOS :)',
							imageUrl: 'imagenes/batman.png',
							showCancelButton: true,
							confirmButtonColor: '#DD6B55',
							confirmButtonText: 'Siguiente',
							cancelButtonText: 'No, cancel plx!',
							closeOnConfirm: false,
							closeOnCancel: false,
						},
						function (isConfirm) {
							if (isConfirm) {
								swal(
									{
										title: 'Play',
										text: '!Pulsa el boton play para comenzar a jugar :)!',
										imageUrl: 'imagenes/play.png',
										showCancelButton: true,
										confirmButtonColor: '#DD6B55',
										confirmButtonText: 'Siguiente',
										cancelButtonText: 'No, cancel plx!',
										closeOnConfirm: false,
										closeOnCancel: false,
									},
									function (isConfirm) {
										if (isConfirm) {
											swal(
												{
													title: 'Debes buscar el nùmero al lado del ojo',
													text: 'Recuerda el ojo :D, el tiempo apremia entre mas rapido lo hagas mucho mejor',
													imageUrl: 'imagenes/ojo.png',
													showCancelButton: true,
													confirmButtonColor: '#DD6B55',
													confirmButtonText: 'Siguiente',
													cancelButtonText: 'No, cancel plx!',
													closeOnConfirm: false,
													closeOnCancel: false,
												},
												function (isConfirm) {
													if (isConfirm) {
														swal(
															{
																title: 'Ayudas',
																text: 'Si en algun momento no encuentras un numero, utilizar ayudas te vendria bien. !!Clickea el corazon!!',
																imageUrl: 'imagenes/corazon.png',
																showCancelButton: true,
																confirmButtonColor: '#DD6B55',
																confirmButtonText: 'Siguiente',
																cancelButtonText: 'No, cancel plx!',
																closeOnConfirm: false,
																closeOnCancel: false,
															},
															function (isConfirm) {
																if (isConfirm) {
																	swal(
																		{
																			title: '¿Esta listo?',
																			text: 'Hagas, lo que hagas no le creas a HellBoy :). Adios',
																			imageUrl: 'imagenes/batman.png',
																			showCancelButton: true,
																			confirmButtonColor: '#DD6B55',
																			confirmButtonText: 'Siguiente',
																			cancelButtonText: 'No, cancel plx!',
																			closeOnConfirm: false,
																			closeOnCancel: false,
																		},
																		function (isConfirm) {
																			if (isConfirm) {
																				swal(
																					{
																						title: 'Hola Amigo',
																						text: 'Soy Hellboy, seguramente ya hablaste con Batman, y lo que te diria es que YO e desordenado sus numeros. !!ES MENTIRA!!',
																						imageUrl: 'imagenes/hellboy.png',
																						showCancelButton: true,
																						confirmButtonColor: '#DD6B55',
																						confirmButtonText: 'Siguiente',
																						cancelButtonText: 'No, cancel plx!',
																						closeOnConfirm: false,
																						closeOnCancel: false,
																					},
																					function (isConfirm) {
																						if (isConfirm) {
																							swal(
																								{
																									title: 'Consejo',
																									text: 'Las esquinas son una buena opcion para oprimir, pero todo tiene un orden recuerda.',
																									imageUrl:
																										'imagenes/hellboy.png',
																									showCancelButton: true,
																									confirmButtonColor: '#DD6B55',
																									confirmButtonText:
																										'Siguiente',
																									cancelButtonText:
																										'No, cancel plx!',
																									closeOnConfirm: false,
																									closeOnCancel: false,
																								},
																								function (isConfirm) {
																									if (isConfirm) {
																										swal(
																											{
																												title:
																													'¿A quien apoyaras?',
																												imageUrl:
																													'imagenes/rivales.png',
																												showCancelButton: true,
																												confirmButtonColor:
																													'#DD6B55',
																												confirmButtonText:
																													'BATMAN',
																												cancelButtonText:
																													'HELLBOY',
																												closeOnConfirm: false,
																												closeOnCancel: false,
																											},
																											function (isConfirm) {
																												if (isConfirm) {
																													swal({
																														title: 'Excelente',
																														text: 'Destruyamos a HellBoy el desordena numeros.',
																														imageUrl:
																															'imagenes/batman.png',
																													});
																												} else {
																													swal({
																														title:
																															'Gracias por elegirme',
																														text: 'Recuerda las esquinas :D',
																														imageUrl:
																															'imagenes/hellboy.png',
																													});
																												}
																											}
																										);
																									} else {
																										swal(
																											':(',
																											'Tu te lo pierdes',
																											'error'
																										);
																									}
																								}
																							);
																						} else {
																							swal(
																								':(',
																								'Tu te lo pierdes',
																								'error'
																							);
																						}
																					}
																				);
																			} else {
																				swal(':(', 'Tu te lo pierdes', 'error');
																			}
																		}
																	);
																} else {
																	swal(':(', 'Tu te lo pierdes', 'error');
																}
															}
														);
													} else {
														swal(':(', 'Tu te lo pierdes', 'error');
													}
												}
											);
										} else {
											swal(':(', 'Tu te lo pierdes', 'error');
										}
									}
								);
							} else {
								swal(':(', 'Tu te lo pierdes', 'error');
							}
						}
					);
				} else {
					swal(':(', 'Tu te lo pierdes', 'error');
				}
			}
		);
	});

	$('#follow_me_github').click(function (event) {
		window.open('https://github.com/Luchooo', '_blank');
	});

	$('#salir').click(function (event) {
		createjs.Sound.play('rana');
		swal(
			{
				title: '¿Estas seguro?',
				text: '!Comenzara de nuevo el juego!',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#DD6B55',
				confirmButtonText: 'Si, Reiniciar!',
				cancelButtonText: 'No, Cancelar please!',
				closeOnConfirm: false,
				closeOnCancel: false,
			},

			function (isConfirm) {
				if (isConfirm) {
					createjs.Sound.stop('rana');
					createjs.Sound.play('salirse');
					swal({
						title: 'Cargando',
						text: 'Recargando página...',
						showConfirmButton: false,
					});

					setTimeout("location.href='loading/index.html'", 2000);
				} else {
					createjs.Sound.stop('rana');
					createjs.Sound.play('cancelar_salida');
					swal({
						title: 'Reinicio Cancelado',
						text: ':)',
						type: 'error',
						timer: 2200,
					});
				}
			}
		);
	});

	$('#volumen').click(function (event) {
		if (volumen == true) {
			$('#volumen').html(
				"<i class='fa fa-volume-off faa-ring animated-hover fa-4x'></i>"
			);
			volumen = false;
			createjs.Sound.muted = true;
		} else {
			$('#volumen').html(
				"<i class='fa fa-volume-up faa-ring animated-hover fa-4x'></i>"
			);
			volumen = true;
			createjs.Sound.muted = false;
		}
	});

	function cargarSonidos() {
		var audios = [
			{
				sonido: 'cancelar_salida.mp3',
				label: 'cancelar_salida',
			},
			{
				sonido: 'encontro_numero.mp3',
				label: 'encontro_numero',
			},
			{
				sonido: 'loading.mp3',
				label: 'loading',
			},
			{
				sonido: 'rana.mp3',
				label: 'rana',
			},
			{
				sonido: 'salirse.mp3',
				label: 'salirse',
			},
			{
				sonido: 'reloj.mp3',
				label: 'reloj',
			},
			{
				sonido: 'doh.mp3',
				label: 'fin_ayudas',
			},
			{
				sonido: 'ayuda.mp3',
				label: 'ayuda',
			},
			{
				sonido: 'ouh_yeah.mp3',
				label: 'ouh_yeah',
			},
			{
				sonido: 'Dancing_Police.mp3',
				label: 'cancion',
			},
		];

		//Para cargar los audios del juego...
		for (var audio = 0; audio < audios.length; audio++) {
			createjs.Sound.registerSound(
				'sonidos/' + audios[audio].sonido,
				audios[audio].label
			);
		}
	}

	function parametrosIniciales() {
		$('#escenario').hide();
		$('#tiempo').hide();
		$('#volumen').hide();
		$('#salir').hide();
		$('#ayuda').hide();
		$('#objetivo').hide();
		$('#share').hide();
	}

	function mostrarOpciones() {
		$('#play').hide('slow');
		$('#info').hide('slow');
		$('#escenario').show();
		$('#tiempo').css('display', 'inline-block').show();
		$('#volumen').css('display', 'inline-block').show();
		$('#salir').css('display', 'inline-block').show();
		$('#ayuda').css('display', 'inline-block').show();
		$('#objetivo').css('display', 'inline-block').show();
		$('#share').css('display', 'inline-block').show();
	}

	function randomColor() {
		// from http://www.paulirish.com/2009/random-hex-color-code-snippets/
		return (
			'#' +
			(function lol(m, s, c) {
				return s[m.floor(m.random() * s.length)] + (c && lol(m, s, c - 1));
			})(Math, '0123456789ABCDEF', 4)
		);
	}
});
