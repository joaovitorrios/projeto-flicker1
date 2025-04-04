import auth from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    
    // Verifica se o usuário já está logado
    if (auth.isAuthenticated()) {
        window.location.replace('/feed.html');
        return;
    }

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const button = form.querySelector('button');

        try {
            button.disabled = true;
            button.textContent = 'Entrando...';
            
            const result = await auth.login(email, password);
            
            if (result.success) {
                window.location.replace('/feed.html');
            } else {
                alert(result.error || 'Email ou senha incorretos');
            }
        } catch (error) {
            alert('Erro ao fazer login. Tente novamente.');
            console.error(error);
        } finally {
            button.disabled = false;
            button.textContent = 'Entrar';
        }
    });
});