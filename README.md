# 🎮 1 TO 121 - Juego de Números

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Desktop-lightgrey.svg)

Un juego web interactivo donde debes encontrar los números del 1 al 121 en orden dentro de una cuadrícula de 11x11. ¡Pon a prueba tu velocidad y concentración!

## 📋 Descripción

**1 TO 121** es un juego de búsqueda numérica donde el objetivo es encontrar y hacer clic en los números en orden secuencial (1, 2, 3... hasta 121) lo más rápido posible. El juego presenta una cuadrícula de 11x11 con números aleatorios distribuidos, y tu misión es encontrar el número objetivo que se muestra junto al ícono del ojo 👁️.

## 🎯 Objetivo del Juego

Encuentra todos los números del **1 al 121** en orden secuencial dentro de la cuadrícula. El juego mide tu tiempo y te desafía a completarlo lo más rápido posible.

## 🎮 Características

- **Cuadrícula 11x11**: 121 números aleatorios distribuidos en una tabla
- **Sistema de ayudas**: 6 ayudas disponibles que resaltan el número objetivo
- **Contador de tiempo**: Registra cuánto tardas en completar el juego
- **Efectos de sonido**: Sonidos para cada acción (encontrar número, ayuda, etc.)
- **Animaciones**: Efectos visuales al encontrar números correctos
- **Huevo de Pascua**: Easter egg oculto con recompensas especiales (ver sección de características especiales)
- **Diseño responsive**: Se adapta al tamaño de tu pantalla (móvil y escritorio)
- **Interfaz intuitiva**: Controles simples y claros

## 🚀 Cómo Jugar

### Inicio Rápido

1. **Inicia un servidor local** (necesario para evitar errores de CORS):

   **Opción A - VS Code:**

   - Instala la extensión "Live Server"
   - Haz clic derecho en `index.html` → "Open with Live Server"

2. **Abre tu navegador** en: `http://localhost:8000/index.html`

3. **Haz clic en el botón Play** ▶️ para comenzar

### Instrucciones de Juego

1. **Busca el número objetivo**: Mira el número que aparece junto al ícono del ojo 👁️
2. **Haz clic en el número correcto**: Encuentra y haz clic en ese número en la cuadrícula
3. **Continúa en orden**: El siguiente número objetivo aparecerá automáticamente
4. **Usa las ayudas si es necesario**: Haz clic en el corazón ❤️ para que el juego resalte el número objetivo (tienes 6 ayudas)
5. **Completa del 1 al 121**: ¡Sé el más rápido!

### Controles

- **▶️ Play**: Inicia el juego y el cronómetro
- **👁️ Objetivo**: Muestra el número que debes encontrar
- **❤️ Ayuda (x6)**: Resalta el número objetivo en la cuadrícula
- **🔊 Volumen**: Activa/desactiva los sonidos
- **ℹ️ Info**: Muestra las instrucciones del juego
- **❌ Salir**: Reinicia el juego (te lleva a la pantalla de carga y luego vuelve al inicio)

## 🏗️ Estructura del Proyecto

```
juego_pc/
├── index.html              # Archivo principal del juego
├── README.md               # Este archivo
│
├── css/                    # Estilos
│   ├── estilos.css
│   ├── sweetalert.css
│   ├── animation.css
│   └── animate.css
│
├── js/                     # Scripts JavaScript
│   ├── script.js           # Lógica principal del juego
│   ├── jquery-1.11.3.min.js
│   ├── sweetalert.min.js
│   └── createjs-2015.05.21.min.js
│
├── imagenes/               # Imágenes del juego
│   ├── batman.png
│   ├── hellboy.png
│   ├── like.png
│   └── ...
│
├── sonidos/                # Archivos de audio
│   ├── encontro_numero.mp3
│   ├── ayuda.mp3
│   └── ...
│
└── loading/                # Pantalla de carga/transición
    ├── index.html          # Pantalla de carga que redirige al juego
    ├── js/
    │   └── index.js         # Script que redirige a index.html después de 6 segundos
    └── css/
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura del juego
- **CSS3**: Estilos y animaciones
- **JavaScript/jQuery**: Lógica del juego
- **CreateJS**: Manejo de sonidos
- **SweetAlert**: Alertas y diálogos
- **Font Awesome**: Iconos
- **Animate.css**: Animaciones CSS

## 📦 Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)

### Opción 1: VS Code Live Server

- Instala la extensión "Live Server"
- Haz clic derecho en `index.html` → "Open with Live Server"

## 🎨 Características Especiales

### Huevo de Pascua 🥚 (Easter Egg)

El juego incluye un easter egg oculto que puedes activar siguiendo un patrón específico. ¡Descúbrelo y obtén recompensas especiales!

#### 🎯 Cómo activarlo:

Para activar el easter egg, debes hacer clic en las **4 esquinas de la cuadrícula** en el siguiente orden exacto:

1. **Esquina superior izquierda** (0,0)
2. **Esquina inferior izquierda** (0,10)
3. **Esquina inferior derecha** (10,10)
4. **Esquina superior derecha** (10,0)

**Importante:** Debes hacer clic en estas esquinas **en este orden específico** mientras juegas. No necesitas hacer clic en los números correctos, solo tocar las esquinas en el orden indicado.

#### 🎁 Recompensas al activarlo:

Cuando activas el easter egg, obtienes:

- ✨ **Ayudas ilimitadas**: Tus ayudas se convierten en 999 (prácticamente ilimitadas)
- 🎵 **Música especial**: Se reproduce una canción temática en bucle
- 🎨 **Efectos visuales**: El header cambia de color aleatoriamente
- 🎉 **Mensaje especial**: Aparece una notificación confirmando que encontraste el easter egg
- 🔇 **Sonidos desactivados**: Los sonidos normales del juego se silencian mientras el easter egg está activo

#### 💡 Consejos:

- Puedes activar el easter egg en cualquier momento durante el juego
- Una vez activado, permanece activo durante toda la partida
- El easter egg solo se puede activar una vez por partida
- ¡Experimenta y diviértete descubriendo este secreto oculto!

### Sistema de Puntuación

- El juego registra tu tiempo en segundos
- Intenta completarlo lo más rápido posible
- Cada 10 números encontrados, recibirás una señal especial

### Efectos Visuales

- Animaciones al encontrar números correctos
- Colores aleatorios para cada número
- Efectos de transición suaves
- Feedback visual inmediato

## 👨‍💻 Autor

**Luis Sánchez**

- GitHub: [Luchooo](https://github.com/Luchooo)

## 📝 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y personal.

## 🎯 Versión

**Versión Escritorio 1.0** - 1 To 121

---

¡Diviértete jugando y desafía a tus amigos a ver quién completa el juego más rápido! 🚀
