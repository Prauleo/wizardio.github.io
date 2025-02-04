// chat.js

// Cargar mensajes guardados en el localStorage
let messages = JSON.parse(localStorage.getItem('chat_messages')) || [];

// Función para mostrar los mensajes en el contenedor
function displayMessages() {
  const container = document.getElementById('messages');
  container.innerHTML = messages
    .map(msg => `<div class="message">${msg.text}</div>`)
    .join('');
  container.scrollTop = container.scrollHeight; // Auto-scroll
}

// Función para enviar el mensaje al webhook de Make.com
async function sendToWebhook(message) {
  try {
    const response = await fetch('https://hook.us1.make.com/43vq126gqt9cd77t23sw3dss1stcrqr9', {  // Reemplaza TU_URL_DE_MAKE_WEBHOOK por la URL real
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) throw new Error('Error en el webhook');
    
    // (Opcional) Puedes procesar la respuesta del webhook si lo deseas
    const data = await response.json();
    console.log('Respuesta del webhook:', data);
  } catch (error) {
    console.error('Error al enviar al webhook:', error);
  }
}

// Función que se ejecuta al enviar un mensaje
function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  
  if (text) {
    // Agregar el mensaje al arreglo y guardarlo en localStorage
    messages.push({ text: text });
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    
    // Enviar el mensaje a Make.com
    sendToWebhook(text);
    
    // Actualizar la vista con el nuevo mensaje
    displayMessages();
    input.value = '';
  }
}

// Inicializar mostrando los mensajes guardados
displayMessages();

// Permitir enviar el mensaje al presionar Enter
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
