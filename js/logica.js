/**
 * CAPA DE LÓGICA — logica.js
 * Implementa reglas del dominio: comparación, filtrado, quiz.
 * NO accede al DOM. NO usa document ni alert.
 */

window.Logica = (function () {

  // ── Comparador ────────────────────────────────────────────────────────────

  /**
   * Filtra cables según los criterios seleccionados.
   * @param {string[]} idsSeleccionados  - Array de IDs de cable a incluir
   * @returns {Object[]} Arreglo de objetos cable filtrados
   */
  function filtrarCables(idsSeleccionados) {
    if (!idsSeleccionados || idsSeleccionados.length === 0) {
      return window.Datos.cables;
    }
    return window.Datos.cables.filter(c => idsSeleccionados.includes(c.id));
  }

  /**
   * Dado un criterio y una lista de cables, devuelve el cable "ganador"
   * (el de mayor valor numérico, o true para booleano).
   * @param {string} criterioId
   * @param {Object[]} cables
   * @returns {string} id del cable ganador
   */
  function ganadorCriterio(criterioId, cables) {
    if (cables.length === 0) return null;
    const criterio = window.Datos.criterios.find(c => c.id === criterioId);
    if (!criterio) return null;

    if (criterio.tipo === "booleano") {
      const apantallados = cables.filter(c => c[criterioId] === true);
      return apantallados.length > 0 ? apantallados.map(c => c.id) : [];
    }

    const max = Math.max(...cables.map(c => c[criterioId]));
    return cables.filter(c => c[criterioId] === max).map(c => c.id);
  }

  /**
   * Construye la tabla de comparación completa para los cables dados.
   * @param {string[]} idsSeleccionados
   * @returns {Object} { cabeceras, filas, ganadores }
   */
  function construirTablaComparacion(idsSeleccionados) {
    const cables = filtrarCables(idsSeleccionados);
    const criterios = window.Datos.criterios;

    const ganadores = {};
    criterios.forEach(c => {
      ganadores[c.id] = ganadorCriterio(c.id, cables);
    });

    return { cables, criterios, ganadores };
  }

  // ── Recomendador ──────────────────────────────────────────────────────────

  /**
   * Recomienda una categoría según velocidad, distancia y entorno.
   * @param {number} velocidadGbps - Velocidad requerida en Gbps
   * @param {number} distanciaM    - Distancia del tendido en metros
   * @param {string} entorno       - "hogar" | "empresa" | "datacenter"
   * @returns {Object} { recomendado: cable, alternativa: cable|null, razon: string }
   */
  function recomendarCable(velocidadGbps, distanciaM, entorno) {
    const errores = validarEntradas(velocidadGbps, distanciaM, entorno);
    if (errores.length > 0) {
      return { error: errores.join(" ") };
    }

    const cables = window.Datos.cables;
    let candidatos = cables.filter(c => {
      const velOk = c.velocidadMax >= velocidadGbps;
      const distOk = c.distanciaMax >= distanciaM;
      return velOk && distOk;
    });

    // Caso especial Cat 6 a 10 Gbps: solo si distancia <= 55 m
    candidatos = candidatos.filter(c => {
      if (c.id === "cat6" && velocidadGbps >= 10) {
        return distanciaM <= 55;
      }
      return true;
    });

    if (candidatos.length === 0) {
      return {
        error: "No existe categoría UTP que cumpla simultáneamente la velocidad y distancia solicitadas. Considera fibra óptica."
      };
    }

    // Ordenar por precio relativo (menor costo que cumpla los requisitos)
    candidatos.sort((a, b) => a.precioRelativo - b.precioRelativo);

    // Ajuste por entorno
    let recomendado = candidatos[0];
    if (entorno === "datacenter") {
      const dcCandidatos = candidatos.filter(c => c.apantallado);
      if (dcCandidatos.length > 0) recomendado = dcCandidatos[0];
    }

    const alternativa = candidatos.find(c => c.id !== recomendado.id) || null;

    const razon = construirRazon(recomendado, velocidadGbps, distanciaM, entorno);

    return { recomendado, alternativa, razon };
  }

  function construirRazon(cable, vel, dist, entorno) {
    const lineas = [];
    lineas.push(`${cable.nombre} cumple el requisito de ${vel} Gbps en ${dist} m.`);
    if (cable.apantallado) {
      lineas.push("Su apantallado lo hace idóneo para entornos con interferencia electromagnética.");
    }
    if (entorno === "hogar") {
      lineas.push("Para uso doméstico es la opción más costo-efectiva disponible.");
    } else if (entorno === "datacenter") {
      lineas.push("En centros de datos se prefiere apantallado para garantizar integridad de señal a alta densidad.");
    }
    return lineas.join(" ");
  }

  function validarEntradas(velocidadGbps, distanciaM, entorno) {
    const errores = [];
    if (isNaN(velocidadGbps) || velocidadGbps <= 0) {
      errores.push("La velocidad debe ser un número positivo.");
    }
    if (isNaN(distanciaM) || distanciaM <= 0 || distanciaM > 100) {
      errores.push("La distancia debe estar entre 1 y 100 metros.");
    }
    const entornosValidos = ["hogar", "empresa", "datacenter"];
    if (!entornosValidos.includes(entorno)) {
      errores.push("El entorno debe ser hogar, empresa o datacenter.");
    }
    return errores;
  }

  // ── Quiz ──────────────────────────────────────────────────────────────────

  /**
   * Verifica si la respuesta seleccionada es correcta.
   * @param {number} indicePregunta
   * @param {number} indiceOpcion
   * @returns {Object} { correcto: boolean, explicacion: string }
   */
  function verificarRespuesta(indicePregunta, indiceOpcion) {
    const preguntas = window.Datos.quizPreguntas;
    if (indicePregunta < 0 || indicePregunta >= preguntas.length) {
      return { error: "Índice de pregunta inválido." };
    }
    const p = preguntas[indicePregunta];
    const correcto = indiceOpcion === p.correcta;
    return {
      correcto,
      explicacion: p.explicacion,
      correctaIndex: p.correcta
    };
  }

  /**
   * Calcula el resultado final del quiz.
   * @param {number[]} respuestas - Índice de opción elegida por pregunta
   * @returns {Object} { puntaje, total, porcentaje, nivel }
   */
  function calcularResultadoQuiz(respuestas) {
    const preguntas = window.Datos.quizPreguntas;
    let puntaje = 0;
    respuestas.forEach((r, i) => {
      if (i < preguntas.length && r === preguntas[i].correcta) puntaje++;
    });
    const total = preguntas.length;
    const porcentaje = Math.round((puntaje / total) * 100);
    let nivel;
    if (porcentaje >= 85) nivel = "Experto en cableado";
    else if (porcentaje >= 60) nivel = "Técnico en formación";
    else nivel = "Revisar conceptos";

    return { puntaje, total, porcentaje, nivel };
  }

  // ── Utilidades ────────────────────────────────────────────────────────────

  /**
   * Normaliza un valor para la barra de progreso visual (0-100).
   * @param {number} valor
   * @param {number} min
   * @param {number} max
   */
  function normalizarBarra(valor, min, max) {
    if (max === min) return 100;
    return Math.round(((valor - min) / (max - min)) * 100);
  }

  /**
   * Devuelve los rangos globales de un criterio numérico sobre todos los cables.
   * @param {string} criterioId
   */
  function rangoCriterio(criterioId) {
    const valores = window.Datos.cables.map(c => c[criterioId]).filter(v => typeof v === "number");
    return { min: Math.min(...valores), max: Math.max(...valores) };
  }

  return {
    filtrarCables,
    construirTablaComparacion,
    recomendarCable,
    verificarRespuesta,
    calcularResultadoQuiz,
    normalizarBarra,
    rangoCriterio,
    ganadorCriterio
  };

})();
