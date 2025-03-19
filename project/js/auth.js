import { supabase } from './supabase.js';

// Autenticação simplificada para demonstração
class Auth {
    constructor() {
        this.currentUser = null;
        this.loadUser();
    }

    async loadUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            this.currentUser = user;
        }
    }

    async register(email, password, name, username) {
        try {
            // Registrar usuário no Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        username
                    }
                }
            });

            if (authError) throw authError;

            // Criar perfil do usuário
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id,
                        username,
                        name,
                        avatar_url: null,
                        cover_url: null,
                        bio: null,
                        private: false
                    }
                ]);

            if (profileError) throw profileError;

            return { success: true, user: authData.user };
        } catch (error) {
            console.error('Erro no registro:', error.message);
            return { success: false, error: error.message };
        }
    }

    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.currentUser = data.user;
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Erro no login:', error.message);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('Erro no logout:', error.message);
            return { success: false, error: error.message };
        }
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Criar e exportar uma única instância
export default new Auth();