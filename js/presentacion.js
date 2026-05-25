/**
 * CAPA DE PRESENTACIÓN — presentacion.js
 * Maneja eventos del DOM, llama a window.Logica y renderiza resultados.
 * NO contiene cálculos ni datos crudos del dominio.
 */

(function () {
  "use strict";

  // ── Estado de la UI ───────────────────────────────────────────────────────
  let seccionActiva = "comparador";
  let quizEstado = {
    preguntaActual: 0,
    respuestas: [],
    respondidas: [],
    finalizado: false
  };

  // ── Inicialización ────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    construirSelectorCables();
    construirTarjetasCables();
    renderizarComparadorInicial();
    initNavegacion();
    initComparador();
    initRecomendador();
    initQuiz();
  });

  // ── Navegación ────────────────────────────────────────────────────────────
  function initNavegacion() {
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const seccion = this.dataset.seccion;
        mostrarSeccion(seccion);
      });
    });
  }

  function mostrarSeccion(id) {
    seccionActiva = id;
    document.querySelectorAll(".seccion").forEach(s => s.classList.remove("activa"));
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("activo"));
    const sec = document.getElementById("sec-" + id);
    if (sec) sec.classList.add("activa");
    const btn = document.querySelector(`.nav-btn[data-seccion="${id}"]`);
    if (btn) btn.classList.add("activo");
  }

  // ── Catálogo de tarjetas ──────────────────────────────────────────────────
  function construirTarjetasCables() {
    const contenedor = document.getElementById("catalogo-cables");
    if (!contenedor) return;
    const cables = window.Datos.cables;
    contenedor.innerHTML = cables.map(c => `
      <article class="tarjeta-cable" data-id="${c.id}" style="--color-cable: ${c.color}">
        <div class="tarjeta-header">
          <span class="cat-badge">${c.nombre}</span>
          <span class="anio-badge">${c.año}</span>
        </div>
        <div class="tarjeta-stat">
          <span class="stat-icon">⚡</span>
          <span class="stat-val">${c.velocidadMax} Gbps</span>
        </div>
        <div class="tarjeta-stat">
          <span class="stat-icon">📡</span>
          <span class="stat-val">${c.anchoBanda} MHz</span>
        </div>
        <div class="tarjeta-stat">
          <span class="stat-icon">📏</span>
          <span class="stat-val">${c.distanciaMax} m</span>
        </div>
        <div class="tarjeta-stat">
          <span class="stat-icon">🛡</span>
          <span class="stat-val">${c.apantallado ? "Apantallado" : "Sin apantallado"}</span>
        </div>
        <p class="tarjeta-desc">${c.descripcion}</p>
        <div class="tarjeta-uso">${c.uso}</div>
        <button class="btn-detalle" data-id="${c.id}">Ver detalles</button>
      </article>
    `).join("");

    contenedor.querySelectorAll(".btn-detalle").forEach(btn => {
      btn.addEventListener("click", function () {
        abrirModal(this.dataset.id);
      });
    });
  }

  function abrirModal(cableId) {
    const cable = window.Datos.cables.find(c => c.id === cableId);
    if (!cable) return;
    const modal = document.getElementById("modal-detalle");
    const cuerpo = document.getElementById("modal-cuerpo");

    cuerpo.innerHTML = `
      <div class="modal-header-cable" style="--color-cable: ${cable.color}">
        <h2>${cable.nombre}</h2>
        <span class="norma-tag">${cable.norma}</span>
      </div>
      <div class="modal-grid">
        <div class="modal-bloque">
          <h3>Especificaciones técnicas</h3>
          <table class="tabla-specs">
            <tr><td>Velocidad máxima</td><td><strong>${cable.velocidadMax} Gbps</strong></td></tr>
            <tr><td>Ancho de banda</td><td><strong>${cable.anchoBanda} MHz</strong></td></tr>
            <tr><td>Distancia máxima</td><td><strong>${cable.distanciaMax} m</strong></td></tr>
            <tr><td>Conector</td><td><strong>${cable.conectores}</strong></td></tr>
            <tr><td>Apantallado</td><td><strong>${cable.apantallado ? "Sí" : "No"}</strong></td></tr>
            <tr><td>Año de introducción</td><td><strong>${cable.año}</strong></td></tr>
          </table>
        </div>
        <div class="modal-bloque">
          <h3>Aplicaciones principales</h3>
          <ul class="lista-app">
            ${cable.aplicaciones.map(a => `<li>${a}</li>`).join("")}
          </ul>
          <h3>Ventajas</h3>
          <ul class="lista-ventajas">
            ${cable.ventajas.map(v => `<li>✔ ${v}</li>`).join("")}
          </ul>
          <h3>Desventajas</h3>
          <ul class="lista-desv">
            ${cable.desventajas.map(d => `<li>✘ ${d}</li>`).join("")}
          </ul>
        </div>
      </div>
      <p class="modal-desc">${c => c.descripcion}</p>
    `;
    // fix: use cable directly
    cuerpo.querySelector(".modal-desc").textContent = cable.descripcion;
    modal.classList.add("visible");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal-detalle");
    const cerrar = document.getElementById("modal-cerrar");
    if (cerrar) {
      cerrar.addEventListener("click", () => modal.classList.remove("visible"));
    }
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) modal.classList.remove("visible");
      });
    }
  });

  // ── Comparador ────────────────────────────────────────────────────────────
  function construirSelectorCables() {
    const contenedor = document.getElementById("selector-cables");
    if (!contenedor) return;
    contenedor.innerHTML = window.Datos.cables.map(c => `
      <label class="check-cable" style="--color-cable: ${c.color}">
        <input type="checkbox" value="${c.id}" checked>
        <span>${c.nombre}</span>
      </label>
    `).join("");
  }

  function initComparador() {
    const btnComparar = document.getElementById("btn-comparar");
    if (btnComparar) {
      btnComparar.addEventListener("click", ejecutarComparacion);
    }
  }

  function renderizarComparadorInicial() {
    const ids = window.Datos.cables.map(c => c.id);
    renderizarTablaComparacion(ids);
  }

  function ejecutarComparacion() {
    const checks = document.querySelectorAll("#selector-cables input[type=checkbox]:checked");
    const ids = Array.from(checks).map(c => c.value);
    if (ids.length < 2) {
      mostrarError("comparador-error", "Selecciona al menos 2 categorías para comparar.");
      return;
    }
    limpiarError("comparador-error");
    renderizarTablaComparacion(ids);
  }

  function renderizarTablaComparacion(ids) {
    const { cables, criterios, ganadores } = window.Logica.construirTablaComparacion(ids);
    const contenedor = document.getElementById("tabla-comparacion");
    if (!contenedor) return;

    const encabezado = `
      <thead>
        <tr>
          <th>Criterio</th>
          ${cables.map(c => `<th style="color:${c.color}">${c.nombre}</th>`).join("")}
        </tr>
      </thead>`;

    const filas = criterios.map(cr => {
      const celdas = cables.map(cable => {
        const val = cable[cr.id];
        const esGanador = Array.isArray(ganadores[cr.id]) && ganadores[cr.id].includes(cable.id);
        let display;
        if (cr.tipo === "booleano") {
          display = val ? "✔ Sí" : "✘ No";
        } else {
          display = val + (cr.id === "velocidadMax" ? " Gbps" : cr.id === "anchoBanda" ? " MHz" : cr.id === "distanciaMax" ? " m" : "x");
        }
        return `<td class="${esGanador ? "celda-ganadora" : ""}">${display}${esGanador ? '<span class="crown">★</span>' : ""}</td>`;
      }).join("");
      return `<tr><td class="criterio-label">${cr.label}</td>${celdas}</tr>`;
    }).join("");

    // Fila de barras visuales para velocidad
    const rangos = {};
    ["velocidadMax", "anchoBanda", "distanciaMax", "precioRelativo"].forEach(id => {
      rangos[id] = window.Logica.rangoCriterio(id);
    });

    const filaVel = `<tr class="fila-barra"><td>Visual velocidad</td>${cables.map(c => {
      const pct = window.Logica.normalizarBarra(c.velocidadMax, rangos.velocidadMax.min, rangos.velocidadMax.max);
      return `<td><div class="barra-vis" style="width:${pct}%;background:${c.color}">${c.velocidadMax} Gbps</div></td>`;
    }).join("")}</tr>`;

    contenedor.innerHTML = `<table class="tabla-comp">${encabezado}<tbody>${filas}${filaVel}</tbody></table>`;
  }

  // ── Recomendador ──────────────────────────────────────────────────────────
  function initRecomendador() {
    const btn = document.getElementById("btn-recomendar");
    if (btn) btn.addEventListener("click", ejecutarRecomendacion);
  }

  function ejecutarRecomendacion() {
    const vel = parseFloat(document.getElementById("inp-velocidad").value);
    const dist = parseFloat(document.getElementById("inp-distancia").value);
    const entorno = document.getElementById("sel-entorno").value;

    const resultado = window.Logica.recomendarCable(vel, dist, entorno);
    const contenedor = document.getElementById("resultado-recomendacion");

    if (resultado.error) {
      contenedor.innerHTML = `<div class="alerta-error">⚠ ${resultado.error}</div>`;
      return;
    }

    const { recomendado, alternativa, razon } = resultado;
    contenedor.innerHTML = `
      <div class="recomendacion-card" style="--color-cable: ${recomendado.color}">
        <div class="rec-badge">Recomendación principal</div>
        <h3>${recomendado.nombre}</h3>
        <p class="rec-razon">${razon}</p>
        <div class="rec-specs">
          <span>⚡ ${recomendado.velocidadMax} Gbps</span>
          <span>📡 ${recomendado.anchoBanda} MHz</span>
          <span>📏 ${recomendado.distanciaMax} m máx.</span>
          <span>💰 Precio relativo: ${recomendado.precioRelativo}x</span>
        </div>
      </div>
      ${alternativa ? `
        <div class="recomendacion-alt" style="--color-cable: ${alternativa.color}">
          <div class="alt-badge">Alternativa</div>
          <h4>${alternativa.nombre}</h4>
          <p>También cumple los requisitos con mayor costo (${alternativa.precioRelativo}x) pero mayor ancho de banda (${alternativa.anchoBanda} MHz).</p>
        </div>` : ""}
    `;
  }

  // ── Quiz ──────────────────────────────────────────────────────────────────
  function initQuiz() {
    resetearQuiz();
    const btnReset = document.getElementById("btn-quiz-reset");
    if (btnReset) btnReset.addEventListener("click", resetearQuiz);
  }

  function resetearQuiz() {
    quizEstado = {
      preguntaActual: 0,
      respuestas: new Array(window.Datos.quizPreguntas.length).fill(-1),
      respondidas: new Array(window.Datos.quizPreguntas.length).fill(false),
      finalizado: false
    };
    renderizarPregunta(0);
    document.getElementById("btn-quiz-reset").style.display = "none";
    document.getElementById("resultado-quiz").innerHTML = "";
  }

  function renderizarPregunta(idx) {
    const preguntas = window.Datos.quizPreguntas;
    if (idx >= preguntas.length) {
      finalizarQuiz();
      return;
    }

    const p = preguntas[idx];
    const contenedor = document.getElementById("quiz-area");
    const progreso = `${idx + 1} / ${preguntas.length}`;

    contenedor.innerHTML = `
      <div class="quiz-progreso">
        <div class="prog-barra" style="width:${((idx) / preguntas.length) * 100}%"></div>
      </div>
      <span class="quiz-num">Pregunta ${progreso}</span>
      <p class="quiz-pregunta">${p.pregunta}</p>
      <div class="quiz-opciones" id="quiz-opciones">
        ${p.opciones.map((op, i) => `
          <button class="opcion-btn" data-idx="${i}">${op}</button>
        `).join("")}
      </div>
      <div id="quiz-feedback" class="quiz-feedback"></div>
      <button class="btn-siguiente" id="btn-siguiente" style="display:none" data-siguiente="${idx + 1}">
        ${idx + 1 < preguntas.length ? "Siguiente →" : "Ver resultados"}
      </button>
    `;

    contenedor.querySelectorAll(".opcion-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        if (quizEstado.respondidas[idx]) return;
        seleccionarOpcion(idx, parseInt(this.dataset.idx));
      });
    });

    const btnSig = contenedor.querySelector("#btn-siguiente");
    if (btnSig) {
      btnSig.addEventListener("click", function () {
        renderizarPregunta(parseInt(this.dataset.siguiente));
      });
    }
  }

  function seleccionarOpcion(idxPregunta, idxOpcion) {
    quizEstado.respuestas[idxPregunta] = idxOpcion;
    quizEstado.respondidas[idxPregunta] = true;

    const resultado = window.Logica.verificarRespuesta(idxPregunta, idxOpcion);
    const feedback = document.getElementById("quiz-feedback");
    const botones = document.querySelectorAll(".opcion-btn");

    botones.forEach((btn, i) => {
      btn.disabled = true;
      if (i === resultado.correctaIndex) btn.classList.add("opcion-correcta");
      if (i === idxOpcion && !resultado.correcto) btn.classList.add("opcion-incorrecta");
    });

    feedback.innerHTML = `
      <div class="feedback-${resultado.correcto ? "ok" : "fail"}">
        ${resultado.correcto ? "✔ ¡Correcto!" : "✘ Incorrecto."}
        <p>${resultado.explicacion}</p>
      </div>`;

    document.getElementById("btn-siguiente").style.display = "inline-block";
  }

  function finalizarQuiz() {
    const { puntaje, total, porcentaje, nivel } = window.Logica.calcularResultadoQuiz(quizEstado.respuestas);
    const contenedor = document.getElementById("quiz-area");

    contenedor.innerHTML = `
      <div class="quiz-final">
        <div class="puntaje-circulo">
          <span class="puntaje-num">${puntaje}</span>
          <span class="puntaje-total">/${total}</span>
        </div>
        <h3 class="nivel-label">${nivel}</h3>
        <p class="porcentaje-label">${porcentaje}% de respuestas correctas</p>
      </div>`;

    document.getElementById("btn-quiz-reset").style.display = "inline-block";
  }

  // ── Utilidades UI ─────────────────────────────────────────────────────────
  function mostrarError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = "block"; }
  }

  function limpiarError(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ""; el.style.display = "none"; }
  }

})();
