// Implementação de gráficos com JavaScript puro para o painel HidroSafe

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página do painel
    const humidityGrafiContainer = document.getElementById('humidityGrafi');
    const waterLevelGrafiContainer = document.getElementById('waterLevelGrafi');
    
    if (humidityGrafiContainer || waterLevelGrafiContainer) {
        // Substituir os elementos canvas por divs para nossos gráficos personalizados
        if (humidityGrafiContainer) {
            replaceCanvasWithCustomGrafi(humidityGrafiContainer, 'humidity-grafi');
            initHumidityGrafi();
        }
        
        if (waterLevelGrafiContainer) {
            replaceCanvasWithCustomGrafi(waterLevelGrafiContainer, 'water-level-grafi');
            initWaterLevelGrafi();
        }
    }
    
    function replaceCanvasWithCustomGrafi(canvasElement, newId) {
        // Criar um novo elemento div para o gráfico personalizado
        const grafiDiv = document.createElement('div');
        grafiDiv.id = newId;
        grafiDiv.classList.add('custom-grafi');
        
        // Substituir o canvas pelo novo div
        canvasElement.parentNode.replaceChild(grafiDiv, canvasElement);
    }
    
    function initHumidityGrafi() {
        const grafiContainer = document.getElementById('humidity-grafi');
        if (!grafiContainer) return;
        
        // Configuração do gráfico
        const config = {
            height: 250,
            width: grafiContainer.offsetWidth,
            maxValue: 100,
            minValue: 50,
            dataPoints: 12,
            color: '#4285F4',
            fillColor: 'rgba(66, 133, 244, 0.1)',
            lineWidth: 2,
            gridLines: 5
        };
        
        // Gerar dados iniciais
        const initialData = generateRandomData(config.dataPoints, 60, 70);
        const labels = generateTimeLabels(config.dataPoints, -1);
        
        // Criar estrutura do gráfico
        createGrafiStructure(grafiContainer, config, 'Umidade (%)');
        
        // Desenhar gráfico inicial
        drawLineGrafi(grafiContainer, initialData, labels, config);
        
        // Armazenar dados para atualizações
        window.humidityGrafiData = {
            data: initialData,
            labels: labels,
            config: config
        };
    }
    
    function initWaterLevelGrafi() {
        const grafiContainer = document.getElementById('water-level-grafi');
        if (!grafiContainer) return;
        
        // Configuração do gráfico
        const config = {
            height: 300,
            width: grafiContainer.offsetWidth,
            maxValue: 2.5,
            minValue: 0.5,
            dataPoints: 24,
            color: '#1A73E8',
            fillColor: 'rgba(26, 115, 232, 0.1)',
            lineWidth: 2,
            gridLines: 5
        };
        
        // Gerar dados iniciais
        const initialData = generateWaterLevelData(config.dataPoints);
        const labels = generateTimeLabels(config.dataPoints, -3);
        
        // Criar estrutura do gráfico
        createGrafiStructure(grafiContainer, config, 'Nível da Água (m)');
        
        // Desenhar gráfico inicial
        drawLineGrafi(grafiContainer, initialData, labels, config);
        
        // Adicionar linhas de referência
        addReferenceLine(grafiContainer, 1.5, 'Nível de Alerta', '#FBBC04', config);
        addReferenceLine(grafiContainer, 1.8, 'Nível Crítico', '#EA4335', config);
        
        // Armazenar dados para atualizações
        window.waterLevelGrafiData = {
            data: initialData,
            labels: labels,
            config: config
        };
    }
    
    function createGrafiStructure(container, config, title) {
        // Limpar container
        container.innerHTML = '';
        
        // Adicionar título
        const titleElement = document.createElement('div');
        titleElement.classList.add('grafi-title');
        titleElement.textContent = title;
        container.appendChild(titleElement);
        
        // Criar área do gráfico
        const grafiArea = document.createElement('div');
        grafiArea.classList.add('grafi-area');
        grafiArea.style.height = config.height + 'px';
        grafiArea.style.position = 'relative';
        container.appendChild(grafiArea);
        
        // Adicionar grid
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grafi-grid');
        gridContainer.style.height = '100%';
        gridContainer.style.width = '100%';
        gridContainer.style.position = 'absolute';
        gridContainer.style.top = '0';
        gridContainer.style.left = '0';
        grafiArea.appendChild(gridContainer);
        
        // Adicionar linhas de grid horizontais
        for (let i = 0; i <= config.gridLines; i++) {
            const gridLine = document.createElement('div');
            gridLine.classList.add('grid-line', 'horizontal');
            gridLine.style.position = 'absolute';
            gridLine.style.left = '0';
            gridLine.style.right = '0';
            gridLine.style.top = (i * (100 / config.gridLines)) + '%';
            gridLine.style.borderBottom = '1px dashed #ccc';
            
            // Adicionar label de valor
            const valueLabel = document.createElement('span');
            valueLabel.classList.add('value-label');
            valueLabel.style.position = 'absolute';
            valueLabel.style.left = '-40px';
            valueLabel.style.top = '-10px';
            valueLabel.style.fontSize = '12px';
            valueLabel.style.color = '#666';
            
            // Calcular valor para esta linha
            const value = config.maxValue - (i * ((config.maxValue - config.minValue) / config.gridLines));
            valueLabel.textContent = value.toFixed(1);
            
            gridLine.appendChild(valueLabel);
            gridContainer.appendChild(gridLine);
        }