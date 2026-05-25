/**
 * CAPA DE DATOS — datos.js
 * Expone window.Datos con toda la información del dominio.
 * NO contiene cálculos, NO accede al DOM.
 */

window.Datos = {

  cables: [
    {
      id: "cat5e",
      nombre: "Cat 5e",
      año: 2001,
      norma: "TIA/EIA-568-B.2",
      velocidadMax: 1,          // Gbps
      anchoBanda: 100,          // MHz
      distanciaMax: 100,        // metros
      conectores: "RJ-45",
      par: "4 pares trenzados UTP/STP",
      pares: 4,
      apantallado: false,
      aplicaciones: ["LAN doméstica", "Oficinas pequeñas", "PoE básico", "CCTV IP básica"],
      descripcion: "Mejora del Cat 5 con mayor trenzado para reducir la diafonía. Estándar dominante en redes Gigabit de bajo costo.",
      color: "#4CAF50",
      uso: "Doméstico / Oficina pequeña",
      ventajas: ["Bajo costo", "Amplia disponibilidad", "Suficiente para 1 Gbps"],
      desventajas: ["No soporta 10 Gbps", "Sin apantallado estándar", "Sensible a interferencias"],
      precioRelativo: 1
    },
    {
      id: "cat6",
      nombre: "Cat 6",
      año: 2002,
      norma: "TIA/EIA-568-B.2-1",
      velocidadMax: 10,
      anchoBanda: 250,
      distanciaMax: 55,         // metros para 10 Gbps; 100 m para 1 Gbps
      distanciaGigabit: 100,
      conectores: "RJ-45",
      par: "4 pares trenzados con separador interno",
      pares: 4,
      apantallado: false,
      aplicaciones: ["Redes empresariales", "Centros de datos pequeños", "PoE+", "VoIP"],
      descripcion: "Incluye separador longitudinal (spline) que reduce la diafonía. Soporta 10 Gbps en distancias cortas.",
      color: "#2196F3",
      uso: "Empresarial / Edificios",
      ventajas: ["Soporta 10 Gbps hasta 55 m", "Mejor inmunidad a ruido que Cat 5e", "Precio moderado"],
      desventajas: ["Diámetro mayor que Cat 5e", "10 Gbps limitado a 55 m", "Más rígido"],
      precioRelativo: 1.5
    },
    {
      id: "cat6a",
      nombre: "Cat 6A",
      año: 2008,
      norma: "TIA/EIA-568-C.2",
      velocidadMax: 10,
      anchoBanda: 500,
      distanciaMax: 100,
      conectores: "RJ-45",
      par: "4 pares trenzados, apantallado opcional (U/FTP o F/UTP)",
      pares: 4,
      apantallado: true,
      aplicaciones: ["Data centers", "Campus universitarios", "PoE++ (802.3bt)", "Edificios inteligentes"],
      descripcion: "Extiende Cat 6 a 500 MHz. Garantiza 10 Gbps en los 100 metros completos del canal. Versiones apantalladas para entornos con alta interferencia.",
      color: "#FF9800",
      uso: "Data centers / Edificios inteligentes",
      ventajas: ["10 Gbps en 100 m completos", "500 MHz de ancho de banda", "Soporta PoE++ hasta 90 W"],
      desventajas: ["Cable más grueso y pesado", "Mayor costo de instalación", "Conectores más grandes"],
      precioRelativo: 2.5
    },
    {
      id: "cat7",
      nombre: "Cat 7",
      año: 2010,
      norma: "ISO/IEC 11801:2002 Clase F",
      velocidadMax: 10,
      anchoBanda: 600,
      distanciaMax: 100,
      conectores: "GG45 / TERA (no RJ-45 nativo)",
      par: "4 pares, apantallado individual (S/FTP)",
      pares: 4,
      apantallado: true,
      aplicaciones: ["Centros de datos exigentes", "Entornos industriales", "Sistemas AV profesionales"],
      descripcion: "Apantallado individual por par más apantallado general. Alta inmunidad a EMI. Sus conectores propietarios limitaron su adopción masiva.",
      color: "#9C27B0",
      uso: "Industrial / Datos exigentes",
      ventajas: ["600 MHz de ancho de banda", "Excelente blindaje EMI", "Muy baja diafonía"],
      desventajas: ["Conectores propietarios (no RJ-45)", "Alto costo", "Poca adopción por incompatibilidad"],
      precioRelativo: 3.5
    },
    {
      id: "cat8",
      nombre: "Cat 8",
      año: 2016,
      norma: "TIA-568-C.2-1 / ISO/IEC 11801 Clase I/II",
      velocidadMax: 40,
      anchoBanda: 2000,
      distanciaMax: 30,
      conectores: "RJ-45 (Cat 8.1) / GG45-TERA (Cat 8.2)",
      par: "4 pares S/FTP, apantallado doble",
      pares: 4,
      apantallado: true,
      aplicaciones: ["Top-of-rack en data centers", "Interconexión de servidores", "Switch a servidor 40 Gbps"],
      descripcion: "Diseñado para conexiones de corta distancia en centros de datos. Soporta 25 Gbps y 40 Gbps. El doble apantallado es obligatorio.",
      color: "#F44336",
      uso: "Data centers de alta densidad",
      ventajas: ["Hasta 40 Gbps", "2000 MHz de ancho de banda", "Compatible RJ-45 (Cat 8.1)"],
      desventajas: ["Solo 30 m de distancia máxima", "Muy rígido y grueso", "Precio muy elevado"],
      precioRelativo: 6
    }
  ],

  criterios: [
    { id: "velocidadMax",   label: "Velocidad máx. (Gbps)",   tipo: "numero" },
    { id: "anchoBanda",     label: "Ancho de banda (MHz)",    tipo: "numero" },
    { id: "distanciaMax",   label: "Distancia máx. (m)",      tipo: "numero" },
    { id: "apantallado",    label: "Apantallado",             tipo: "booleano" },
    { id: "precioRelativo", label: "Precio relativo",         tipo: "numero" }
  ],

  aplicaciones: [
    "LAN doméstica",
    "Oficinas pequeñas",
    "Redes empresariales",
    "Data centers",
    "Campus universitarios",
    "Entornos industriales",
    "PoE / PoE+ / PoE++",
    "Top-of-rack"
  ],

  quizPreguntas: [
    {
      pregunta: "¿Qué categoría de cable garantiza 10 Gbps en los 100 metros completos del canal horizontal?",
      opciones: ["Cat 5e", "Cat 6", "Cat 6A", "Cat 7"],
      correcta: 2,
      explicacion: "Cat 6A opera a 500 MHz y garantiza 10GBASE-T en canal de 100 m. Cat 6 solo llega a 55 m para 10 Gbps."
    },
    {
      pregunta: "¿Cuál es el ancho de banda especificado para Cat 8?",
      opciones: ["250 MHz", "500 MHz", "1000 MHz", "2000 MHz"],
      correcta: 3,
      explicacion: "Cat 8 opera hasta 2000 MHz, lo que le permite soportar 25 Gbps y 40 Gbps en distancias cortas."
    },
    {
      pregunta: "¿Qué tipo de conector usa Cat 7 en su implementación nativa?",
      opciones: ["RJ-45 estándar", "GG45 o TERA", "LC dúplex", "SC conector"],
      correcta: 1,
      explicacion: "Cat 7 usa conectores propietarios GG45 o TERA que son incompatibles con las tomas RJ-45 convencionales, lo que limitó su adopción."
    },
    {
      pregunta: "¿Qué distancia máxima soporta Cat 8 para transmisión a 40 Gbps?",
      opciones: ["100 m", "55 m", "30 m", "15 m"],
      correcta: 2,
      explicacion: "Cat 8 está diseñado para conexiones cortas de máximo 30 metros, típicas de interconexiones top-of-rack en centros de datos."
    },
    {
      pregunta: "¿Cuántos MHz de ancho de banda tiene Cat 6?",
      opciones: ["100 MHz", "250 MHz", "500 MHz", "600 MHz"],
      correcta: 1,
      explicacion: "Cat 6 opera hasta 250 MHz. Cat 5e es 100 MHz, Cat 6A es 500 MHz y Cat 7 es 600 MHz."
    },
    {
      pregunta: "¿Qué categoría introdujo el separador interno (spline) para reducir la diafonía?",
      opciones: ["Cat 5e", "Cat 6", "Cat 6A", "Cat 8"],
      correcta: 1,
      explicacion: "Cat 6 introdujo el separador longitudinal plástico (spline) entre los cuatro pares, reduciendo la diafonía alien (ANEXT)."
    },
    {
      pregunta: "¿Cuál categoría es la recomendada para instalaciones nuevas con PoE++ (802.3bt, hasta 90 W)?",
      opciones: ["Cat 5e", "Cat 6", "Cat 6A", "Cat 7"],
      correcta: 2,
      explicacion: "TIA recomienda Cat 6A para PoE++ de alta potencia porque su mayor diámetro reduce la resistencia y el calentamiento del cable."
    }
  ]
};
