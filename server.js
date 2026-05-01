// ============================================
// BACKEND - Chatbot Fresas con Crema Angelos
// ============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// CONFIGURACIÓN GEMINI - API v1beta
// ============================================

const API_KEY = process.env.GEMINI_API_KEY;

// Función para llamar a Gemini directamente vía fetch (más compatible)
async function callGemini(prompt) {
  try {
    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Respuesta inesperada de Gemini');
    }
    
  } catch (error) {
    console.error('Error en callGemini:', error);
    throw error;
  }
}

// ============================================
// BASE DE CONOCIMIENTO LOCAL (RESPUESTAS GRATIS)
// ============================================

const FAQ = {
  // --- INFORMACIÓN BÁSICA ---
  precio: '🍓 **Menú Angelos:**\n• Fresas con Crema — $5.00\n• Waffle con Fresas — $7.00\n• Malteada de Fresas — $4.00\n• Brownie con Fresas — $6.00\n• Combo Familiar (2 Fresas + 2 Malteadas) — $16.00\n• Adicionales (chocolate, nueces, caramelo) — $1.00 c/u',
  
  horario: '🕐 **Horario de atención:**\n• Lunes a Sábado: 10:00 AM — 8:00 PM\n• Domingos: 11:00 AM — 6:00 PM\n• Festivos: Consultar disponibilidad',
  
  envio: '🚚 **Envíos:**\n• Ciudad de Guatemala: $3.00 (2-4 horas)\n• Departamentos: $5.00 (24-48 horas)\n• Pedido mínimo: $10.00\n• ¡Envío GRATIS en pedidos +$25!',
  
  ubicacion: '📍 **Ubicación:**\n• Ciudad de Guatemala, Zona 10\n• También tenemos delivery a domicilio\n• Puedes ordenar por WhatsApp y recoger en tienda',
  
  menu: '📋 **Nuestro Menú:**\n1. 🍓 Fresas con Crema — $5 (Clásico favorito)\n2. 🧇 Waffle Especial con Fresas — $7 (Crujiente y elegante)\n3. 🥤 Malteada de Fresas — $4 (Refrescante)\n4. 🍫 Brownie con Fresas — $6 (Intenso sabor chocolate)\n5. 🎁 Combo Familiar — $16 (2 Fresas + 2 Malteadas)',
  
  pago: '💳 **Métodos de pago:**\n• Efectivo\n• Transferencia bancaria\n• Tarjeta de crédito/débito\n• PayPal\n• Pago contra entrega (solo Ciudad de Guatemala)',
  
  contacto: '📞 **Contáctanos:**\n• WhatsApp: +502-XXXX-XXXX\n• Instagram: @angelos.fresas\n• Facebook: Fresas con Crema Angelos',
  
  promocion: '🎉 **Promoción del mes:**\n• Combo 2x1 en Fresas con Crema los martes\n• 20% de descuento en tu primera orden con código: ANGELOS20',

  // --- RECOMENDACIONES POR OCASIÓN (nuevas) ---
  recomendacion: '🍓 **¿No sabes qué elegir? Te ayudo:**\n• 🥇 **Más vendido:** Fresas con Crema ($5) - El clásico que nunca falla\n• 💕 **Para una cita:** Waffle con Fresas ($7) - Elegante y delicioso\n• 🎁 **Para regalar:** Brownie con Fresas ($6) - Presentación especial\n• 👶 **Para niños:** Malteada de Fresas ($4) - ¡Les encanta!\n• 🏠 **Para compartir en familia:** Combo Familiar ($16) - 4 productos\n• 🌞 **Para el calor:** Malteada ($4) - Super refrescante\n\n¿Tienes alguna ocasión especial? ¡Dime y te recomiendo el perfecto!',

  cita_romantica: '💕 **Para una cita romántica te recomiendo:**\n\n🥇 **Waffle con Fresas ($7)** - Elegante, visualmente hermoso y delicioso\n🥈 **Brownie con Fresas ($6)** - Intenso, romántico y para compartir\n\nAmbos se ven increíbles en fotos 📸 y el sabor es inolvidable. ¡Puedes pedirlo con envío a domicilio para sorprender! 🚚',

  para_ninos: '👶 **Para los peques te recomiendo:**\n\n🥇 **Malteada de Fresas ($4)** - Dulce, refrescante y les fascina\n🥈 **Fresas con Crema ($5)** - Clásico que todos aman\n\n¡Son los favoritos de nuestros clientes más jóvenes! 🍓✨',

  para_regalo: '🎁 **Para regalar te recomiendo:**\n\n🥇 **Brownie con Fresas ($6)** - Presentación elegante, sabor premium\n🥈 **Combo Familiar ($16)** - Para que compartan y disfruten juntos\n\nPodemos agregar una nota personalizada. ¡Escríbenos por WhatsApp! 💝',

  para_compartir: '🏠 **Para compartir con familia/amigos:**\n\n🥇 **Combo Familiar ($16)** - 2 Fresas con Crema + 2 Malteadas\n🥈 **2 Waffles con Fresas ($14)** - Para que cada uno tenga el suyo\n\n¡Perfecto para reuniones, cumpleaños o simplemente un domingo especial! 🎉',

  sin_azucar: '⚠️ **Sobre opciones sin azúcar:**\n\nNuestros productos contienen azúcar natural de las fresas 🍓 y crema endulzada.\n\nTe recomiendo:\n• 🍓 **Fresas naturales sin crema** - Solo la fruta fresca\n• 📲 **Consulta personalizada** - Escríbenos por WhatsApp: +502-XXXX-XXXX\n\nPodemos preparar algo especial según tus necesidades. 💚',

  vegano: '🌱 **Sobre opciones veganas:**\n\nNuestra crema contiene lácteos 🥛, pero tenemos alternativas:\n• 🍓 **Fresas naturales sin crema** - 100% fruta fresca\n• 📲 **Consulta personalizada** - Escríbenos por WhatsApp: +502-XXXX-XXXX\n\nEstamos trabajando en opciones con crema vegetal. ¡Muy pronto! 🌿',

  para_calor: '🌞 **Para el calor te recomiendo:**\n\n🥇 **Malteada de Fresas ($4)** - Refrescante, cremosa y deliciosa\n🥈 **Fresas con Crema ($5)** - Clásica, pero puedes pedirla extra fría ❄️\n\n¡La malteada es la favorita en verano! 🥤✨',

  mas_vendido: '🏆 **Nuestros más vendidos:**\n\n🥇 **Fresas con Crema ($5)** - El clásico irresistible\n🥈 **Waffle con Fresas ($7)** - El favorito de Instagram\n🥉 **Malteada de Fresas ($4)** - Perfecta para el calor\n\n¿Cuál te animas a probar? 🍓',

  diferencia_productos: '🤔 **¿Cuál elegir? Te explico las diferencias:**\n\n🍓 **Fresas con Crema ($5)** - Clásico, cremoso, equilibrado\n🧇 **Waffle ($7)** - Más elaborado, crujiente, para ocasiones especiales\n🥤 **Malteada ($4)** - Bebible, refrescante, para llevar\n🍫 **Brownie ($6)** - Intenso chocolate, para amantes del dulce\n\n¿Tienes alguna preferencia de sabor o textura? ¡Te ayudo! ✨',

  tamanio_porcion: '📏 **Tamaños de porción:**\n• 🍓 Fresas con Crema: Porción generosa (aprox. 200g de fresas)\n• 🧇 Waffle: Waffle belga completo con toppings\n• 🥤 Malteada: 16 oz (473ml) - Vaso grande\n• 🍫 Brownie: Porción cuadrada generosa\n\n¿Te gustaría algo más grande o más ligero? 🍓',

  tiempo_preparacion: '⏱️ **Tiempo de preparación:**\n• 🍓 Fresas con Crema: 5-10 minutos\n• 🧇 Waffle: 10-15 minutos (se hace fresco)\n• 🥤 Malteada: 3-5 minutos\n• 🍫 Brownie: 5 minutos (ya preparado, solo armamos)\n\nPara pedidos grandes recomendamos ordenar con anticipación. ¡Pero siempre rápido! ⚡',

  fresas_frescas: '🍓 **Sobre nuestras fresas:**\n• Fresas frescas importadas de alta calidad\n• Preparadas el día de la orden\n• Lavadas y seleccionadas una por una\n• Temporada: Todo el año (importadas de climas óptimos)\n\n¡Dulces, jugosas y perfectas! ✨',

  entrega_domicilio: '🚚 **Sobre entrega a domicilio:**\n• Ciudad de Guatemala: $3 (2-4 horas)\n• Departamentos: $5 (24-48 horas)\n• Pedido mínimo: $10\n• Gratis en pedidos +$25\n• Empaque especial para mantener frescura\n• Pago contra entrega disponible\n\n¡Llegamos rápido y todo perfecto! 📦',

  primera_vez: '👋 **¡Primera vez en Angelos? Bienvenido!**\n\nTe recomiendo empezar con:\n🥇 **Fresas con Crema ($5)** - Nuestro clásico, el favorito de todos\n\nY si quieres probar algo diferente:\n🥈 **Waffle con Fresas ($7)** - ¡Te sorprenderá!\n\nUsa el código **ANGELOS20** para 20% de descuento en tu primera orden 🎉'
};
// ============================================
// DETECTOR DE INTENCIONES
// ============================================

function detectarIntencion(mensaje) {
  const msg = mensaje.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // INFORMACIÓN BÁSICA
  if (msg.match(/precio|cuanto|cuesta|vale|costo|menu|catalogo|productos/)) return 'precio';
  if (msg.match(/hora|horario|abierto|cierran|atienden|dia|domingo|sabado/)) return 'horario';
  if (msg.match(/envio|delivery|mandan|envian|domicilio|reparto|zona/)) return 'envio';
  if (msg.match(/donde|ubicacion|direccion|local|tienda|queda|encuentran|maps/)) return 'ubicacion';
  if (msg.match(/menu|tienen|opciones|que venden|especialidades|platillos/)) return 'menu';
  if (msg.match(/pago|pagar|tarjeta|efectivo|transferencia|paypal|contra entrega/)) return 'pago';
  if (msg.match(/contacto|whatsapp|telefono|llamar|instagram|facebook|redes/)) return 'contacto';
  if (msg.match(/promo|descuento|oferta|descuentos|2x1|gratis|codigo/)) return 'promocion';
  
  // RECOMENDACIONES POR OCASIÓN (nuevas)
  if (msg.match(/recomienda|recomiendas|que me recomiendas|que elegir|que pedir|que comprar|no se que|indeciso|ayudame a elegir/)) return 'recomendacion';
  if (msg.match(/cita|romantica|novia|novio|pareja|san valentin|aniversario|enamorados/)) return 'cita_romantica';
  if (msg.match(/nino|ninos|peque|peques|bebe|infantil|hijo|hija|escolar/)) return 'para_ninos';
  if (msg.match(/regalo|regalar|obsequio|detalle|sorpresa|cumpleanos|cumple/)) return 'para_regalo';
  if (msg.match(/compartir|familia|amigos|reunion|fiesta|grupo|varios/)) return 'para_compartir';
  if (msg.match(/sin azucar|diabetico|diabetes|bajo azucar|light|diet/)) return 'sin_azucar';
  if (msg.match(/vegano|vegana|sin lacteos|sin leche|sin crema|plant based/)) return 'vegano';
  if (msg.match(/calor|refrescante|frio|verano|sed|bebida/)) return 'para_calor';
  if (msg.match(/mas vendido|popular|favorito|mejor|top|recomendado/)) return 'mas_vendido';
  if (msg.match(/diferencia|cual es mejor|que diferencia|comparar|versus|vs/)) return 'diferencia_productos';
  if (msg.match(/tamano|porcion|grande|pequeno|cuanto trae|cuanto es/)) return 'tamanio_porcion';
  if (msg.match(/tiempo|demora|rapido|lento|cuanto tarda|preparacion/)) return 'tiempo_preparacion';
  if (msg.match(/frescas|frescura|calidad|de donde|origen|importadas/)) return 'fresas_frescas';
  if (msg.match(/domicilio|entrega|llegan|mandan a casa|a domicilio/)) return 'entrega_domicilio';
  if (msg.match(/primera vez|nuevo|nunca he|primera orden|nuevo cliente/)) return 'primera_vez';
  
  // Necesita IA (pregunta compleja no cubierta)
  return 'ia';
}

// ============================================
// ENDPOINT PRINCIPAL DEL CHATBOT
// ============================================

app.post('/chat', async (req, res) => {
  const { mensaje } = req.body;
  
  if (!mensaje || mensaje.trim() === '') {
    return res.json({
      respuesta: '¡Hola! 🍓 Soy Fresi, tu asistente de Angelos Fresas con Crema. ¿En qué puedo ayudarte hoy?',
      tipo: 'bienvenida',
      fuente: 'local'
    });
  }
  
  const intencion = detectarIntencion(mensaje);
  
  // ✅ RESPUESTA LOCAL (GRATIS)
  if (intencion !== 'ia') {
    return res.json({
      respuesta: FAQ[intencion],
      tipo: 'faq',
      fuente: 'local'
    });
  }
  
  // 🤖 RESPUESTA CON GEMINI API v1beta
  try {
    const prompt = `Eres "Fresi" 🍓, la asistente virtual amable, entusiasta y EXPERTA en postres de "Angelos Fresas con Crema", un negocio de postres con fresas en Guatemala.

TU PERSONALIDAD:
- Eres una vendedora experta que conoce PERFECTAMENTE cada producto
- Usas emojis de fresa 🍓 y corazones ❤️
- Eres cálida, cercana y profesional
- SIEMPRE das recomendaciones personalizadas según la ocasión del cliente
- Nunca respondes solo "Hola" o "¡Hola!" - siempre añades valor

INFORMACIÓN DEL NEGOCIO:
- Menú: 
  * Fresas con Crema ($5) - Clásico, cremoso, perfecto para cualquier ocasión
  * Waffle con Fresas ($7) - Crujiente waffle belga con fresas frescas y crema
  * Malteada de Fresas ($4) - Refrescante, ideal para el calor
  * Brownie con Fresas ($6) - Intenso sabor a chocolate con fresas dulces
  * Combo Familiar: 2 Fresas + 2 Malteadas ($16) - Perfecto para compartir
- Horario: Lun-Sab 10am-8pm, Dom 11am-6pm
- Ubicación: Ciudad de Guatemala, Zona 10
- Envíos: Ciudad $3 (2-4h), Departamentos $5 (24-48h), mínimo $10, gratis +$25
- Pagos: Efectivo, transferencia, tarjeta, PayPal, contra entrega (solo ciudad)
- WhatsApp: +502-XXXX-XXXX
- Instagram: @angelos.fresas

REGLAS DE RECOMENDACIÓN:
- Si preguntan "qué me recomiendas" o "para una cita": Sugiere Waffle con Fresas ($7) o Brownie con Fresas ($6) - son los más elegantes y románticos
- Si preguntan "para el calor" o "refrescante": Sugiere Malteada de Fresas ($4)
- Si preguntan "clásico" o "seguro": Sugiere Fresas con Crema ($5)
- Si preguntan "para compartir" o "familia": Sugiere Combo Familiar ($16)
- Si preguntan "sin azúcar" o "diabético": Sé honesta - "Nuestros productos contienen azúcar natural de las fresas y crema endulzada. Te recomiendo consultar con nosotros por WhatsApp para opciones personalizadas 🍓"
- Si preguntan "vegano" o "sin lácteos": "Nuestra crema contiene lácteos, pero podemos prepararte fresas naturales sin crema. Escríbenos por WhatsApp 🍓"
- Si preguntan "para niños": Sugiere Malteada ($4) o Fresas con Crema ($5) - son los favoritos de los peques
- Si preguntan "para regalo": Sugiere Brownie con Fresas ($6) - viene presentado elegantemente

REGLAS IMPORTANTES:
- Responde en español, 2-4 oraciones máximo
- Sé muy amable, usa emojis de fresa 🍓
- SIEMPRE da una recomendación específica con precio cuando preguntan "qué me recomiendas"
- Si no sabes algo, sugiere contactar por WhatsApp: +502-XXXX-XXXX
- No inventes precios, promociones ni información falsa

El cliente dice: "${mensaje}"

Responde como Fresi:`;
    const respuestaIA = await callGemini(prompt);
    
    res.json({
      respuesta: respuestaIA,
      tipo: 'ia',
      fuente: 'gemini'
    });
    
  } catch (error) {
    console.error('Error Gemini:', error);
    res.json({
      respuesta: '🍓 ¡Ups! Tuve un problemita técnico. Por favor escríbenos por WhatsApp: +503 78195474 o intenta de nuevo.',
      tipo: 'error',
      fuente: 'error'
    });
  }
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
