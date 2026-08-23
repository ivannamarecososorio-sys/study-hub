const input = document.getElementById("tarea");
const boton = document.getElementById("agregar");
const lista = document.getElementById("lista");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];


// ====================
// 📊 PROGRESO
// ====================

function actualizarProgreso() {

    const progreso = document.getElementById("progreso");
    const barra = document.getElementById("barra-relleno");

    const total = tareas.length;

    const completadas = tareas.filter(function(tarea) {
        return tarea.completada;
    }).length;

    const porcentaje = total === 0
        ? 0
        : Math.round((completadas / total) * 100);

    progreso.textContent = porcentaje + "%";
    barra.style.width = porcentaje + "%";
}


// ====================
// 📚 TAREAS
// ====================

function mostrarTareas() {

    lista.innerHTML = "";

    tareas.forEach(function(tarea, indice) {

        const nuevaTarea = document.createElement("li");

        nuevaTarea.textContent = tarea.texto;

        if (tarea.completada) {
            nuevaTarea.style.textDecoration = "line-through";
        }

        nuevaTarea.addEventListener("click", function() {

            tareas[indice].completada =
                !tareas[indice].completada;

            localStorage.setItem(
                "tareas",
                JSON.stringify(tareas)
            );

            mostrarTareas();
            actualizarMetas();
        });


        const eliminar = document.createElement("button");

        eliminar.textContent = "🗑️";

        eliminar.addEventListener("click", function(evento) {

            evento.stopPropagation();

            tareas.splice(indice, 1);

            localStorage.setItem(
                "tareas",
                JSON.stringify(tareas)
            );

            mostrarTareas();
            actualizarMetas();
        });

        nuevaTarea.appendChild(eliminar);

        lista.appendChild(nuevaTarea);
    });

    actualizarProgreso();
}


// ====================
// ➕ AGREGAR TAREA
// ====================

boton.addEventListener("click", function() {

    const texto = input.value.trim();

    if (texto !== "") {

        tareas.push({
            texto: texto,
            completada: false
        });

        localStorage.setItem(
            "tareas",
            JSON.stringify(tareas)
        );

        input.value = "";

        mostrarTareas();
        actualizarMetas();
    }
});


// ====================
// 🎯 METAS
// ====================

function actualizarMetas() {

    const meta = 3;

    const completadas = tareas.filter(function(tarea) {
        return tarea.completada;
    }).length;

    const cantidad = Math.min(completadas, meta);

    const porcentaje = (cantidad / meta) * 100;

    document.getElementById("metaTareas").textContent =
        cantidad + " / " + meta;

    document.getElementById("barraMetas").style.width =
        porcentaje + "%";

    if (cantidad >= meta) {

        document.getElementById("mensajeMeta").textContent =
            "🎉 ¡Meta completada! ¡Excelente trabajo! 💗";

    } else {

        document.getElementById("mensajeMeta").textContent =
            "🎀 ¡Vamos, tú puedes!";
    }
}


// ====================
// ⏱️ TEMPORIZADOR
// ====================

let tiempo = 1500;
let tiempoInicial = 1500;
let intervalo = null;

const temporizador =
    document.getElementById("temporizador");

const iniciar =
    document.getElementById("iniciar");

const reiniciar =
    document.getElementById("reiniciar");


function actualizarTemporizador() {

    const minutos = Math.floor(tiempo / 60);

    const segundos = tiempo % 60;

    temporizador.textContent =
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundos).padStart(2, "0");
}


// ▶️ EMPEZAR

iniciar.addEventListener("click", function() {

    if (intervalo !== null) {
        return;
    }

    intervalo = setInterval(function() {

        tiempo--;

        actualizarTemporizador();

        if (tiempo <= 0) {

            clearInterval(intervalo);

            intervalo = null;

            tiempo = 0;

            actualizarTemporizador();

            registrarEstudio();

            marcarDiaEstudiado();

            alert(
                "🎉 ¡Sesión completada! ¡Buen trabajo! 💗"
            );
        }

    }, 1000);
});


// 🔄 REINICIAR

reiniciar.addEventListener("click", function() {

    clearInterval(intervalo);

    intervalo = null;

    tiempo = tiempoInicial;

    actualizarTemporizador();
});


// ====================
// ⏱️ DIFERENTES TIEMPOS
// ====================

const botonesTiempo =
    document.querySelectorAll(".boton-tiempo");

botonesTiempo.forEach(function(boton) {

    boton.addEventListener("click", function() {

        clearInterval(intervalo);

        intervalo = null;

        tiempoInicial =
            Number(boton.dataset.tiempo);

        tiempo = tiempoInicial;

        actualizarTemporizador();
    });
});


// ====================
// 🔥 RACHA
// ====================

function registrarEstudio() {

    const hoy = new Date().toDateString();

    let ultimoDia =
        localStorage.getItem("ultimoDia");

    let racha =
        Number(localStorage.getItem("racha")) || 0;


    if (ultimoDia !== hoy) {

        if (ultimoDia) {

            const ayer = new Date();

            ayer.setDate(ayer.getDate() - 1);

            if (ultimoDia === ayer.toDateString()) {

                racha++;

            } else {

                racha = 1;
            }

        } else {

            racha = 1;
        }


        localStorage.setItem(
            "racha",
            racha
        );

        localStorage.setItem(
            "ultimoDia",
            hoy
        );
    }

    document.getElementById("racha").textContent =
        "🔥 " + racha;
}


// ====================
// 📅 SEMANA
// ====================

function mostrarSemana() {

    const semana =
        document.getElementById("semana");

    semana.innerHTML = "";

    const hoy = new Date();

    const dia = hoy.getDay();

    const lunes = new Date(hoy);


    if (dia === 0) {

        lunes.setDate(
            hoy.getDate() - 6
        );

    } else {

        lunes.setDate(
            hoy.getDate() - (dia - 1)
        );
    }


    const nombres =
        ["L", "M", "M", "J", "V", "S", "D"];


    for (let i = 0; i < 7; i++) {

        const fecha = new Date(lunes);

        fecha.setDate(
            lunes.getDate() + i
        );


        const diaElemento =
            document.createElement("div");

        diaElemento.className =
            "dia-semana";


        if (
            fecha.toDateString() ===
            hoy.toDateString()
        ) {

            diaElemento.classList.add("hoy");
        }


        const fechaGuardada =
            localStorage.getItem(
                "estudio-" +
                fecha.toDateString()
            );


        diaElemento.innerHTML = `
            <span>${nombres[i]}</span>
            <strong>${fecha.getDate()}</strong>
            <small>${fechaGuardada ? "🌸" : ""}</small>
        `;


        semana.appendChild(diaElemento);
    }
}


// ====================
// 🌸 MARCAR DÍA ESTUDIADO
// ====================

function marcarDiaEstudiado() {

    const hoy =
        new Date().toDateString();

    localStorage.setItem(
        "estudio-" + hoy,
        "true"
    );

    mostrarSemana();
}


// ====================
// 🚀 INICIAR APP
// ====================

actualizarTemporizador();

mostrarTareas();

actualizarMetas();

mostrarSemana();


// Mostrar racha guardada

const rachaGuardada =
    Number(localStorage.getItem("racha")) || 0;

document.getElementById("racha").textContent =
    "🔥 " + rachaGuardada;