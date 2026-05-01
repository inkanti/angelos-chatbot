// ============================================
// BACKEND - Chatbot Angelos con Menús Interactivos
// ============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

// ============================================
// DATOS REALES DEL NEGOCIO
// ============================================

const NEGOCIO = {
  nombre: 'Angelos Fresas con Crema y Minidonas',
  pais: 'El Salvador',
  direccion: 'Colonia Amatepec, Pasaje 1, Casa 30',
  whatsapp: '61280902',
  whatsappLink: 'https://wa.me/50361280902',
  tiktok: '@angelos3900',
  tiktokLink: 'https://www.tiktok.com/@angelos3900',
  paginaWeb: 'https://tguw4a2gzlr42.kimi.page/',
  horario: 'Lunes a Sábado: 10:00 AM — 8:00 PM\n• Domingos: 11:00 AM — 6:00 PM',
  envioCiudad: '$3.00 (2-4 horas)',
  envioDepartamentos: '$5.00 (24-48 horas)'
};

// ============================================
// MENÚ PRINCIPAL
// ============================================

const VOLVER_MENU = `\n\n⬅️ **Escribe 0 para volver al menú principal**`;

const MENU_PRINCIPAL = `🍓 **¡Bienvenido a Angelos Fresas con Crema y Minidonas!**

Soy **Fresi**, tu asistente virtual. ¿Qué necesitas?

📋 **MENÚ DE OPCIONES:**
**1️⃣** Ver productos y precios
**2️⃣** Recomendaciones por ocasión
**3️⃣** Horario y ubicación
**4️⃣** Envíos y métodos de pago
**5️⃣** Promociones y descuentos
**6️⃣** Contacto y redes sociales
**0️⃣** Hablar con una persona

👉 *Escribe el número de la opción que necesitas*`;

const SUBMENU_RECOMENDACIONES = `💕 **¿Para qué ocasión necesitas?**

**1️⃣** Cita romántica 💕
**2️⃣** Para niños 👶
**3️⃣** Para regalar 🎁
**4️⃣** Para compartir en familia 🏠
**5️⃣** Para el calor 🌞
**6️⃣** Opciones sin azúcar / diabéticos ⚠️
**7️⃣** Opciones veganas 🌱
**0️⃣** Volver al menú principal

👉 *Escribe el número de tu opción*${VOLVER_MENU}`;

const PRODUCTOS = `📋 **NUESTROS PRODUCTOS:**

🍓 **Fresas con Crema** — $5.00
   Fresas frescas con crema batida artesanal. ¡El clásico que nunca falla!

🍩 **Minidonas Preparadas** — $5.00
   Deliciosas minidonas con toppings especiales. Crujientes por fuera, suaves por dentro.

🍓🍩 **Combo Fresas + Minidona** — $9.00
   La mejor combinación: fresas con crema + minidona preparada.

🎁 **Combo Familiar** — $16.00
   2 Fresas con Crema + 2 Minidonas. Para compartir en familia.

➕ **Adicionales:** Chocolate, nueces, caramelo, sprinkles — $1.00 c/u

💡 *¿Necesitas recomendación? Escribe **2** en el menú principal*${VOLVER_MENU}`;

const RECOMENDACIONES = {
  '1': `💕 **PARA UNA CITA ROMÁNTICA:**

🥇 **Fresas con Crema ($5)** ⭐ RECOMENDADO
   • Visualmente hermosas para fotos 📸
   • Elegante y romántico
   • Perfecto para compartir dulcemente

🥈 **Minidonas Preparadas ($5)**
   • Originales y sorprendentes
   • Diferente a lo común, ¡impacta!

💡 *Extras: Podemos agregar chocolate derretido y topping especial.*

📲 ¿Quieres ordenar? Escríbenos por WhatsApp: ${NEGOCIO.whatsapp}${VOLVER_MENU}`,

  '2': `👶 **PARA NIÑOS:**

🥇 **Minidonas Preparadas ($5)** ⭐ FAVORITO
   • Les fascina la forma y los colores
   • Fácil de comer, ¡no se ensucian tanto!

🥈 **Fresas con Crema ($5)**
   • Clásico que todos aman
   • Pueden comer las fresas con las manos

💡 *Los peques adoran las minidonas. ¡Son nuestro bestseller infantil!*${VOLVER_MENU}`,

  '3': `🎁 **PARA REGALAR:**

🥇 **Combo Fresas + Minidona ($9)** ⭐ RECOMENDADO
   • Presentación elegante y variada
   • Se ve cariñoso y especial

🥈 **Combo Familiar ($16)**
   • Para que compartan y disfruten juntos
   • Ideal para cumpleaños o aniversarios

💡 *Podemos preparar un empaque especial. ¡Escríbenos por WhatsApp!*${VOLVER_MENU}`,

  '4': `🏠 **PARA COMPARTIR EN FAMILIA:**

🥇 **Combo Familiar ($16)** ⭐ PERFECTO
   • 2 Fresas con Crema + 2 Minidonas
   • 4 productos para todos

🥈 **2 Combos Fresas + Minidona ($18)**
   • Más variedad para todos
   • Cada uno elige lo que quiere

💡 *Ideal para reuniones, cumpleaños o domingos en familia.*${VOLVER_MENU}`,

  '5': `🌞 **PARA EL CALOR:**

🥇 **Fresas con Crema ($5)** ⭐ REFRESCANTE
   • Las fresas naturales refrescan
   • Puedes pedirlas extra frías ❄️

🥈 **Minidonas ($5)**
   • Deliciosas a cualquier temperatura
   • Perfectas para merendar

💡 *¡Las fresas son la reina del verano! 🍓*${VOLVER_MENU}`,

  '6': `⚠️ **OPCIONES SIN AZÚCAR / DIABÉTICOS:**

Lamentablemente, nuestros productos actuales contienen azúcar:
• Crema endulzada en Fresas con Crema
• Glaseado y toppings en Minidonas

**Alternativas disponibles:**
🍓 **Fresas naturales SIN crema** — Solo la fruta fresca

**Consulta personalizada:**
📲 WhatsApp: ${NEGOCIO.whatsapp}
Podemos evaluar preparar algo especial según tus necesidades. 💚${VOLVER_MENU}`,

  '7': `🌱 **OPCIONES VEGANAS:**

Nuestra crema contiene lácteos 🥛, pero tenemos alternativas:

🍓 **Fresas naturales SIN crema** — 100% fruta fresca

**Consulta personalizada:**
📲 WhatsApp: ${NEGOCIO.whatsapp}

Estamos trabajando en opciones con crema vegetal. ¡Muy pronto! 🌿${VOLVER_MENU}`
};

const HORARIO_UBICACION = `🕐 **HORARIO Y UBICACIÓN:**

📍 **Dirección:** ${NEGOCIO.direccion}
🇸🇻 **País:** ${NEGOCIO.pais}
🚚 **Delivery:** Disponible

⏰ **Horario:**
• ${NEGOCIO.horario}${VOLVER_MENU}`;

const ENVIOS_PAGOS = `🚚 **ENVÍOS Y PAGOS:**

📦 **Envíos en El Salvador:**
• Ciudad: ${NEGOCIO.envioCiudad}
• Departamentos: ${NEGOCIO.envioDepartamentos}
• Pedido mínimo: $10.00
• ¡Envío GRATIS en pedidos +$25!

💳 **Métodos de pago:**
• Efectivo
• Transferencia bancaria
• Chivo Wallet
• Pago contra entrega (en otros métodos de pago cancelar antes y enviar comprobante de pago al WhatsApp 6128-0902)${VOLVER_MENU}`;

const PROMOCIONES = `🎉 **PROMOCIONES ACTIVAS:**

• Combo 2x1 en Fresas con Crema — **Todos los martes**
• 20% de descuento en primera orden
   Código: **ANGELOS20**

💡 *Aplica en compras directas por WhatsApp o en tienda.*

🔗 **Nuestra página web:** ${NEGOCIO.paginaWeb}${VOLVER_MENU}`;

const CONTACTO = `📞 **CONTÁCTANOS:**

📲 **WhatsApp:** ${NEGOCIO.whatsapp}
   👉 ${NEGOCIO.whatsappLink}
   (Pedidos, consultas, delivery)

🎵 **TikTok:** ${NEGOCIO.tiktok}
   👉 ${NEGOCIO.tiktokLink}
   (Videos, promociones, novedades)

🌐 **Página Web:** ${NEGOCIO.paginaWeb}${VOLVER_MENU}`;

const HUMANO = `👩‍💼 **HABLAR CON UNA PERSONA:**

Te conecto con nuestro equipo humano:

📲 **WhatsApp:** ${NEGOCIO.whatsapp}
   Responden de lunes a sábado, 10am a 8pm

⏰ *Si es fuera de horario, te responderán al siguiente día hábil.*

🔗 También puedes visitarnos en: ${NEGOCIO.paginaWeb}

Gracias por preferir Angelos Fresas con Crema y Minidonas 🍓🍩${VOLVER_MENU}`;

const AGRADECIMIENTO = `🍓 ¡Con gusto! Estoy aquí cuando me necesites.

Escribe **hola** o **menu** para ver las opciones.
O visita nuestra web: ${NEGOCIO.paginaWeb}

¡Que tengas un día dulce! 🍓🍩✨`;

const NO_ENTENDIDO = `🤔 No estoy segura de entender. ¿Puedes elegir una opción?

${MENU_PRINCIPAL}`;

// ============================================
// DETECTOR DE INTENCIONES
// ============================================

function detectarIntencion(mensaje) {
  const msg = mensaje.toLowerCase().trim();
  
  // SALUDOS Y MENÚ PRINCIPAL
  if (msg.match(/^(hola|buenos|buenas|hey|hi|hello|menu|inicio|empezar|comenzar|opciones|ayuda|info)$/)) return 'menu_principal';
  
  // NÚMEROS DEL MENÚ PRINCIPAL
  if (msg === '1' || msg.match(/^(productos|precios|especialidades|ver productos|que tienen|catalogo|fresas|minidonas|donas)$/)) return 'productos';
  if (msg === '2' || msg.match(/^(recomendaciones|recomienda|que me recomiendas|ocasion|elegir|ayudame|indeciso)$/)) return 'submenu_recomendaciones';
  if (msg === '3' || msg.match(/^(horario|ubicacion|donde|a que hora|direccion|local|amatepec|pasaje|colonia)$/)) return 'horario_ubicacion';
  if (msg === '4' || msg.match(/^(envios|envio|pagos|pago|delivery|domicilio|metodos de pago|enviar|mandar)$/)) return 'envios_pagos';
  if (msg === '5' || msg.match(/^(promociones|promo|descuento|oferta|descuentos|2x1|codigo)$/)) return 'promociones';
  if (msg === '6' || msg.match(/^(contacto|whatsapp|telefono|llamar|tiktok|redes|hablar|pagina web|web|link)$/)) return 'contacto';
  if (msg === '0' || msg.match(/^(persona|humano|agente|vendedor|empleado|hablar con alguien|atencion)$/)) return 'humano';
  
  // NÚMEROS DEL SUBMENÚ DE RECOMENDACIONES
  if (msg === '1' || msg.match(/^(cita|romantica|novia|novio|pareja|aniversario|san valentin|enamorados)$/)) return 'rec_cita';
  if (msg === '2' || msg.match(/^(ninos|niños|peques|bebe|infantil|hijo|hija|escolar)$/)) return 'rec_ninos';
  if (msg === '3' || msg.match(/^(regalo|regalar|obsequio|detalle|sorpresa|cumpleanos|cumple)$/)) return 'rec_regalo';
  if (msg === '4' || msg.match(/^(compartir|familia|amigos|reunion|fiesta|grupo|varios)$/)) return 'rec_compartir';
  if (msg === '5' || msg.match(/^(calor|refrescante|frio|verano|sed|bebida)$/)) return 'rec_calor';
  if (msg === '6' || msg.match(/^(sin azucar|diabetico|diabetes|bajo azucar|sin endulzar)$/)) return 'rec_sin_azucar';
  if (msg === '7' || msg.match(/^(vegano|vegana|sin lacteos|sin leche|sin crema)$/)) return 'rec_vegano';
  if (msg === '0' || msg.match(/^(volver|atras|menu principal|inicio|principal)$/)) return 'menu_principal';
  
  // PREGUNTAS ESPECÍFICAS
  if (msg.match(/^(gracias|thank|thanks|ok|perfecto|excelente|bueno|genial)$/)) return 'agradecimiento';
  
  // SI NO ENTIENDE
  return 'no_entendido';
}

// ============================================
// RESPUESTAS RÁPIDAS
// ============================================

const RESPUESTAS = {
  'menu_principal': MENU_PRINCIPAL,
  'productos': PRODUCTOS,
  'submenu_recomendaciones': SUBMENU_RECOMENDACIONES,
  'horario_ubicacion': HORARIO_UBICACION,
  'envios_pagos': ENVIOS_PAGOS,
  'promociones': PROMOCIONES,
  'contacto': CONTACTO,
  'humano': HUMANO,
  'rec_cita': RECOMENDACIONES['1'],
  'rec_ninos': RECOMENDACIONES['2'],
  'rec_regalo': RECOMENDACIONES['3'],
  'rec_compartir': RECOMENDACIONES['4'],
  'rec_calor': RECOMENDACIONES['5'],
  'rec_sin_azucar': RECOMENDACIONES['6'],
  'rec_vegano': RECOMENDACIONES['7'],
  'agradecimiento': AGRADECIMIENTO,
  'no_entendido': NO_ENTENDIDO
};

// ============================================
// ENDPOINT PRINCIPAL DEL CHATBOT
// ============================================

app.post('/chat', async (req, res) => {
  const { mensaje } = req.body;
  
  if (!mensaje || mensaje.trim() === '') {
    return res.json({
      respuesta: MENU_PRINCIPAL,
      tipo: 'menu',
      fuente: 'local'
    });
  }
  
  const intencion = detectarIntencion(mensaje);
  
  // ✅ RESPUESTA LOCAL INMEDIATA (100% GRATIS)
  if (RESPUESTAS[intencion]) {
    return res.json({
      respuesta: RESPUESTAS[intencion],
      tipo: 'menu',
      fuente: 'local'
    });
  }
  
  // Si llega aquí, algo raro pasó
  res.json({
    respuesta: MENU_PRINCIPAL,
    tipo: 'menu',
    fuente: 'local'
  });
});

// Endpoint de verificación
app.get('/', (req, res) => {
  res.json({ 
    status: '✅ Angelos Chatbot activo',
    mensaje: 'Backend funcionando correctamente 🍓🍩',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🍓🍩 Servidor Angelos corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET  http://localhost:${PORT}/         (verificación)`);
  console.log(`   POST http://localhost:${PORT}/chat     (chatbot)`);
});
