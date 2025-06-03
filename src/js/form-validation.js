// Validação de formulário para o site HidroSafe

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter todos os campos do formulário
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const cityInput = document.getElementById('city');
            const messageInput = document.getElementById('message');
            
            // Resetar mensagens de erro
            resetErrors();
            
            // Validar campos
            let isValid = true;
            
            // Validar nome (não vazio e pelo menos 3 caracteres)
            if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
                showError(nameInput, 'Por favor, insira um nome válido com pelo menos 3 caracteres.');
                isValid = false;
            }
            
            // Validar email (formato válido)
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Por favor, insira um endereço de e-mail válido.');
                isValid = false;
            }
            
            // Validar cidade (não vazio)
            if (!cityInput.value.trim()) {
                showError(cityInput, 'Por favor, informe sua cidade.');
                isValid = false;
            }
            
            // Validar mensagem (pelo menos 10 caracteres)
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                showError(messageInput, 'Por favor, insira uma mensagem com pelo menos 10 caracteres.');
                isValid = false;
            }
            
            // Se todos os campos forem válidos, exibir mensagem de sucesso
            if (isValid) {
                // Em um cenário real, aqui enviaríamos os dados para um servidor
                // Como é uma simulação, apenas mostramos uma mensagem de sucesso
                contactForm.innerHTML = `
                    <div class="success-message">
                        <h3>Mensagem enviada com sucesso!</h3>
                        <p>Obrigado por entrar em contato, ${nameInput.value}. Responderemos em breve.</p>
                        <button type="button" class="btn" onclick="location.reload()">Enviar nova mensagem</button>
                    </div>
                `;
            }
        });
    }
    
    // Função para validar formato de email
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Função para exibir mensagem de erro
    function showError(input, message) {
        const errorElement = input.nextElementSibling;
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.classList.add('error');
    }
    
    // Função para resetar mensagens de erro
    function resetErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const inputs = document.querySelectorAll('input, textarea');
        
        errorMessages.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }
});
