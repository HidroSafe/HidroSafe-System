// Quiz interativo para o site HidroSafe

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-quiz');
    const nextButton = document.getElementById('next-question');
    const restartButton = document.getElementById('restart-quiz');
    const quizStart = document.getElementById('quiz-start');
    const quizQuestions = document.getElementById('quiz-questions');
    const quizResults = document.getElementById('quiz-results');
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const scoreDisplay = document.getElementById('score-display');
    
    // Perguntas do quiz atualizadas com foco em mitigação de enchentes e meio ambiente
    const questions = [
        {
            question: "Qual medida é mais eficaz para mitigar enchentes em áreas urbanas?",
            options: [
                "Construção de mais bueiros",
                "Implementação de áreas permeáveis e jardins de chuva",
                "Canalização de rios e córregos",
                "Construção de barragens"
            ],
            correctAnswer: 1
        },
        {
            question: "Como o desmatamento contribui para o aumento de enchentes?",
            options: [
                "Reduz a evaporação da água",
                "Diminui a temperatura do solo",
                "Reduz a capacidade de absorção de água pelo solo",
                "Aumenta a profundidade dos rios"
            ],
            correctAnswer: 2
        },
        {
            question: "Qual prática sustentável ajuda a reduzir o impacto de enchentes em residências?",
            options: [
                "Captação e reuso de água da chuva",
                "Uso de ar-condicionado",
                "Pavimentação de toda a área externa",
                "Canalização da água para a rua"
            ],
            correctAnswer: 0
        },
        {
            question: "Qual fenômeno climático está diretamente relacionado ao aumento da frequência de chuvas intensas?",
            options: [
                "El Niño",
                "Aquecimento global",
                "Inversão térmica",
                "Buraco na camada de ozônio"
            ],
            correctAnswer: 1
        },
        {
            question: "Qual é o papel dos manguezais na prevenção de enchentes em áreas costeiras?",
            options: [
                "Aumentam a velocidade das marés",
                "Funcionam como barreira natural contra inundações",
                "Reduzem a temperatura da água",
                "Aumentam a salinidade do solo"
            ],
            correctAnswer: 1
        },
        {
            question: "Qual ação comunitária é mais eficaz para mitigar os efeitos de enchentes?",
            options: [
                "Limpeza regular de bueiros e canais de drenagem",
                "Construção de muros altos",
                "Instalação de bombas d'água individuais",
                "Impermeabilização de calçadas"
            ],
            correctAnswer: 0
        },
        {
            question: "Como o sistema HidroSafe contribui para a preservação do meio ambiente?",
            options: [
                "Utilizando energia não renovável",
                "Operando com autonomia energética através de painéis solares",
                "Modificando o curso natural dos rios",
                "Aumentando o consumo de água"
            ],
            correctAnswer: 1
        },
        {
            question: "Qual técnica de infraestrutura verde ajuda a reduzir enchentes em áreas urbanas?",
            options: [
                "Telhados verdes e jardins de chuva",
                "Aumento de áreas asfaltadas",
                "Canalização de córregos",
                "Construção de estacionamentos convencionais"
            ],
            correctAnswer: 0
        },
        {
            question: "Por que a preservação de áreas de várzea é importante para prevenção de enchentes?",
            options: [
                "Aumentam a velocidade do escoamento da água",
                "Servem como áreas naturais de contenção durante cheias",
                "Impedem totalmente a passagem da água",
                "Reduzem a umidade do ar"
            ],
            correctAnswer: 1
        },
        {
            question: "Qual política pública é mais eficaz para reduzir os impactos de enchentes a longo prazo?",
            options: [
                "Construção de mais piscinões",
                "Planejamento urbano com zoneamento de áreas de risco",
                "Dragagem constante de rios",
                "Construção de mais galerias pluviais"
            ],
            correctAnswer: 1
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;
    
    // Iniciar o quiz
    if (startButton) {
        startButton.addEventListener('click', startQuiz);
    }
    
    // Próxima pergunta
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (selectedOption === null) {
                alert('Por favor, selecione uma opção antes de continuar.');
                return;
            }
            
            // Verificar resposta
            if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
                score++;
            }
            
            currentQuestionIndex++;
            selectedOption = null;
            
            if (currentQuestionIndex < questions.length) {
                showQuestion(currentQuestionIndex);
            } else {
                showResults();
            }
        });
    }
    
    // Reiniciar o quiz
    if (restartButton) {
        restartButton.addEventListener('click', startQuiz);
    }
    
    function startQuiz() {
        quizStart.style.display = 'none';
        quizResults.style.display = 'none';
        quizQuestions.style.display = 'block';
        
        currentQuestionIndex = 0;
        score = 0;
        selectedOption = null;
        
        showQuestion(currentQuestionIndex);
    }
    
    function showQuestion(index) {
        const question = questions[index];
        
        questionContainer.innerHTML = `
            <h3>Pergunta ${index + 1} de ${questions.length}</h3>
            <p>${question.question}</p>
        `;
        
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, i) => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('option');
            button.addEventListener('click', () => selectOption(i));
            optionsContainer.appendChild(button);
        });
        
        // Atualizar texto do botão na última pergunta
        if (index === questions.length - 1) {
            nextButton.textContent = 'Ver Resultado';
        } else {
            nextButton.textContent = 'Próxima';
        }
    }
    
    function selectOption(index) {
        selectedOption = index;
        
        // Remover seleção anterior
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        
        // Destacar opção selecionada
        options[index].classList.add('selected');
    }
    
    function showResults() {
        quizQuestions.style.display = 'none';
        quizResults.style.display = 'block';
        
        const percentage = (score / questions.length) * 100;
        let message = '';
        
        if (percentage >= 80) {
            message = 'Excelente! Você é um especialista em prevenção de enchentes e sustentabilidade!';
        } else if (percentage >= 60) {
            message = 'Muito bom! Você tem um bom conhecimento sobre mitigação de enchentes e meio ambiente.';
        } else if (percentage >= 40) {
            message = 'Bom trabalho! Mas ainda há espaço para aprender mais sobre soluções sustentáveis para enchentes.';
        } else {
            message = 'Você pode melhorar! Que tal estudar mais sobre prevenção de enchentes e práticas ambientais?';
        }
        
        scoreDisplay.innerHTML = `
            <p>Você acertou ${score} de ${questions.length} perguntas (${percentage}%).</p>
            <p>${message}</p>
        `;
    }
});