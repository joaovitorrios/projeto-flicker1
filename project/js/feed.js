import auth from './auth.js';

// Verifica autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário está autenticado
    if (!auth.isAuthenticated()) {
        window.location.replace('/login.html');
        return;
    }

    // Inicializa os handlers de interação
    initializeHandlers();
});

function initializeHandlers() {
    // Handler do botão de novo post
    const newPostBtn = document.querySelector('.new-post-btn');
    if (newPostBtn) {
        newPostBtn.addEventListener('click', () => {
            // TODO: Implementar criação de post
            alert('Funcionalidade em desenvolvimento');
        });
    }

    // Handlers dos botões de ação dos posts
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // TODO: Implementar ações dos posts
            alert('Funcionalidade em desenvolvimento');
        });
    });
}