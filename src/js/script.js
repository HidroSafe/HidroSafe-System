// Funcionalidades principais do site HidroSafe

// Menu de navegação responsivo
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Destacar item de menu ativo com base na seção visível
    const sections = document.querySelectorAll('.section');
    const menuItems = document.querySelectorAll('.menu a');
    
    function setActiveMenuItem() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveMenuItem);
    setActiveMenuItem();
    
    // Alternador de temas
    const temaButtons = document.querySelectorAll('.tema-btn');
    
    temaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tema = this.getAttribute('data-tema');
            document.body.className = '';
            document.body.classList.add(`tema-${tema}`);
            
            // Salvar preferência do usuário
            localStorage.setItem('hidrosafe-tema', tema);
        });
    });
    
    // Carregar tema salvo
    const savedtema = localStorage.getItem('hidrosafe-tema');
    if (savedtema) {
        document.body.className = '';
        document.body.classList.add(`tema-${savedtema}`);
    }
        
    // Rolagem suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Fechar menu mobile se estiver aberto
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});