// chat.js

// Variable global para almacenar la passkey. También se guardará en localStorage.
let passkey = localStorage.getItem('passkey') || '';

// Cargar mensajes guardados en el localStorage (con sender)
let messages = JSON.parse(localStorage.getItem('chat_messages')) || [];

/**
 * Mostrar los mensajes en el contenedor
 */
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

/**
 * Función para enviar el mensaje al webhook de Make.com
 */
async function sendToWebhook(message) {
  try {
    // Reemplaza esta URL con la de tu "Custom Webhook" en Make.com
    const response = await fetch('TU_URL_DE_MAKE_WEBHOOK', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        passkey: passkey,    // <-- Agregamos la passkey
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Error en el webhook');
    
    const data = await response.json();
    console.log('Respuesta del webhook:', data);

    // Mensaje de Wizardio
    const wizardResponse = data.response || 'Mensaje recibido por Wizardio';
    messages.push({ text: wizardResponse, sender: 'wizardio' });
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    displayMessages();
  } catch (error) {
    console.error('Error al enviar al webhook:', error);
  }
}

/**
 * Enviar un mensaje escrito por el usuario
 */
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

/**
 * Borrar todo el historial
 */
function clearHistory() {
  if (confirm("¿Estás seguro de borrar todo el historial de mensajes?")) {
    localStorage.removeItem('chat_messages');
    messages = [];
    displayMessages();
  }
}

/**
 * Alternar tema oscuro/claro (si lo implementaste)
 */
function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

/**
 * Guardar la passkey en localStorage y cerrar el modal
 */
function savePasskey() {
  const input = document.getElementById('passkeyInput');
  passkey = input.value.trim();
  if (!passkey) {
    alert("Ingresa una passkey válida.");
    return;
  }
  localStorage.setItem('passkey', passkey);
  
  // Ocultar el modal y mostrar el chat
  document.getElementById('passkeyModal').style.display = 'none';
  document.querySelector('.chat-container').style.display = 'flex';
}

/**
 * Al cargar la página
 */
document.addEventListener('DOMContentLoaded', () => {
  // Revisar si ya había un tema guardado
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Si no hay passkey en localStorage, mostramos el modal
  if (!passkey) {
    document.getElementById('passkeyModal').style.display = 'flex';
  } else {
    // Ya tenemos passkey, mostrar el chat directamente
    document.querySelector('.chat-container').style.display = 'flex';
  }

  // Botón de guardar passkey
  document.getElementById('savePasskeyBtn').addEventListener('click', savePasskey);

  // Mostrar mensajes existentes
  displayMessages();
});

// Permitir enviar el mensaje al presionar "Enter"
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
