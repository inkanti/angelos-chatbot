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
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
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
  precio: '🍓 **Menú Angelos:**\n• Fresas con Crema — $5.00\n• Waffle con Fresas — $7.00\n• Malteada de Fresas — $4.00\n• Brownie con Fresas — $6.00\n• Adicionales (chocolate, nueces, caramelo) — $1.00 c/u',
  
  horario: '🕐 **Horario de atención:**\n• Lunes a Sábado: 10:00 AM — 8:00 PM\n• Domingos: 11:00 AM — 6:00 PM\n• Festivos: Consultar disponibilidad',
  
  envio: '🚚 **Envíos:**\n• Ciudad de Guatemala: $3.00 (2-4 horas)\n• Departamentos: $5.00 (24-48 horas)\n• Pedido mínimo: $10.00\n• ¡Envío GRATIS en pedidos +$25!',
  
  ubicacion: '📍 **Ubicación:**\n• Ciudad de Guatemala, Zona 10\n• También tenemos delivery a domicilio\n• Puedes ordenar por WhatsApp y recoger en tienda',
  
  menu: '📋 **Nuestro Menú:**\n1. 🍓 Fresas con Crema — $5\n2. 🧇 Waffle Especial con Fresas — $7\n3. 🥤 Malteada de Fresas — $4\n4. 🍫 Brownie con Fresas — $6\n5. 🎁 Combo Familiar (2 fresas + 2 malteadas) — $16',
  
  pago: '💳 **Métodos de pago:**\n• Efectivo\n• Transferencia bancaria\n• Tarjeta de crédito/débito\n• PayPal\n• Pago contra entrega (solo Ciudad de Guatemala)',
  
  contacto: '📞 **Contáctanos:**\n• WhatsApp: +502-XXXX-XXXX\n• Instagram: @angelos.fresas\n• Facebook: Fresas con Crema Angelos',
  
  promocion: '🎉 **Promoción del mes:**\n• Combo 2x1 en Fresas con Crema los martes\n• 20% de descuento en tu primera orden con código: ANGELOS20'
};

// ============================================
// DETECTOR DE INTENCIONES
// ============================================

function detectarIntencion(mensaje) {
  const msg = mensaje.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  if (msg.match(/precio|cuanto|cuesta|vale|costo|menu|catalogo|productos/)) return 'precio';
  if (msg.match(/hora|horario|abierto|cierran|atienden|dia|domingo|sabado/)) return 'horario';
  if (msg.match(/envio|delivery|mandan|envian|domicilio|reparto|zona/)) return 'envio';
  if (msg.match(/donde|ubicacion|direccion|local|tienda|queda|encuentran|maps/)) return 'ubicacion';
  if (msg.match(/menu|tienen|opciones|que venden|especialidades|platillos/)) return 'menu';
  if (msg.match(/pago|pagar|tarjeta|efectivo|transferencia|paypal|contra entrega/)) return 'pago';
  if (msg.match(/contacto|whatsapp|telefono|llamar|instagram|facebook|redes/)) return 'contacto';
  if (msg.match(/promo|descuento|oferta|descuentos|2x1|gratis|codigo/)) return 'promocion';
  
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
    const prompt = `Eres "Fresi" 🍓, la asistente virtual amable y entusiasta de "Angelos Fresas con Crema", un negocio de postres con fresas en Guatemala.

INFORMACIÓN DEL NEGOCIO:
- Menú: Fresas con Crema ($5), Waffle con Fresas ($7), Malteada ($4), Brownie ($6)
- Horario: Lun-Sab 10am-8pm, Dom 11am-6pm
- Ubicación: Ciudad de Guatemala, Zona 10
- Envíos: Ciudad $3 (2-4h), Departamentos $5 (24-48h), mínimo $10, gratis +$25
- Pagos: Efectivo, transferencia, tarjeta, PayPal, contra entrega (solo ciudad)
- WhatsApp: +502-XXXX-XXXX
- Instagram: @angelos.fresas

REGLAS IMPORTANTES:
- Responde en español, máximo 3 oraciones
- Sé muy amable, usa emojis de fresa 🍓
- Si no sabes algo, sugiere contactar por WhatsApp
- No inventes precios, promociones ni información falsa
- Si preguntan por alergias o ingredientes, sé honesto y sugiere consultar directamente

El cliente pregunta: "${mensaje}"`;

    const respuestaIA = await callGemini(prompt);
    
    res.json({
      respuesta: respuestaIA,
      tipo: 'ia',
      fuente: 'gemini'
    });
    
  } catch (error) {
    console.error('Error Gemini:', error);
    res.json({
      respuesta: '🍓 ¡Ups! Tuve un problemita técnico. Por favor escríbenos por WhatsApp: +502-XXXX-XXXX o intenta de nuevo.',
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
