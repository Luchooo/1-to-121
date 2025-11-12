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
	// El valor real de `huevoPascua` (la secuencia de esquinas) se calcula
	// dinámicamente en `setDimensions()` para soportar tamaños de cuadrícula
	// distintos a 11x11.
	var huevoPascua = '';
	var cancion = true;

	// timer handle
	var tiempo = null;

	// Helper to set grid dimensions and reset related variables (no UI creation)
	function setDimensions(n) {
		dimensiones = Number(n) || 11;
		total_numeros = dimensiones * dimensiones;
		// recreate matriz structure
		matriz = [];
		for (var i = 0; i < dimensiones; i++) {
			matriz[i] = [];
		}
		// reset objetivo and ayudas to defaults
		objetivo = 1;
		ayudas = 6;
		$('#objetivo-numero').text(objetivo);
		$('#ayuda-texto').text('x' + ayudas);
		// reset egg tracking
		huevoPascuaPosicion = [];
		palabra = 0;
		// actualizar orden esperado para el huevo de pascua según dimensiones
		var last = dimensiones - 1;
		ordenEsperado = ['0_0', '0_' + last, last + '_' + last, last + '_0'];
		// también actualizamos la representación en cadena que se usa para
		// comparar la secuencia encontrada (palabra)
		huevoPascua = ordenEsperado.join();
	}

	// Flags para control de audio
	var audioUnlocked = false;
	var soundsRegistered = false; // indica si ya se registraron los sonidos

	// Asegura que los sonidos estén registrados y el audio desbloqueado.
	function ensureAudioReady() {
		// Registrar sonidos (esto puede crear el AudioContext, por eso lo hacemos dentro de
		// un gesto del usuario)
		if (!soundsRegistered) {
			cargarSonidos();
			soundsRegistered = true;
		}
		// Intentar reanudar el contexto y "despertar" el audio
		unlockAudio();
	}

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

	// Ejecutar ensureAudioReady en el primer gesto del usuario (touchstart o click)
	$(document).one('touchstart click', function () {
		ensureAudioReady();
	});

	// mark welcome active so UI can hide irrelevant controls
	$('body').addClass('welcome-active');

	// Handlers for welcome overlay buttons
	$(document).on('click', '#welcome-play', function (e) {
		e.preventDefault();
		try {
			ensureAudioReady();
		} catch (err) {}
		// read difficulty selection and apply
		var sel = $('#difficulty').val();
		setDimensions(sel);

		// remove welcome-active state and start the game
		$('body').removeClass('welcome-active');
		// hide overlay then trigger play flow
		$('#welcome').fadeOut(300, function () {
			$('#play').click();
		});
	});

	$(document).on('click', '#welcome-info', function (e) {
		e.preventDefault();
		// Show the same info modal as #info
		$('#info').click();
	});

	$(document).on('click', '#welcome-author', function (e) {
		e.preventDefault();
		window.open('https://github.com/Luchooo', '_blank');
	});

	$(document).on('click', '#welcome-sound', function (e) {
		e.preventDefault();
		// Toggle volume and reflect icon
		try {
			ensureAudioReady();
		} catch (err) {}
		$('#volumen').click();
		// sync icon on welcome button
		setTimeout(function () {
			if (createjs && createjs.Sound && createjs.Sound.muted) {
				$('#welcome-sound .fa')
					.removeClass('fa-volume-up')
					.addClass('fa-volume-off');
			} else {
				$('#welcome-sound .fa')
					.removeClass('fa-volume-off')
					.addClass('fa-volume-up');
			}
		}, 50);
	});

	// Bottom bar button mappings (for small devices)
	$(document).on('click', '#bottom-play', function (e) {
		e.preventDefault();
		try {
			ensureAudioReady();
		} catch (err) {}
		// hide welcome if visible and remove welcome-active
		$('body').removeClass('welcome-active');
		$('#welcome').fadeOut(200);
		// trigger existing play
		$('#play').click();
	});

	$(document).on('click', '#bottom-vol', function (e) {
		e.preventDefault();
		$('#volumen').click();
		setTimeout(syncBottomVolumeIcon, 50);
	});

	$(document).on('click', '#bottom-ayuda', function (e) {
		e.preventDefault();
		$('#ayuda').click();
	});
	$(document).on('click', '#bottom-salir', function (e) {
		e.preventDefault();
		$('#salir').click();
	});

	// Keep bottom objective number in sync
	function syncBottomObjective() {
		var val = $('#objetivo-numero').text() || $('#bottom-objetivo-num').text();
		$('#bottom-objetivo-num').text(val);
	}
	// Sync volume icon helper
	function syncBottomVolumeIcon() {
		var muted = createjs && createjs.Sound && createjs.Sound.muted;
		var $i = $('#bottom-vol i');
		if (muted) {
			$i.removeClass('fa-volume-up').addClass('fa-volume-off');
		} else {
			$i.removeClass('fa-volume-off').addClass('fa-volume-up');
		}
	}

	// observe changes to objetivo number occasionally (simple interval)
	setInterval(syncBottomObjective, 500);
	setInterval(syncBottomVolumeIcon, 800);

	// initialize UI state and defaults but do NOT create the board until Play
	parametrosIniciales();
	// set default dimensions in memory (11x11) but don't create UI yet
	setDimensions(dimensiones);

	// Función para recalcular dimensiones cuando cambia el tamaño de la ventana
	function recalcularDimensiones() {
		alto = window.innerHeight;
		ancho = window.innerWidth;

		// Si el tablero ya existe, recalcular su tamaño
		if ($('#chess_board').length > 0) {
			var headerHeight = $('header').outerHeight() || 85;
			// restar la altura de la bottom-bar si está visible (en mobile game-mode)
			var bottomBarHeight = $('.bottom-bar').is(':visible')
				? $('.bottom-bar').outerHeight()
				: 0;
			var availableHeight = alto - headerHeight - bottomBarHeight - 20;
			var availableWidth = ancho - 20;

			// Cuando el ancho es mayor a 927px, priorizamos el cálculo por ancho
			// para que la grilla mantenga proporción basada en el ancho de la ventana.
			// Aún así, aplicamos un mínimo razonable para evitar celdas demasiado pequeñas.
			var cellSizeByWidth = Math.floor(availableWidth / dimensiones);
			var cellSizeByHeight = Math.floor(availableHeight / dimensiones);
			var cellSize;
			if (ancho > 927) {
				cellSize = cellSizeByWidth;
			} else {
				cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
			}

			// Limitar tamaño máximo del tablero para evitar que crezca demasiado en pantallas muy anchas
			var MAX_TABLE_WIDTH = 880; // coincide con el CSS para pantallas grandes
			if (cellSize * dimensiones > MAX_TABLE_WIDTH) {
				cellSize = Math.floor(MAX_TABLE_WIDTH / dimensiones);
			}

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
		crearEscenario();
		llenarMatriz();
	}

	function llenarMatriz() {
		// reset used numbers and fill matrix with unique numbers from 1..total_numeros
		usados = [];
		for (var i = 0; i < dimensiones; i++) {
			for (var e = 0; e < dimensiones; e++) {
				matriz[i][e] = aleatorio(total_numeros);
			}
		}

		for (var i2 = 0; i2 < dimensiones; i2++) {
			for (var e2 = 0; e2 < dimensiones; e2++) {
				$('#' + i2 + '_' + e2)
					.html(matriz[i2][e2])
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
		var bottomBarHeight = $('.bottom-bar').is(':visible')
			? $('.bottom-bar').outerHeight()
			: 0;
		var availableHeight = alto - headerHeight - bottomBarHeight - 20; // 20px de margen
		var availableWidth = ancho - 20; // 10px margen a cada lado

		// Calcular tamaño de celda basado en el espacio disponible
		var cellSizeByWidth = Math.floor(availableWidth / dimensiones);
		var cellSizeByHeight = Math.floor(availableHeight / dimensiones);
		var cellSize;
		// Priorizar ancho en pantallas anchas para mantener proporción del tablero
		if (ancho > 927) {
			cellSize = cellSizeByWidth;
		} else {
			cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
		}

		// Limitar tamaño máximo del tablero para evitar que crezca demasiado en pantallas muy anchas
		var MAX_TABLE_WIDTH = 880; // coincide con el CSS para pantallas grandes
		if (cellSize * dimensiones > MAX_TABLE_WIDTH) {
			cellSize = Math.floor(MAX_TABLE_WIDTH / dimensiones);
		}

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
			// cuando priorizamos el ancho, permitimos que el alto se ajuste para
			// mantener la proporción; max-height se mantiene para evitar desbordes
			// extremos en pantallas muy pequeñas
			'max-height': Math.max(availableHeight, tableHeight) + 'px',
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
				(function (ii, cc) {
					$('#' + ii + '_' + cc)
						.off('click')
						.on('click', function (event) {
							var target = event.target || event.toElement || this;
							try {
								ensureAudioReady();
							} catch (e) {}

							if (!target || !target.innerHTML) return;

							// Selección correcta
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
								if (palabra != huevoPascua)
									createjs.Sound.play('encontro_numero');
								if (objetivo % 10 === 0 && palabra != huevoPascua) {
									createjs.Sound.play('ouh_yeah');
									navigator.vibrate(500);
								}

								if (objetivo == total_numeros + 1) {
									// Mostrar modal de victoria con opciones para compartir o reiniciar.
									var timeText =
										'Lo haz conseguido en ' + cuentaTiempo + ' segundos';
									var content =
										'<div style="text-align:center;">' +
										'<p style="font-size:16px;margin:8px 0;">' +
										timeText +
										'</p>' +
										'<img src="imagenes/like.png" style="width:96px;height:96px;margin:8px 0;"/>' +
										'<div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">' +
										'<button id="share-browser" class="swal-btn" style="padding:8px 12px;border-radius:8px;border:0;background:#2bb1c0;color:#fff;">Compartir (navegador)</button>' +
										'<button id="share-whatsapp" class="swal-btn" style="padding:8px 12px;border-radius:8px;border:0;background:#25D366;color:#fff;">Compartir WhatsApp</button>' +
										'<button id="share-screenshot" class="swal-btn" style="padding:8px 12px;border-radius:8px;border:0;background:#6b5b95;color:#fff;">Compartir con imagen</button>' +
										'<button id="restart-game" class="swal-btn" style="padding:8px 12px;border-radius:8px;border:0;background:#DD6B55;color:#fff;">Reiniciar</button>' +
										'</div></div>';

									swal({
										title: '!Felicitaciones!',
										text: content,
										html: true,
										showConfirmButton: false,
									});

									navigator.vibrate && navigator.vibrate(300);

									// Helper: cargar html2canvas si hace falta
									function loadHtml2Canvas(cb) {
										if (window.html2canvas) return cb();
										var s = document.createElement('script');
										s.src =
											'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
										s.onload = function () {
											cb();
										};
										s.onerror = function () {
											cb(new Error('failed to load html2canvas'));
										};
										document.head.appendChild(s);
									}

									// Share text via Web Share API or fallback copy
									function shareText(text, url) {
										if (navigator.share) {
											navigator
												.share({ title: '1-to-121', text: text, url: url })
												.catch(function (e) {});
										} else {
											// fallback: open share via dialog to copy or WhatsApp
											var copy = document.createElement('textarea');
											copy.value = text + (url ? '\n' + url : '');
											document.body.appendChild(copy);
											copy.select();
											document.execCommand('copy');
											document.body.removeChild(copy);
											alert('Texto copiado al portapapeles: ' + text);
										}
									}

									// Share via WhatsApp
									function shareWhatsApp(text) {
										var url =
											'https://api.whatsapp.com/send?text=' +
											encodeURIComponent(
												text + '\nhttps://1-to-121.vercel.app'
											);
										window.open(url, '_blank');
									}

									// Share screenshot using html2canvas and Web Share API (if supports files)
									function shareScreenshot(text) {
										loadHtml2Canvas(function (err) {
											if (err) {
												// fallback to share text only
												return shareText(text, 'https://1-to-121.vercel.app');
											}
											var target =
												document.querySelector('#escenario') || document.body;
											window
												.html2canvas(target, { scale: 1 })
												.then(function (canvas) {
													canvas.toBlob(function (blob) {
														var file = new File([blob], '1-to-121-score.png', {
															type: 'image/png',
														});
														if (
															navigator.canShare &&
															navigator.canShare({ files: [file] })
														) {
															navigator
																.share({
																	files: [file],
																	title: '1-to-121',
																	text: text,
																})
																.catch(function (e) {
																	// fallback to opening image in new tab
																	var url = URL.createObjectURL(blob);
																	window.open(url, '_blank');
																});
														} else {
															// no file-sharing support: open image in new tab so user can save/share manually
															var url = URL.createObjectURL(blob);
															window.open(url, '_blank');
														}
													});
												});
										});
									}

									// attach handlers to buttons inside swal (after short delay to ensure DOM)
									setTimeout(function () {
										$('#share-whatsapp')
											.off('click')
											.on('click', function () {
												shareWhatsApp(
													'He completado 1-to-121 en ' +
														cuentaTiempo +
														' segundos!'
												);
											});
										$('#share-browser')
											.off('click')
											.on('click', function () {
												shareText(
													'He completado 1-to-121 en ' +
														cuentaTiempo +
														' segundos!',
													'https://1-to-121.vercel.app'
												);
											});
										$('#share-screenshot')
											.off('click')
											.on('click', function () {
												shareScreenshot(
													'He completado 1-to-121 en ' +
														cuentaTiempo +
														' segundos!'
												);
											});
										$('#restart-game')
											.off('click')
											.on('click', function () {
												swal.close();
												setTimeout(function () {
													location.href = 'loading/index.html';
												}, 300);
											});
									}, 60);
								}

								$('#objetivo-numero').text(objetivo);
							}

							// Detección del Huevo de Pascua (esquinas, adaptativo a dimensiones)
							if (target && target.id) {
								var last = dimensiones - 1;
								var corners = [
									'0_0',
									'0_' + last,
									last + '_' + last,
									last + '_0',
								];
								if (corners.indexOf(target.id) !== -1) {
									var siguienteEsperado =
										ordenEsperado[huevoPascuaPosicion.length];
									if (target.id === siguienteEsperado) {
										if (huevoPascuaPosicion.indexOf(target.id) === -1) {
											huevoPascuaPosicion.push(target.id);
											if (huevoPascuaPosicion.length === 4) {
												palabra = huevoPascuaPosicion.join();
												if (palabra === huevoPascua) {
													ayudas = 999;
													$('#ayuda-texto').text('x' + ayudas);
													$('#ayuda').css('display', 'inline-block').show();
													if (cancion) {
														swal({
															title: '!!Huevo de Pascua!!',
															text: 'Encontrado',
															imageUrl: 'imagenes/huevo.png',
														});
														createjs.Sound.play('cancion', {
															loop: 'handleLoop',
														});
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
										if (target.id === '0_0') {
											huevoPascuaPosicion = ['0_0'];
										} else {
											huevoPascuaPosicion = [];
										}
									}
								}
							}
						});
				})(i, c);
			}
		}
	}

	$('#play').click(function (event) {
		// asegurar audio listo cuando el usuario pulsa Play
		try {
			ensureAudioReady();
		} catch (e) {
			/* noop */
		}

		// prevent duplicate timers if Play is pressed multiple times
		if (tiempo) {
			clearInterval(tiempo);
			tiempo = null;
		}

		// Mostrar las opciones/estado de juego primero para que las clases y
		// estilos (header fijo, padding, bottom-bar) estén presentes antes de
		// crear el tablero y calcular tamaños. Esto evita que el tablero se
		// dimensione con el header sin fijar y luego quede tapado.
		mostrarOpciones();

		// crear/actualizar tablero según la dimensión actual y preparar UI
		crearEscenario();
		llenarMatriz();
		recalcularDimensiones();

		// reset timer counter
		cuentaTiempo = 0;

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
		// asegurar audio listo al usar ayuda
		try {
			ensureAudioReady();
		} catch (e) {
			/* noop */
		}
		// si las ayudas son infinitas (e.g. huevo de pascua -> 999), permitir
		if (ayudas !== 999) {
			// evitar que baje por debajo de 0
			if (ayudas <= 0) {
				ayudas = 0;
				$('#ayuda-texto').text('x' + ayudas);
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
				return; // no hay ayudas, salir
			}

			// consumir una ayuda
			ayudas--;
		}

		// aplicar la ayuda: buscar la celda con el objetivo y resaltarla (solo una vez)
		var encontrada = false;
		for (var i = 0; i < matriz.length && !encontrada; i++) {
			for (var e = 0; e < matriz.length && !encontrada; e++) {
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
					encontrada = true;
				}
			}
		}

		// si tras consumir la ayuda nos quedamos en 0, ocultar y avisar
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
		// asegurar audio listo al iniciar proceso de salir
		try {
			ensureAudioReady();
		} catch (e) {
			/* noop */
		}
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
		// ensure game-mode is removed when in initial params
		$('body').removeClass('game-mode');
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
		// mark that game UI is active: simplify header and show bottom bar on mobile
		$('body').addClass('game-mode');
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
