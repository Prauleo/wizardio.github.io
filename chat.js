// chat.js

// Cargar mensajes guardados en el localStorage (con sender)
let messages = JSON.parse(localStorage.getItem('chat_messages')) || [];

// Al iniciar, establecemos el tema preferido guardado en localStorage
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
}

// Función para mostrar los mensajes en el contenedor
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
    } else { // sender === 'user'
      return `
        <div class="message-container user">
          <div class="message-text">${msg.text}</div>
        </div>
      `;
    }
  }).join('');
  container.scrollTop = container.scrollHeight; // Auto-scroll
}

// Función para enviar el mensaje al webhook de Make.com
async function sendToWebhook(message) {
  try {
    const response = await fetch('https://hook.us1.make.com/43vq126gqt9cd77t23sw3dss1stcrqr9', {  // Reemplaza con la URL real de tu webhook
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
    
    // (Opcional) Procesamos la respuesta del webhook, si la hay
    const data = await response.json();
    console.log('Respuesta del webhook:', data);
    
    // Simulamos la respuesta de Wizardio (o usa data.response si tu webhook la retorna)
    const wizardResponse = data.response || 'Mensaje recibido por Wizardio';
    // Guardar la respuesta de Wizardio
    messages.push({ text: wizardResponse, sender: 'wizardio' });
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    displayMessages();
  } catch (error) {
    console.error('Error al enviar al webhook:', error);
  }
}

// Función que se ejecuta al enviar un mensaje
function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  
  if (text) {
    // Agregar el mensaje del usuario y guardarlo en localStorage
    messages.push({ text: text, sender: 'user' });
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    
    // Actualizar la vista con el nuevo mensaje
    displayMessages();
    input.value = '';
    
    // Enviar el mensaje a Make.com
    sendToWebhook(text);
  }
}

// Función para borrar el historial del chat
function clearHistory() {
  if (confirm("¿Estás seguro de borrar todo el historial de mensajes?")) {
    localStorage.removeItem('chat_messages');
    messages = [];
    displayMessages();
  }
}

// Función para alternar entre Dark Mode y Light Mode
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  if (document.body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }
}

// Inicializar mostrando los mensajes guardados
displayMessages();

// Permitir enviar el mensaje al presionar Enter
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
