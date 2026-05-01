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
// MENÚ PRINCIPAL (siempre se muestra al inicio)
// ============================================

const MENU_PRINCIPAL = `🍓 **¡Bienvenido a Angelos Fresas con Crema!**

Soy **Fresi**, tu asistente virtual. ¿Qué necesitas?

📋 **MENÚ DE OPCIONES:**
**1️⃣** Ver productos y precios
**2️⃣** Recomendaciones por ocasión
**3️⃣** Horario y ubicación
**4️⃣** Envíos y métodos de pago
**5️⃣** Promociones y descuentos
**6️⃣** Contacto y WhatsApp
**0️⃣** Hablar con una persona

👉 *Escribe el número de la opción que necesitas*`;

// ============================================
// SUBMENÚ 2: RECOMENDACIONES
// ============================================

const SUBMENU_RECOMENDACIONES = `💕 **¿Para qué ocasión necesitas?**

**1️⃣** Cita romántica 💕
**2️⃣** Para niños 👶
**3️⃣** Para regalar 🎁
**4️⃣** Para compartir en familia 🏠
**5️⃣** Para el calor 🌞
**6️⃣** Opciones sin azúcar / diabéticos ⚠️
**7️⃣** Opciones veganas 🌱
**0️⃣** Volver al menú principal

👉 *Escribe el número de tu opción*`;

// ============================================
// RESPUESTAS DE PRODUCTOS
// ============================================

const PRODUCTOS = `📋 **NUESTROS PRODUCTOS:**

🍓 **Fresas con Crema** — $5.00
   El clásico favorito. Fresas frescas con crema batida artesanal.

🧇 **Waffle con Fresas** — $7.00
   Waffle belga crujiente con fresas y crema. ¡Perfecto para fotos!

🥤 **Malteada de Fresas** — $4.00
   Refrescante, cremosa y deliciosa. Ideal para el calor.

🍫 **Brownie con Fresas** — $6.00
   Intenso chocolate con fresas dulces. Para los amantes del dulce.

🎁 **Combo Familiar** — $16.00
   2 Fresas con Crema + 2 Malteadas. Para compartir.

➕ **Adicionales:** Chocolate, nueces, caramelo — $1.00 c/u

💡 *¿Necesitas recomendación? Escribe **2** en el menú principal*`;

// ============================================
// RESPUESTAS POR OCASIÓN
// ============================================

const RECOMENDACIONES = {
  '1': `💕 **PARA UNA CITA ROMÁNTICA:**

🥇 **Waffle con Fresas ($7)** ⭐ RECOMENDADO
   • Visualmente hermoso para fotos 📸
   • Elegante y sofisticado
   • Se ve especial y cuidado

🥈 **Brownie con Fresas ($6)**
   • Intenso sabor a chocolate
   • Perfecto para compartir y crear momento íntimo
   • Presentación elegante

💡 *Extras: Podemos agregar chocolate derretido y envío a domicilio con nota especial.*

📲 ¿Quieres ordenar? Escríbenos por WhatsApp: +502-XXXX-XXXX`,

  '2': `👶 **PARA NIÑOS:**

🥇 **Malteada de Fresas ($4)** ⭐ FAVORITO
   • Dulce, refrescante y les fascina
   • Fácil de tomar, no se ensucian tanto

🥈 **Fresas con Crema ($5)**
   • Clásico que todos aman
   • Pueden comer las fresas con las manos

💡 *Los peques adoran la malteada. ¡Es nuestro bestseller infantil!*`,

  '3': `🎁 **PARA REGALAR:**

🥇 **Brownie con Fresas ($6)** ⭐ RECOMENDADO
   • Presentación elegante y premium
   • Se ve cariñoso y especial

🥈 **Combo Familiar ($16)**
   • Para que compartan y disfruten juntos
   • Ideal para cumpleaños o aniversarios

💡 *Podemos agregar una nota personalizada. ¡Escríbenos por WhatsApp!*`,

  '4': `🏠 **PARA COMPARTIR EN FAMILIA:**

🥇 **Combo Familiar ($16)** ⭐ PERFECTO
   • 2 Fresas con Crema + 2 Malteadas
   • 4 productos para todos

🥈 **2 Waffles con Fresas ($14)**
   • Cada uno tiene su waffle completo
   • Más elaborado y especial

💡 *Ideal para reuniones, cumpleaños o domingos en familia.*`,

  '5': `🌞 **PARA EL CALOR:**

🥇 **Malteada de Fresas ($4)** ⭐ REFRESCANTE
   • Bebible, fría y deliciosa
   • La favorita en verano

🥈 **Fresas con Crema ($5)**
   • Puedes pedirla extra fría ❄️
   • Las fresas naturales refrescan

💡 *¡La malteada es la reina del verano! 🥤*`,

  '6': `⚠️ **OPCIONES SIN AZÚCAR / DIABÉTICOS:**

Lamentablemente, nuestros productos actuales contienen azúcar:
• Crema endulzada en Fresas con Crema
• Masa y crema en Waffle
• Helado y leche en Malteada
• Chocolate y azúcar en Brownie

**Alternativas disponibles:**
🍓 **Fresas naturales SIN crema** — Solo la fruta fresca

**Consulta personalizada:**
📲 WhatsApp: +502-XXXX-XXXX
Podemos evaluar preparar algo especial según tus necesidades. 💚`,

  '7': `🌱 **OPCIONES VEGANAS:**

Nuestra crema contiene lácteos 🥛, pero tenemos alternativas:

🍓 **Fresas naturales SIN crema** — 100% fruta fresca

**Consulta personalizada:**
📲 WhatsApp: +502-XXXX-XXXX

Estamos trabajando en opciones con crema vegetal. ¡Muy pronto! 🌿`
};

// ============================================
// OTRAS RESPUESTAS
// ============================================

const HORARIO_UBICACION = `🕐 **HORARIO Y UBICACIÓN:**

📍 **Ubicación:** Ciudad de Guatemala, Zona 10
🚚 **Delivery:** Disponible a toda la ciudad

⏰ **Horario:**
• Lunes a Sábado: 10:00 AM — 8:00 PM
• Domingos: 11:00 AM — 6:00 PM
• Festivos: Consultar disponibilidad

📲 **WhatsApp:** +502-XXXX-XXXX
📸 **Instagram:** @angelos.fresas`;

const ENVIOS_PAGOS = `🚚 **ENVÍOS Y PAGOS:**

📦 **Envíos:**
• Ciudad de Guatemala: $3.00 (2-4 horas)
• Departamentos: $5.00 (24-48 horas)
• Pedido mínimo: $10.00
• ¡Envío GRATIS en pedidos +$25!

💳 **Métodos de pago:**
• Efectivo
• Transferencia bancaria
• Tarjeta de crédito/débito
• PayPal
• Pago contra entrega (solo Ciudad de Guatemala)`;

const PROMOCIONES = `🎉 **PROMOCIONES ACTIVAS:**

• Combo 2x1 en Fresas con Crema — **Todos los martes**
• 20% de descuento en primera orden
   Código: **ANGELOS20**

💡 *Aplica en compras directas por WhatsApp o en tienda.*`;

const CONTACTO = `📞 **CONTÁCTANOS:**

📲 **WhatsApp:** +502-XXXX-XXXX
   (Pedidos, consultas, delivery)

📸 **Instagram:** @angelos.fresas
   (Fotos, promociones, novedades)

📘 **Facebook:** Fresas con Crema Angelos

💬 *Responde rápido por WhatsApp para pedidos urgentes*`;

const HUMANO = `👩‍💼 **HABLAR CON UNA PERSONA:**

Te conecto con nuestro equipo humano:

📲 **WhatsApp:** +502-XXXX-XXXX
   Responden de lunes a sábado, 10am a 8pm

⏰ *Si es fuera de horario, te responderán al siguiente día hábil.*

Gracias por preferir Angelos Fresas con Crema 🍓`;

// ============================================
// DETECTOR DE INTENCIONES (MENÚ NUMÉRICO)
// ============================================

function detectarIntencion(mensaje) {
  const msg = mensaje.toLowerCase().trim();
  
  // SALUDOS Y MENÚ PRINCIPAL
  if (msg.match(/^(hola|buenos|buenas|hey|hi|hello|menu|inicio|empezar|comenzar|opciones|ayuda|info)$/)) return 'menu_principal';
  
  // NÚMEROS DEL MENÚ PRINCIPAL
  if (msg === '1' || msg.match(/^(productos|precios|especialidades|ver productos|que tienen|catalogo)$/)) return 'productos';
  if (msg === '2' || msg.match(/^(recomendaciones|recomienda|que me recomiendas|ocasion|elegir|ayudame|indeciso)$/)) return 'submenu_recomendaciones';
  if (msg === '3' || msg.match(/^(horario|ubicacion|donde|a que hora|direccion|local)$/)) return 'horario_ubicacion';
  if (msg === '4' || msg.match(/^(envios|envio|pagos|pago|delivery|domicilio|metodos de pago)$/)) return 'envios_pagos';
  if (msg === '5' || msg.match(/^(promociones|promo|descuento|oferta|descuentos|2x1|codigo)$/)) return 'promociones';
  if (msg === '6' || msg.match(/^(contacto|whatsapp|telefono|llamar|instagram|facebook|redes|hablar)$/)) return 'contacto';
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
  
  // PREGUNTAS ESPECÍFICAS QUE VAN DIRECTO (sin menú)
  if (msg.match(/^(gracias|thank|thanks|ok|perfecto|excelente|bueno|genial)$/)) return 'agradecimiento';
  
  // SI NO ENTIENDE → MENÚ PRINCIPAL
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
  'agradecimiento': '🍓 ¡Con gusto! Estoy aquí cuando me necesites. Escribe **hola** o **menu** para ver las opciones. ¡Que tengas un día dulce! 🍓✨',
  'no_entendido': `🤔 No estoy segura de entender. ¿Puedes elegir una opción?

${MENU_PRINCIPAL}`
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
    mensaje: 'Backend funcionando correctamente 🍓',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🍓 Servidor Angelos corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET  http://localhost:${PORT}/         (verificación)`);
  console.log(`   POST http://localhost:${PORT}/chat     (chatbot)`);
});
