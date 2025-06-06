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
    // Nota: Os gráficos são inicializados automaticamente pelo grafico.js
    
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
            
            // Ajustar taxa de elevação com base no estado das comportas
            if (gate1IsOpen) {
                currentElevationRate = (parseFloat(currentElevationRate) - 3).toFixed(1);
            }
            if (gate2IsOpen) {
                currentElevationRate = (parseFloat(currentElevationRate) - 2).toFixed(1);
            }
            
            // Garantir que a taxa não fique negativa durante a chuva
            currentElevationRate = Math.max(0.5, parseFloat(currentElevationRate)).toFixed(1);
            
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
            
            // Ajustar taxa de recuperação com base no estado das comportas
            if (gate1IsOpen) {
                currentElevationRate = (parseFloat(currentElevationRate) - 3).toFixed(1);
            }
            if (gate2IsOpen) {
                currentElevationRate = (parseFloat(currentElevationRate) - 2).toFixed(1);
            }
            
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

            // Comportamento automático das comportas
            if (operationMode.value === 'auto') {
                autoControlGates();
            }
            
            // Parar recuperação quando o nível voltar ao normal
            if (currentWaterLevel <= 0.9) {
                clearInterval(recoveryInterval);
                updateElevationRate(0.0);
                updatePrecipitation('0mm');
                updateForecast('Estável');
            }
        }, 3000);
    }
    
    function updateWaterLevel(level) {
        const formattedLevel = level.toFixed(1);
        currentLevelText.textContent = `${formattedLevel}m`;
        
        // Atualizar visualização do nível da água (0-100%)
        const percentage = Math.min(100, (level / 2.5) * 100);
        waterLevel.style.height = `${percentage}%`;
    }
    
    function updateElevationRate(rate) {
        elevationRate.textContent = `${rate} cm/h`;
    }
    
    function updateHumidity(value) {
        humidity.textContent = `${value}%`;
    }
    
    function updateTemperature(value) {
        temperature.textContent = `${value.toFixed(1)}°C`;
    }
    
    function updatePrecipitation(value) {
        precipitation.textContent = value;
    }
    
    function updateForecast(value) {
        forecast.textContent = value;
    }
    
    function updateLastUpdate() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        lastUpdate.textContent = timeString;
    }
    
    function checkAlertLevels() {
        const statusIndicator = currentStatus.querySelector('.status-indicator');
        const statusText = currentStatus.querySelector('.status-text');

        // Remover classes existentes
        statusIndicator.classList.remove('status-normal', 'status-attention', 'status-alert');
        
        if (currentWaterLevel >= 1.8) {
            // Nível crítico
            statusIndicator.classList.add('status-alert');
            statusText.textContent = 'ALERTA';
            addAlert('ALERTA: Nível crítico atingido!');
        } else if (currentWaterLevel >= 1.5) {
            // Nível de atenção
            statusIndicator.classList.add('status-attention');
            statusText.textContent = 'Atenção';
            addAlert('Atenção: Nível elevado detectado');
        } else {
            // Nível normal
            statusIndicator.classList.add('status-normal');
            statusText.textContent = 'Normal';
        }
    }

    function toggleGate(gateNumber, open) {
        const statusElement = gateNumber === 1 ? gate1Status : gate2Status;
        const openingElement = gateNumber === 1 ? gate1Opening : gate2Opening;
        const openBtn = gateNumber === 1 ? gate1OpenBtn : gate2OpenBtn;
        const closeBtn = gateNumber === 1 ? gate1CloseBtn : gate2CloseBtn;
        
        if (open) {
            statusElement.textContent = 'Aberta';
            openingElement.textContent = '100%';
            openBtn.disabled = true;
            closeBtn.disabled = false;
            if (gateNumber === 1) gate1IsOpen = true;
            else gate2IsOpen = true;
            addAlert(`Comporta ${gateNumber} aberta manualmente`);
            
            // Efeito imediato no nível da água quando a comporta é aberta
            if (isRaining) {
                // Durante chuva, reduz a taxa de elevação
                currentElevationRate = (parseFloat(currentElevationRate) - (gateNumber === 1 ? 3 : 2)).toFixed(1);
                currentElevationRate = Math.max(0.5, parseFloat(currentElevationRate)).toFixed(1);
            } else {
                // Sem chuva, aumenta a taxa de descida
                currentElevationRate = (parseFloat(currentElevationRate) - (gateNumber === 1 ? 3 : 2)).toFixed(1);
            }
            
            // Atualizar interface e gráficos
            updateElevationRate(currentElevationRate);
            updateCharts();
        } else {
            statusElement.textContent = 'Fechada';
            openingElement.textContent = '0%';
            openBtn.disabled = false;
            closeBtn.disabled = true;
            if (gateNumber === 1) gate1IsOpen = false;
            else gate2IsOpen = false;
            addAlert(`Comporta ${gateNumber} fechada manualmente`);
            
            // Efeito imediato no nível da água quando a comporta é fechada
            if (isRaining) {
                // Durante chuva, aumenta a taxa de elevação
                currentElevationRate = (parseFloat(currentElevationRate) + (gateNumber === 1 ? 3 : 2)).toFixed(1);
            } else {
                // Sem chuva, reduz a taxa de descida
                currentElevationRate = (parseFloat(currentElevationRate) + (gateNumber === 1 ? 3 : 2)).toFixed(1);
            }
            
            // Atualizar interface e gráficos
            updateElevationRate(currentElevationRate);
            updateCharts();
        }
    }
    
    function autoControlGates() {
        // Lógica para controle automático das comportas
        if (currentWaterLevel >= 1.8 && !gate1IsOpen) {
            toggleGate(1, true);
            addAlert('Comporta 1 aberta automaticamente - Nível crítico');
        } else if (currentWaterLevel >= 1.65 && !gate2IsOpen) {
            toggleGate(2, true);
            addAlert('Comporta 2 aberta automaticamente - Nível elevado');
        } else if (currentWaterLevel < 1.2) {
            if (gate1IsOpen) {
                toggleGate(1, false);
                addAlert('Comporta 1 fechada automaticamente - Nível normalizado');
            }
            if (gate2IsOpen) {
                toggleGate(2, false);
                addAlert('Comporta 2 fechada automaticamente - Nível normalizado');
            }
        }
    }
    
    function addAlert(message) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        // Remover mensagem "nenhum alerta"
        const noAlerts = alertsList.querySelector('.no-alerts');
        if (noAlerts) {
            alertsList.removeChild(noAlerts);
        }
        
        // Criar novo alerta
        const alertElement = document.createElement('div');
        alertElement.classList.add('alert-item');
        alertElement.innerHTML = `
            <span class="alert-time">${timeString}</span>
            <span class="alert-message">${message}</span>
        `;
        
        // Adicionar ao início da lista
        alertsList.insertBefore(alertElement, alertsList.firstChild);
        
        // Limitar número de alertas visíveis
        alertCount++;
        if (alertCount > 5) {
            alertsList.removeChild(alertsList.lastChild);
        }
    }

    // Função para atualizar os gráficos usando as funções do grafico.js
    function updateCharts() {
        // Atualizar gráfico de umidade
        if (typeof updateHumidityGrafi === 'function') {
            updateHumidityGrafi(parseInt(humidity.textContent));
        }
        
        // Atualizar gráfico de nível da água
        if (typeof updateWaterLevelGrafi === 'function') {
            updateWaterLevelGrafi(currentWaterLevel);
        }
    }
    
    // Inicializar valores
    updateWaterLevel(currentWaterLevel);
    updateElevationRate(currentElevationRate);
    updateLastUpdate();
});
