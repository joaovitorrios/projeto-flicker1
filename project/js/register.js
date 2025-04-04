import auth from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    
    // Verifica se o usuário já está logado
    if (auth.isAuthenticated()) {
        window.location.replace('/feed.html');
        return;
    }

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const button = form.querySelector('button');

        // Validações básicas
        if (password !== confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            button.disabled = true;
            button.textContent = 'Criando conta...';
            
            const result = await auth.register(email, password, name, username);
            
            if (result.success) {
                alert('Conta criada com sucesso! Verifique seu email para confirmar sua conta.');
                window.location.replace('/login.html');
            } else {
                alert(result.error || 'Erro ao criar conta. Tente novamente.');
            }
        } catch (error) {
            alert('Erro ao criar conta. Tente novamente.');
            console.error(error);
        } finally {
            button.disabled = false;
            button.textContent = 'Criar Conta';
        }
    });
}); 