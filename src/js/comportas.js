// Autenticação para área de controle de comportas

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM para controle de comportas
    const gatesControlSection = document.querySelector('.gates-control');
    const gate1OpenBtn = document.getElementById('gate1-open');
    const gate1CloseBtn = document.getElementById('gate1-close');
    const gate2OpenBtn = document.getElementById('gate2-open');
    const gate2CloseBtn = document.getElementById('gate2-close');
    const operationMode = document.getElementById('operation-mode');
    
    // Verificar se estamos na página do painel
    if (gatesControlSection) {
        // Criar modal de login
        createLoginModal();
        
        // Esconder controles de comporta inicialmente
        hideGateControls();
        
        // Adicionar botão de login
        addLoginButton();
    }
    
    function createLoginModal() {
        // Criar o modal de login
        const loginModal = document.createElement('div');
        loginModal.classList.add('login-modal');
        loginModal.id = 'login-modal';
        
        loginModal.innerHTML = `
            <div class="login-form">
                <h3>Autenticação Necessária</h3>
                <p>Por favor, insira suas credenciais para acessar o controle de comportas.</p>
                <div class="form-group">
                    <label for="username">Usuário</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Senha</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <p id="login-error" class="login-error">Usuário ou senha incorretos.</p>
                <div class="form-actions">
                    <button type="button" id="cancel-login" class="btn">Cancelar</button>
                    <button type="button" id="submit-login" class="btn">Entrar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(loginModal);
        
        // Adicionar event listeners
        document.getElementById('submit-login').addEventListener('click', validateLogin);
        document.getElementById('cancel-login').addEventListener('click', closeLoginModal);
        
        // Permitir fechar o modal clicando fora
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }