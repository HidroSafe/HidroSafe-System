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
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.body.className = '';
            document.body.classList.add(`theme-${theme}`);
            
            // Salvar preferência do usuário
            localStorage.setItem('hidrosafe-theme', theme);
        });
    });
    
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('hidrosafe-theme');
    if (savedTheme) {
        document.body.className = '';
        document.body.classList.add(`theme-${savedTheme}`);
    }