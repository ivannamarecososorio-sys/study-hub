const input = document.getElementById("tarea");
const boton = document.getElementById("agregar");
const lista = document.getElementById("lista");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
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
function mostrarTareas() {
    lista.innerHTML = "";

    tareas.forEach(function(tarea, indice) {
        const nuevaTarea = document.createElement("li");

        nuevaTarea.textContent = tarea.texto;

        if (tarea.completada) {
            nuevaTarea.style.textDecoration = "line-through";
        }

        nuevaTarea.addEventListener("click", function() {
            tareas[indice].completada = !tareas[indice].completada;

            localStorage.setItem("tareas", JSON.stringify(tareas));

            mostrarTareas();
        });

        const eliminar = document.createElement("button");

        eliminar.textContent = "🗑️";

        eliminar.addEventListener("click", function(evento) {
            evento.stopPropagation();

            tareas.splice(indice, 1);

            localStorage.setItem("tareas", JSON.stringify(tareas));

            mostrarTareas();
        });

        nuevaTarea.appendChild(eliminar);

        lista.appendChild(nuevaTarea);
    });
    actualizarProgreso();

}

boton.addEventListener("click", function() {
    const texto = input.value.trim();

    if (texto !== "") {

        tareas.push({
            texto: texto,
            completada: false
        });

        localStorage.setItem("tareas", JSON.stringify(tareas));

        input.value = "";

        mostrarTareas();
    }
});
actualizarProgreso();

mostrarTareas();


// ⏱️ TEMPORIZADOR

let tiempo = 25 * 60;
let intervalo = null;

const temporizador = document.getElementById("temporizador");
const iniciar = document.getElementById("iniciar");
const reiniciar = document.getElementById("reiniciar");

function actualizarTemporizador() {

    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;

    temporizador.textContent =
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundos).padStart(2, "0");
}

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

    registrarEstudio();

    alert("🎀 ¡Sesión de estudio terminada! ¡Buen trabajo! ✨");

}

    }, 1000);
});

reiniciar.addEventListener("click", function() {

    clearInterval(intervalo);

    intervalo = null;

   tiempo = 25 * 60;

    actualizarTemporizador();
});

actualizarTemporizador();
function registrarEstudio() {

    const hoy = new Date().toDateString();

    let ultimoDia = localStorage.getItem("ultimoDia");
    let racha = Number(localStorage.getItem("racha")) || 0;

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

        localStorage.setItem("racha", racha);
        localStorage.setItem("ultimoDia", hoy);

        document.getElementById("racha").textContent = "🔥 " + racha;
    }
}