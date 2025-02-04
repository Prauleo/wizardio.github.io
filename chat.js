// chat.js

// Cargar mensajes guardados en el localStorage (con sender)
let messages = JSON.parse(localStorage.getItem('chat_messages')) || [];

// Mostrar los mensajes en el contenedor
function displayMessages() {
  const container = document.getElementById('messages');
  container.innerHTML = messages.map(msg => {
    if (msg.sender === 'wizardio') {
      return `
        <div class="message-container wizardio">
          <img src="images/wizardio.png" alt="Wizardio" class="avatar">
          <div class="message-text">${msg.text}</div>
        </div>
      `;
    } else {
      return `
        <div class="message-container user">
          <div class="message-text">${msg.text}</div>
        </div>
      `;
    }
  }).join('');
  container.scrollTop = container.scrollHeight; // Auto-scroll
}

// Enviar el mensaje al webhook de Make.com
async function sendToWebhook(message) {
  try {
    // Reemplaza esta URL con la que te da Make.com
    const response = await fetch('https://hook.us1.make.com/43vq126gqt9cd77t23sw3dss1stcrqr9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Error en el webhook');
    
    // Si el webhook responde algo, lo usamos como texto de Wizardio
    const data = await response.json();
    console.log('Respuesta del webhook:', data);

    // Mensaje de Wizardio (o lo que retorne tu webhook)
    const wizardResponse = data.response || 'Mensaje recibido por Wizardio';
    messages.push({ text: wizardResponse, sender: 'wizardio' });
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    displayMessages();
  } catch (error) {
    console.error('Error al enviar al webhook:', error);
  }
}

// Enviar un mensaje escrito por el usuario
function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();

  if (text) {
    messages.push({ text: text, sender: 'user' });
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    displayMessages();
    input.value = '';

    // Llamar al webhook con el texto ingresado
    sendToWebhook(text);
  }
}

// Borrar todo el historial
function clearHistory() {
  if (confirm("¿Estás seguro de borrar todo el historial de mensajes?")) {
    localStorage.removeItem('chat_messages');
    messages = [];
    displayMessages();
  }
}

// Cambiar entre modo claro y oscuro
function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-mode');

  // Guardar preferencia en localStorage
  const isDark = body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Al cargar la página, aplicamos el tema que estaba guardado
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Mostrar mensajes existentes
  displayMessages();
});

// Permitir enviar el mensaje al presionar "Enter"
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
