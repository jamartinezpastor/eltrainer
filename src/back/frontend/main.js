const API_URL = "http://127.0.0.1:8000/api";

let usuarioLogueado = null;
let rutinaSeleccionada = null;

// DOM
const listaRutinas = document.getElementById("rutinas");
const buscador = document.getElementById("buscador");
const detalleContenido = document.getElementById("detalle-contenido");
const selectorEjercicios = document.getElementById("selector-ejercicios");
const listaRutinasUsuario = document.getElementById("lista-rutinas-usuario");

const player = document.querySelector('lottie-player');
player.pause();      // play(), stop()
player.setSpeed(0.1);
player.setDirection(1); // o -1



// Mostrar secciones
function mostrarSeccion(seccionMostrada) {
  document
    .querySelectorAll("main > section")
    .forEach((s) => s.classList.add("oculto"));
  seccionMostrada.classList.remove("oculto");
}

function actualizarBotonesSesion() {
  document
    .getElementById("btn-login")
    .classList.toggle("oculto", !!usuarioLogueado);
  document
    .getElementById("btn-register")
    .classList.toggle("oculto", !!usuarioLogueado);
  document
    .getElementById("btn-perfil")
    .classList.toggle("oculto", !usuarioLogueado);
  document
    .getElementById("btn-logout")
    .classList.toggle("oculto", !usuarioLogueado);
  document
    .getElementById("btn-crear-rutina")
    .classList.toggle("oculto", !usuarioLogueado);
}

// Buscar o listar rutinas
function cargarRutinas(nombre = "") {
  let url = `${API_URL}/rutinas`;
  if (nombre) url += `?nombre=${encodeURIComponent(nombre)}`;

  fetch(url)
    .then((res) => res.json())
    .then((rutinas) => {
      listaRutinas.innerHTML = "";
      rutinas.forEach((rutina) => {
        const li = document.createElement("li");
        li.textContent = `${rutina.nombre} - Nivel: ${rutina.nivel}`;
        li.addEventListener("click", () => mostrarDetalleRutina(rutina.id));
        listaRutinas.appendChild(li);
      });
    });
}

// Ver detalle de rutina
function mostrarDetalleRutina(id) {
  fetch(`${API_URL}/rutinas/${id}`)
    .then((res) => res.json())
    .then((rutina) => {
      rutinaSeleccionada = rutina;
      detalleContenido.innerHTML = `
        <h3>${rutina.nombre}</h3>
        <p>${rutina.descripcion}</p>
        <p><strong>Nivel:</strong> ${rutina.nivel}</p>
        <h4>Ejercicios:</h4>
        <ul>
          ${rutina.ejercicios
            .map(
              (e) =>
                `<li>${e.nombre} - ${e.grupoMuscular} (${e.series}x${e.repeticiones})</li>`
            )
            .join("")}
        </ul>
      `;
      mostrarSeccion(document.getElementById("detalle-rutina"));
    });
}

// Cargar ejercicios en el <select multiple>
function cargarSelectorEjercicios() {
  selectorEjercicios.innerHTML = "";

  fetch(`${API_URL}/ejercicios`)
    .then((res) => res.json())
    .then((ejercicios) => {
      ejercicios.forEach((ej) => {
        const option = document.createElement("option");
        option.value = ej.id;
        option.textContent = `${ej.nombre} - ${ej.grupoMuscular} (${ej.series}x${ej.repeticiones})`;
        selectorEjercicios.appendChild(option);
      });
    });
}

// Crear rutina con ejercicios existentes
document.getElementById("crear-rutina-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!usuarioLogueado) return alert("Debes iniciar sesión");

  const token = usuarioLogueado?.access_token || localStorage.getItem("token");
  if (!token) return alert("No hay token. Inicia sesión de nuevo.");

  const ejerciciosIds = Array.from(selectorEjercicios.selectedOptions).map(
    (opt) => parseInt(opt.value)
  );

  const datosRutina = {
    nombre: document.getElementById("nombre-rutina").value,
    descripcion: document.getElementById("descripcion-rutina").value,
    nivel: document.getElementById("nivel-rutina").value,
    usuarioId: usuarioLogueado.id,
    ejerciciosIds: ejerciciosIds,
  };

  fetch(`${API_URL}/rutinas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(datosRutina),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al crear rutina");
      return res.json();
    })
    .then(() => {
      alert("Rutina creada correctamente");
      e.target.reset(); // <-- Mejor que usar getElementById
      actualizarBotonesSesion(); // <-- Evita errores de estado
      mostrarSeccion(document.getElementById("lista-rutinas"));
      cargarRutinas();
    })
    .catch((err) => {
      console.error(err);
      alert("Error al crear la rutina. Intenta nuevamente.");
    });
});

// Registro
document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const datos = {
    nombre: document.getElementById("reg-nombre").value,
    email: document.getElementById("reg-email").value,
    telefono: document.getElementById("reg-telefono").value,
    contrasena: document.getElementById("reg-pass").value,
  };
  fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Registro exitoso");
      document.getElementById("register-form").reset();
      mostrarSeccion(document.getElementById("form-login"));
    });
});

// Login
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const datos = {
    email: document.getElementById("login-email").value,
    contrasena: document.getElementById("login-pass").value,
  };
  fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Credenciales incorrectas");
      return res.json();
    })
    .then((usuario) => {
      usuarioLogueado = usuario;
      localStorage.setItem("token", usuario.access_token);
      actualizarBotonesSesion();
      mostrarSeccion(document.getElementById("lista-rutinas"));
      cargarRutinas();
    })
    .catch((err) => {
      console.error(err);
      alert("Error al iniciar sesión. Verifica tus datos.");
    });
});

// Mostrar perfil y sus rutinas
document.getElementById("btn-perfil").onclick = () => {
  const cont = document.getElementById("datos-usuario");
  cont.innerHTML = `
    <h3>${usuarioLogueado.nombre}</h3>
    <p>Email: ${usuarioLogueado.email}</p>
    <p>Teléfono: ${usuarioLogueado.telefono}</p>
  `;

  fetch(`${API_URL}/usuarios/${usuarioLogueado.id}/rutinas`)
    .then((res) => res.json())
    .then((rutinas) => {
      listaRutinasUsuario.innerHTML = "";
      rutinas.forEach((r) => {
        const li = document.createElement("li");
        li.textContent = `${r.nombre} (${r.nivel})`;
        li.addEventListener("click", () => mostrarDetalleRutina(r.id));
        listaRutinasUsuario.appendChild(li);
      });
    });

  mostrarSeccion(document.getElementById("seccion-perfil"));
};

// Botones navegación
document.getElementById("btn-login").onclick = () =>
  mostrarSeccion(document.getElementById("form-login"));
document.getElementById("btn-register").onclick = () =>
  mostrarSeccion(document.getElementById("form-register"));
document.getElementById("btn-logout").onclick = () => {
  usuarioLogueado = null;
  actualizarBotonesSesion();
  mostrarSeccion(document.getElementById("lista-rutinas"));
};
document.getElementById("btn-crear-rutina").onclick = () => {
  cargarSelectorEjercicios();
  mostrarSeccion(document.getElementById("form-crear-rutina"));
};

document.getElementById("buscador").onkeyup = () =>
  cargarRutinas(buscador.value);

document.getElementById("btn-buscar").onclick = () =>
  cargarRutinas(buscador.value);
document.getElementById("volver").onclick = () =>
  mostrarSeccion(document.getElementById("lista-rutinas"));
document.getElementById("volver-inicio-desde-rutina").onclick = () =>
  mostrarSeccion(document.getElementById("lista-rutinas"));
document.getElementById("btn-volver-inicio").onclick = () =>
  mostrarSeccion(document.getElementById("lista-rutinas"));

// Inicio
document.addEventListener("DOMContentLoaded", () => {
  cargarRutinas();
  mostrarSeccion(document.getElementById("lista-rutinas"));
  actualizarBotonesSesion();
});
