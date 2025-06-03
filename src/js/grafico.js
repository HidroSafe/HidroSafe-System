// Implementação de gráficos 

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
        grafiArea.style.overflow = 'hidden'; // Impedir overflow
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
                
        // Criar container para o gráfico de linha
        const lineContainer = document.createElement('div');
        lineContainer.classList.add('line-grafi-container');
        lineContainer.style.height = '100%';
        lineContainer.style.width = '100%';
        lineContainer.style.position = 'absolute';
        lineContainer.style.top = '0';
        lineContainer.style.left = '0';
        lineContainer.style.overflow = 'hidden'; // Impedir overflow
        grafiArea.appendChild(lineContainer);
        
        // Criar container para labels de tempo
        const labelsContainer = document.createElement('div');
        labelsContainer.classList.add('time-labels-container');
        labelsContainer.style.display = 'flex';
        labelsContainer.style.justifyContent = 'space-between';
        labelsContainer.style.marginTop = '5px';
        container.appendChild(labelsContainer);
        
        // Adicionar labels de tempo
        for (let i = 0; i < Math.min(6, config.dataPoints); i++) {
            const index = Math.floor(i * (config.dataPoints / 5));
            const label = document.createElement('span');
            label.classList.add('time-label');
            label.style.fontSize = '12px';
            label.style.color = '#666';
            label.textContent = '00:00';
            label.dataset.index = index;
            labelsContainer.appendChild(label);
        }
    }
});

// Funções globais para desenho e atualização dos gráficos
function drawLineGrafi(container, data, labels, config) {
    const grafiArea = container.querySelector('.line-grafi-container');
    if (!grafiArea) return;
    
    // Limpar área do gráfico
    grafiArea.innerHTML = '';
    
    // Atualizar labels de tempo
    const timeLabels = container.querySelectorAll('.time-label');
    timeLabels.forEach(label => {
        const index = parseInt(label.dataset.index);
        if (index < labels.length) {
            label.textContent = labels[index];
        }
    });
    
    // Criar SVG para o gráfico
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${grafiArea.offsetWidth} ${grafiArea.offsetHeight}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.overflow = 'visible';
    grafiArea.appendChild(svg);
    
    // Calcular pontos para o gráfico
    const points = [];
    const width = grafiArea.offsetWidth;
    const height = grafiArea.offsetHeight;
    const xStep = width / (data.length - 1);
    
    for (let i = 0; i < data.length; i++) {
        const x = i * xStep;
        const normalizedValue = (data[i] - config.minValue) / (config.maxValue - config.minValue);
        const y = height - (normalizedValue * height);
        points.push({ x, y });
    }
    
    // Criar caminho para a área preenchida
    const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let areaPathD = `M${points[0].x},${height} `;
    
    // Adicionar pontos ao caminho
    points.forEach(point => {
        areaPathD += `L${point.x},${point.y} `;
    });
    
    // Fechar o caminho
    areaPathD += `L${points[points.length - 1].x},${height} Z`;
    
    areaPath.setAttribute('d', areaPathD);
    areaPath.setAttribute('fill', config.fillColor);
    svg.appendChild(areaPath);
    
    // Criar caminho para a linha
    const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let linePathD = `M${points[0].x},${points[0].y} `;
    
    // Adicionar pontos ao caminho
    for (let i = 1; i < points.length; i++) {
        linePathD += `L${points[i].x},${points[i].y} `;
    }
    
    linePath.setAttribute('d', linePathD);
    linePath.setAttribute('stroke', config.color);
    linePath.setAttribute('stroke-width', config.lineWidth);
    linePath.setAttribute('fill', 'none');
    svg.appendChild(linePath);
    
    // Adicionar pontos
    points.forEach((point, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', 3);
        circle.setAttribute('fill', config.color);
        
        // Adicionar tooltip
        circle.addEventListener('mouseover', function(e) {
            showTooltip(e, `${labels[index]}: ${data[index].toFixed(1)}`);
        });
        
        circle.addEventListener('mouseout', hideTooltip);
        
        svg.appendChild(circle);
    });
    
    // Adicionar clipping path para garantir que o gráfico não ultrapasse os limites
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    const clipId = 'clip-' + Math.random().toString(36).substr(2, 9);
    clipPath.setAttribute('id', clipId);
    
    const clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    clipRect.setAttribute('x', '0');
    clipRect.setAttribute('y', '0');
    clipRect.setAttribute('width', width);
    clipRect.setAttribute('height', height);
    
    clipPath.appendChild(clipRect);
    svg.appendChild(clipPath);
    
    // Aplicar clipping path aos elementos do gráfico
    areaPath.setAttribute('clip-path', `url(#${clipId})`);
    linePath.setAttribute('clip-path', `url(#${clipId})`);
}

function addReferenceLine(container, value, label, color, config) {
    const grafiArea = container.querySelector('.grafi-area');
    if (!grafiArea) return;
    
    // Calcular posição Y da linha
    const height = grafiArea.offsetHeight;
    const normalizedValue = (value - config.minValue) / (config.maxValue - config.minValue);
    const y = height - (normalizedValue * height);
    
    // Criar linha de referência
    const referenceLine = document.createElement('div');
    referenceLine.classList.add('reference-line');
    referenceLine.style.position = 'absolute';
    referenceLine.style.left = '0';
    referenceLine.style.right = '0';
    referenceLine.style.top = y + 'px';
    referenceLine.style.borderTop = `2px dashed ${color}`;
    grafiArea.appendChild(referenceLine);
    
    // Adicionar label
    const referenceLabel = document.createElement('span');
    referenceLabel.classList.add('reference-label');
    referenceLabel.style.position = 'absolute';
    referenceLabel.style.right = '5px';
    referenceLabel.style.top = '-15px';
    referenceLabel.style.fontSize = '12px';
    referenceLabel.style.color = color;
    referenceLabel.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    referenceLabel.style.padding = '2px 5px';
    referenceLabel.style.borderRadius = '3px';
    referenceLabel.textContent = `${label} (${value}m)`;
    referenceLine.appendChild(referenceLabel);
}

// Funções auxiliares
function generateTimeLabels(count, hourOffset = 0) {
    const labels = [];
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
        const time = new Date(now);
        time.setHours(time.getHours() - i + hourOffset);
        labels.push(time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }
    
    return labels;
}

function generateRandomData(count, min, max) {
    return Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

function generateWaterLevelData(count) {
    const baseLevel = 0.9;
    const data = [];
    
    for (let i = 0; i < count; i++) {
        // Gerar um nível de água realista com pequenas variações
        const variation = (Math.random() * 0.2) - 0.1; // -0.1 a 0.1
        data.push(baseLevel + variation);
    }
    
    return data;
}

// Tooltip para pontos do gráfico
function showTooltip(event, text) {
    let tooltip = document.getElementById('grafi-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'grafi-tooltip';
        tooltip.style.position = 'fixed';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.zIndex = '1000';
        tooltip.style.pointerEvents = 'none';
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY - 30) + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('grafi-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Funções para atualização dos gráficos (chamadas pelo painel.js)
function updateHumidityGrafi(value) {
    if (!window.humidityGrafiData) return;
    
    const grafiData = window.humidityGrafiData;
    const grafiContainer = document.getElementById('humidity-grafi');
    
    if (!grafiContainer) return;
    
    // Atualizar dados
    grafiData.data.push(value);
    grafiData.data.shift();
    
    // Atualizar labels
    grafiData.labels.push(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    grafiData.labels.shift();
    
    // Redesenhar gráfico
    drawLineGrafi(grafiContainer, grafiData.data, grafiData.labels, grafiData.config);
}

function updateWaterLevelGrafi(value) {
    if (!window.waterLevelGrafiData) return;
    
    const grafiData = window.waterLevelGrafiData;
    const grafiContainer = document.getElementById('water-level-grafi');
    
    if (!grafiContainer) return;
    
    // Atualizar dados
    grafiData.data.push(value);
    grafiData.data.shift();
    
    // Atualizar labels
    grafiData.labels.push(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    grafiData.labels.shift();
    
    // Redesenhar gráfico
    drawLineGrafi(grafiContainer, grafiData.data, grafiData.labels, grafiData.config);
    
    // Adicionar linhas de referência
    addReferenceLine(grafiContainer, 1.5, 'Nível de Alerta', '#FBBC04', grafiData.config);
    addReferenceLine(grafiContainer, 1.8, 'Nível Crítico', '#EA4335', grafiData.config);
}

// Adicionar listener para redimensionamento da janela
window.addEventListener('resize', function() {
    // Redesenhar gráficos quando a janela for redimensionada
    if (window.humidityGrafiData) {
        const grafiContainer = document.getElementById('humidity-grafi');
        if (grafiContainer) {
            // Atualizar largura do gráfico
            window.humidityGrafiData.config.width = grafiContainer.offsetWidth;
            drawLineGrafi(grafiContainer, window.humidityGrafiData.data, window.humidityGrafiData.labels, window.humidityGrafiData.config);
        }
    }
    
    if (window.waterLevelGrafiData) {
        const grafiContainer = document.getElementById('water-level-grafi');
        if (grafiContainer) {
            // Atualizar largura do gráfico
            window.waterLevelGrafiData.config.width = grafiContainer.offsetWidth;
            drawLineGrafi(grafiContainer, window.waterLevelGrafiData.data, window.waterLevelGrafiData.labels, window.waterLevelGrafiData.config);
            
            // Adicionar linhas de referência
            addReferenceLine(grafiContainer, 1.5, 'Nível de Alerta', '#FBBC04', window.waterLevelGrafiData.config);
            addReferenceLine(grafiContainer, 1.8, 'Nível Crítico', '#EA4335', window.waterLevelGrafiData.config);
        }
    }
});
