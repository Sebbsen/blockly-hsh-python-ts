export type MessageColor = 'green' | 'yellow' | 'red';

export function message(color: MessageColor, text: string) {
    const successMessage = document.querySelector('.success-message');
    const failMessage = document.querySelector('.fail-message');
    const warningMessage = document.querySelector('.warning-message');
    
    // Alle Nachrichten verstecken
    if (successMessage) successMessage.classList.add('hidden');
    if (failMessage) failMessage.classList.add('hidden');
    if (warningMessage) warningMessage.classList.add('hidden');
    
    // Die entsprechende Nachricht anzeigen und Text setzen
    let messageElement: HTMLElement | null = null;
    
    switch (color) {
        case 'green':
            messageElement = document.querySelector('.success-message');
            break;
        case 'yellow':
            messageElement = document.querySelector('.warning-message');
            break;
        case 'red':
            messageElement = document.querySelector('.fail-message');
            break;
    }
    
    if (messageElement) {
        messageElement.innerHTML = text;
        messageElement.classList.remove('hidden');
    }
}

