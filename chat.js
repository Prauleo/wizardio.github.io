// Cargar mensajes guardados
let messages = JSON.parse(localStorage.getItem('chat_messages')) || [];

function displayMessages() {
    const container = document.getElementById('messages');
    container.innerHTML = messages
        .map(msg => `<div class="message">${msg.text}</div>`)
        .join('');
    container.scrollTop = container.scrollHeight; // Auto-scroll
}

// Enviar a webhook
async function sendToWebhook(message) {
    try {
        const response = await fetch('TU_URL_DE_MAKE_WEBHOOK', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) throw new Error('Error en webhook');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Manejar envío
function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (text) {
        // Guardar localmente
        messages.push({ text: text });
        localStorage.setItem('chat_messages', JSON.stringify(messages));
        
        // Enviar a Make.com
        sendToWebhook(text);
        
        // Actualizar vista
        displayMessages();
        input.value = '';
    }
}

// Inicializar
displayMessages();

// Enviar con Enter
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
