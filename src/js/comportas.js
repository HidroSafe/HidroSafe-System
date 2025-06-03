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
    
    function addLoginButton() {
        // Criar botão de login
        const loginButton = document.createElement('button');
        loginButton.classList.add('btn');
        loginButton.id = 'login-button';
        loginButton.textContent = 'Fazer Login para Controle';
        
        // Adicionar botão antes da seção de controle
        const gatesControlTitle = document.querySelector('.dashboard-card.full-width h3');
        if (gatesControlTitle) {
            gatesControlTitle.after(loginButton);
            
            // Adicionar event listener
            loginButton.addEventListener('click', openLoginModal);
        }
    }
    
    function hideGateControls() {
        // Esconder os controles de comporta
        if (gatesControlSection) {
            gatesControlSection.style.display = 'none';
        }
    }
    
    function showGateControls() {
        // Mostrar os controles de comporta
        if (gatesControlSection) {
            gatesControlSection.style.display = 'flex';
            
            // Esconder o botão de login
            const loginButton = document.getElementById('login-button');
            if (loginButton) {
                loginButton.style.display = 'none';
            }
        }
    }
    
    function openLoginModal() {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.add('active');
            
            // Limpar campos e mensagens de erro
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('login-error').style.display = 'none';
            
            // Focar no campo de usuário
            document.getElementById('username').focus();
        }
    }
    
    function closeLoginModal() {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.remove('active');
        }
    }
    
    function validateLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginError = document.getElementById('login-error');
        
        // Verificar credenciais (admin/0000)
        if (username === 'admin' && password === '0000') {
            // Login bem-sucedido
            closeLoginModal();
            showGateControls();
            
            // Adicionar alerta de login bem-sucedido
            if (typeof addAlert === 'function') {
                addAlert('Login bem-sucedido. Controle de comportas ativado.');
            }
            
            // Salvar estado de autenticação na sessão
            sessionStorage.setItem('hidrosafe-authenticated', 'true');
        } else {
            // Login falhou
            loginError.style.display = 'block';
            
            // Limpar senha
            document.getElementById('password').value = '';
        }
    }
    
    // Verificar se o usuário já está autenticado (na mesma sessão)
    function checkAuthentication() {
        const isAuthenticated = sessionStorage.getItem('hidrosafe-authenticated') === 'true';
        if (isAuthenticated) {
            showGateControls();
        }
    }
    
    // Verificar autenticação ao carregar a página
    checkAuthentication();
});
