// Funcionalidades do painel de status HidroSafe

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const currentStatus = document.getElementById('current-status');
    const lastUpdate = document.getElementById('last-update');
    const waterLevel = document.getElementById('water-level');
    const currentLevelText = document.getElementById('current-level');
    const elevationRate = document.getElementById('elevation-rate');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const precipitation = document.getElementById('precipitation');
    const forecast = document.getElementById('forecast');
    const simulateRainBtn = document.getElementById('simulate-rain');
    const alertsList = document.getElementById('alerts-list');
    const gate1Status = document.getElementById('gate1-status');
    const gate1Opening = document.getElementById('gate1-opening');
    const gate2Status = document.getElementById('gate2-status');
    const gate2Opening = document.getElementById('gate2-opening');
    const gate1OpenBtn = document.getElementById('gate1-open');
    const gate1CloseBtn = document.getElementById('gate1-close');
    const gate2OpenBtn = document.getElementById('gate2-open');
    const gate2CloseBtn = document.getElementById('gate2-close');
    const operationMode = document.getElementById('operation-mode');
    
    // Variáveis de estado
    let currentWaterLevel = 0.9; // metros
    let currentElevationRate = 0.0; // cm/h
    let isRaining = false;
    let rainInterval;
    let gate1IsOpen = false;
    let gate2IsOpen = false;
    let alertCount = 0;

    // Inicializar gráficos
    initCharts();
    
    // Event listeners
    if (simulateRainBtn) {
        simulateRainBtn.addEventListener('click', toggleRainSimulation);
    }
    
    if (gate1OpenBtn) {
        gate1OpenBtn.addEventListener('click', () => toggleGate(1, true));
    }
    
    if (gate1CloseBtn) {
        gate1CloseBtn.addEventListener('click', () => toggleGate(1, false));
    }
    
    if (gate2OpenBtn) {
        gate2OpenBtn.addEventListener('click', () => toggleGate(2, true));
    }
    
    if (gate2CloseBtn) {
        gate2CloseBtn.addEventListener('click', () => toggleGate(2, false));
    }
    
    if (operationMode) {
        operationMode.addEventListener('change', function() {
            const isManual = this.value === 'manual';
            
            // Habilitar/desabilitar controles de comporta com base no modo
            gate1OpenBtn.disabled = !isManual;
            gate1CloseBtn.disabled = !isManual || !gate1IsOpen;
            gate2OpenBtn.disabled = !isManual;
            gate2CloseBtn.disabled = !isManual || !gate2IsOpen;
            
            // Adicionar alerta sobre mudança de modo
            addAlert(`Modo de operação alterado para ${isManual ? 'Manual' : 'Automático'}`);
        });
    }
    
    // Funções
    function toggleRainSimulation() {
        isRaining = !isRaining;
        
        if (isRaining) {
            simulateRainBtn.textContent = 'Parar Simulação';
            simulateRainBtn.classList.add('active');
            startRain();
            addAlert('Simulação de chuva iniciada');
        } else {
            simulateRainBtn.textContent = 'Simular Chuva';
            simulateRainBtn.classList.remove('active');
            stopRain();
            addAlert('Simulação de chuva interrompida');
        }
    }
    
    function startRain() {
        // Atualizar umidade e temperatura
        updateHumidity(95);
        updateTemperature(22);
        updatePrecipitation('15mm');
        updateForecast('Chuva intensa');
        
        // Iniciar elevação do nível da água
        rainInterval = setInterval(() => {
            // Aumentar nível da água
            currentElevationRate = (Math.random() * 5 + 5).toFixed(1); // 5-10 cm/h
            currentWaterLevel += (currentElevationRate / 100); // converter cm para m
            
            // Atualizar interface
            updateWaterLevel(currentWaterLevel);
            updateElevationRate(currentElevationRate);
            updateLastUpdate();
            
            // Verificar níveis de alerta
            checkAlertLevels();
            
            // Atualizar gráficos
            updateCharts();
            
            // Comportamento automático das comportas
            if (operationMode.value === 'auto') {
                autoControlGates();
            }
        }, 3000); // Atualizar a cada 3 segundos
    }
    
    function stopRain() {
        clearInterval(rainInterval);
        
        // Restaurar valores normais gradualmente
        const recoveryInterval = setInterval(() => {
            // Diminuir nível da água
            currentElevationRate = (-Math.random() * 3 - 2).toFixed(1); // -2 a -5 cm/h
            currentWaterLevel = Math.max(0.8, currentWaterLevel + (currentElevationRate / 100));
            
            // Atualizar interface
            updateWaterLevel(currentWaterLevel);
            updateElevationRate(currentElevationRate);
            updateHumidity(Math.max(65, parseInt(humidity.textContent) - 5));
            updateTemperature(Math.min(24, parseInt(temperature.textContent) + 0.5));
            updateLastUpdate();
            
            // Verificar níveis de alerta
            checkAlertLevels();
            
            // Atualizar gráficos
            updateCharts();