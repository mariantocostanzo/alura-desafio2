const startGame = document.getElementById("iniciar-juego"),
inputText = document.getElementById("input-text"),
addBtn = document.getElementById("add-Btn"),
underscore = document.getElementById("underscore"),
clue = document.getElementById("clue"),
myKeyboard = document.getElementById("keyboard"),
home = document.getElementById("home"),
playAgain = document.getElementById("retry"),
alfabeto = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let arregloPalabras = ["APPLE",
    "LIVERPOOL",
    "UNCHARTED",
    "RIVENDELL",
    "TOM-RIDDLE",
    "NINTENDO",
    "TESLA",
    "JOHN-LENNON",
    "LINUS-TORVALDS",
    "JAMES-WEBB"],

pistas = ["una empresa icónica de Cupertino, California",
    "es un equipo del fútbol inglés muy reconocido ",
    "una saga de videojuegos muy famosa",
    "un valle de la tierra media",
    "antagonista de la saga de Harry Potter",
    "es la casa de un famoso fontanero",
    "apellido de un legendario inventor",
    "ex integrante de los Beatles",
    "ingeniero de software finlandés",
    "telescopio lanzado recientemente al espacio"],

// Inicialización de variables 
letras,
lista,
numeroAleatorio,
palabraSeleccionada,
intento,
arregloIntentos,
vidas,
contador,
espacio,
acierto;

// Estructura del teclado en la pantalla
startGame.addEventListener("click", function () {
    // La división start desaparece de la pantalla
    document.getElementById("start").style.display = "none";
    // La división play pasa de tener la propiedad 'display: none' (ver hoja de estilos CSS) a tener la propiedad 'display: block'. Es decir, ya se puede ver en la pantalla
    document.getElementById("play").style.display = "block";

    letras = document.createElement("ul");

    for (let i = 0; i < alfabeto.length; i++) {
        // Las letras del alfabeto o el teclado virtual son simplemente una lista de ítems (li) contenida en una lista no ordenada (ul)
        letras.id = "alfabeto";
        lista = document.createElement("li");
        lista.class = "letra";
        lista.innerHTML = alfabeto[i];
        revisar();
        myKeyboard.appendChild(letras);
        letras.appendChild(lista);
    }
    jugar();
    pista();
});

function jugar() {
    arregloIntentos = [];
    vidas = 10;
    contador = 0;
    espacio = 0;
    numeroAleatorio = Math.floor(Math.random() * arregloPalabras.length);
    // La palabra es seleccionada aleatoriamente dentro del arregloPalabras y los espacios son reemplazados con un guión
    palabraSeleccionada = arregloPalabras[numeroAleatorio].replace(/\s/g, "-");
    // Para evitar repeticiones de palabras seleccionadas, por cada reintento en el juego un elemento del arregloPalabras es eliminado de acuerdo al número aleatorio
    arregloPalabras.splice(numeroAleatorio, 1);
    
    resultado();
    comentarios();
    render();
    if (arregloPalabras.length === 0) {
        playAgain.disabled = true;
        swal( "No hay más palabras secretas disponibles. Es tu último turno :(", "error");
    }
}

function revisar() {
    lista.onclick = function () {
        let shot = this.innerHTML;
        this.setAttribute("class", "defuse");
        // Las letras ya seleccionadas no tendrán incidencia en la cantidad de vidas del jugador 
        this.onclick = null;

        for (let i = 0; i < palabraSeleccionada.length; i++) {
            if (palabraSeleccionada[i] === shot) {
                arregloIntentos[i].innerHTML = shot;
                contador += 1;
            }
        }
        let check = palabraSeleccionada.indexOf(shot);
        // Si no hay coincidencias (-1) entre la letra seleccionada por el usuario y alguna letra de la palabra seleccionada, entonces se resta una vida 
        if (check === -1) {
            vidas -= 1;
            comentarios();
            animacion();
        } else {
            comentarios();
        }
    }
}

// Estructura y visualización de la palabra seleccionada en la pantalla
function resultado() {
    acierto = document.createElement("ul");

    for (let i = 0; i < palabraSeleccionada.length; i++) {
        acierto.setAttribute("id", "my-word");
        intento = document.createElement("li");
        intento.setAttribute("class", "intento");

        // Verificación de la existencia de espacios en la palabra seleccionada
        if (palabraSeleccionada[i] === "-") {
            intento.innerHTML = "-";
            espacio = 1;
        } else {
            intento.innerHTML = "_";
        }
        arregloIntentos.push(intento);
        underscore.appendChild(acierto);
        acierto.appendChild(intento);
    }
}

function comentarios() {
    let mostrarVidas = document.getElementById("lives");
    mostrarVidas.innerHTML = `Tienes ${vidas} vidas`;
    if (vidas < 1) {
        mostrarVidas.innerHTML = `Perdiste! :( <br> La palabra secreta era ${palabraSeleccionada}`;
        // Si el jugador pierde desaparecen de la pantalla la pista, la sección de los guiones bajos, y el teclado
        clue.style.display = "none";
        underscore.style.display = "none";
        myKeyboard.style.display = "none";
    }
    for (let i = 0; i < arregloIntentos.length; i++) {
        if (contador + espacio === arregloIntentos.length) {
            mostrarVidas.innerHTML = "ganaste!";
            // // Si el jugador gana también desaparecen de la pantalla la pista y el teclado
            clue.style.display = "none";
            myKeyboard.style.display = "none";
        }
    }
}

function pista() {
    let mostrarPista = document.getElementById("clue");
    // La pista es seleccionada de acuerdo al valor del número aleatorio. La posición o índice de cada pista y elemento del arregloPalabras deben coincidir. 
    let indicePistas = pistas[numeroAleatorio];
    // Si el índice de pistas es indefinido es porque la palabra seleccionada corresponde a la ingresada por el usuario
    if (indicePistas === undefined) {
        mostrarPista.innerHTML = `Pista: Ya no es un secreto para ti`;
    } else {
        mostrarPista.innerHTML = `Pista: ${indicePistas}`;
    } 
    // Para evitar repeticiones de pistas seleccionadas, por cada reintento en el juego un elemento del arreglo pistas es eliminado de acuerdo al número aleatorio
    pistas.splice(numeroAleatorio, 1);
}

inputText.addEventListener("keypress", function (event) {
    // Si el usuario presiona la tecla 'enter' la función en el botón 'agregar' es ejecutada
    if (event.key === "Enter") {
        // La acción por defecto es cancelada, si es necesario
        event.preventDefault();
        addBtn.click();
    }
});

addBtn.addEventListener("click", function () {
    // La nueva palabra agregada por el jugador es normalizada o ajustada, es decir, se le retiran los acentos y es convertida a mayúsculas
    let entradaTexto = inputText.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    // Únicamente son válidas las letras del alfabeto 
    let regEx = /^[A-Z][A-Z\s]*$/;

    if (inputText.value === "") {
        inputText.focus();
        return;
    }
    else if (!entradaTexto.match(regEx)) {
        swal("Recuerda escribir únicamente letras del alfabeto", "error");
    } 
    else if (arregloPalabras.includes(entradaTexto)) {
        swal("La palabra que escribiste estaría repetida. Selecciona otra", "error");
    } else {
        // Los espacios en blanco de la nueva palabra son reeemplazados por un guión
        let updateText = entradaTexto.replaceAll(' ', '-');
        arregloPalabras.push(updateText);
        checkMark();
    }
    inputText.value = "";
});

// Función para mostrar un símbolo al momento de ingresar una nueva palabra válida
function checkMark() {
    let toast = document.getElementById("check-mark");
    // La clase "show" es agregada a la división "check-mark"
    toast.className = "show";
    // Después de 3 segundos, la clase "show" es removida de la división
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

home.addEventListener("click", function () {
    location.reload();
});

playAgain.addEventListener("click", function () {
    this.blur();
    acierto.parentNode.removeChild(acierto);
    letras.parentNode.removeChild(letras);
    context.clearRect(0, 0, 330, 200);

    // Si el jugador decide volver a jugar reaparecen en la pantalla la pista, la sección de los guiones bajos, y el teclado
    clue.style.display = "block";
    underscore.style.display = "block";
    myKeyboard.style.display = "block";
    startGame.click();
});



