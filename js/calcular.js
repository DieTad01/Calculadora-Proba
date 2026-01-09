document.addEventListener("DOMContentLoaded", () => {
// =================== NAVEGACIÓN ===================
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function() {
                // Remover clase active de todos
                document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                
                // Agregar clase active al seleccionado
                this.classList.add('active');
                const sectionId = this.getAttribute('data-section');
                document.getElementById(sectionId).classList.add('active');
            });
        });

        // =================== UTILIDADES ===================
        function parseData(input) {
            return input.split(',')
                .map(x => parseFloat(x.trim()))
                .filter(x => !isNaN(x));
        }

        // =================== FUNCIONES DE ESTADÍSTICA DESCRIPTIVA ===================
        function calculateDescriptive() {
            const input = document.getElementById('dataInput').value;
            const data = parseData(input);
            
            if (data.length === 0) {
                alert('Ingresa datos válidos');
                return;
            }
            
            // Ordenar para mediana
            const sorted = [...data].sort((a, b) => a - b);
            const n = data.length;
            
            // Media
            const mean = data.reduce((a, b) => a + b, 0) / n;
            
            // Mediana
            let median;
            if (n % 2 === 0) {
                median = (sorted[n/2 - 1] + sorted[n/2]) / 2;
            } else {
                median = sorted[Math.floor(n/2)];
            }
            
            // Moda
            const freq = {};
            data.forEach(x => freq[x] = (freq[x] || 0) + 1);
            const maxFreq = Math.max(...Object.values(freq));

            // Cuando NO hay moda
            const mode = maxFreq === 1
            ? 'No hay moda'
            : Object.keys(freq).filter(x => freq[x] === maxFreq).join(', ');
            
            // Varianza y desviación
            const variance = data.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1);
            const stdDev = Math.sqrt(variance);
            
            // Rango
            const range = Math.max(...data) - Math.min(...data);
            
            // Resultados
            const output = `
                <div class="result-item"><strong>Datos:</strong> ${data.join(', ')}</div>
                <div class="result-item"><strong>n =</strong> ${n} elementos</div>
                <div class="result-item"><strong>Media aritmética:</strong> ${mean.toFixed(4)}</div>
                <div class="result-item"><strong>Mediana:</strong> ${median.toFixed(4)}</div>
                <div class="result-item"><strong>Moda:</strong> ${mode}</div>
                <div class="result-item"><strong>Varianza:</strong> ${variance.toFixed(4)}</div>
                <div class="result-item"><strong>Desviación estándar:</strong> ${stdDev.toFixed(4)}</div>
                <div class="result-item"><strong>Rango:</strong> ${range.toFixed(4)}</div>
                <div class="result-item"><strong>Mínimo:</strong> ${Math.min(...data).toFixed(4)}</div>
                <div class="result-item"><strong>Máximo:</strong> ${Math.max(...data).toFixed(4)}</div>
            `;
            
            document.getElementById('descriptiveOutput').innerHTML = output;
        }

        function clearDescriptive() {
            document.getElementById('dataInput').value = '';
            document.getElementById('descriptiveOutput').innerHTML = '';
        }

        // =================== FUNCIONES DE PROBABILIDAD ===================
        function factorial(n) {
            if (n <= 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        function calculatePermComb() {
            const n = parseInt(document.getElementById('nPerm').value);
            const r = parseInt(document.getElementById('rPerm').value);
            
            if (isNaN(n) || isNaN(r) || r > n) {
                alert('Ingresa valores válidos (r ≤ n)');
                return;
            }
            
            const permutations = factorial(n) / factorial(n - r);
            const combinations = factorial(n) / (factorial(r) * factorial(n - r));
            
            document.getElementById('probabilityOutput').innerHTML = `
                <div class="result-item"><strong>Permutaciones P(${n},${r}):</strong> ${permutations.toLocaleString()}</div>
                <div class="result-item"><strong>Combinaciones C(${n},${r}):</strong> ${combinations.toLocaleString()}</div>
                <div class="result-item"><strong>Fórmula permutaciones:</strong> ${n}! / (${n}-${r})! = ${factorial(n)} / ${factorial(n-r)}</div>
                <div class="result-item"><strong>Fórmula combinaciones:</strong> ${n}! / (${r}! × (${n}-${r})!)</div>
            `;
        }

        function calculateProbability() {
            const favorable = parseInt(document.getElementById('favorable').value);
            const total = parseInt(document.getElementById('totalCases').value);
            
            if (isNaN(favorable) || isNaN(total) || favorable > total || total <= 0) {
                alert('Datos inválidos');
                return;
            }
            
            const prob = favorable / total;
            const probPercent = (prob * 100).toFixed(2);
            
            document.getElementById('probabilityOutput').innerHTML += `
                <div class="result-item"><strong>Probabilidad:</strong> ${favorable}/${total} = ${prob.toFixed(4)} (${probPercent}%)</div>
                <div class="result-item"><strong>Probabilidad complementaria:</strong> ${(1 - prob).toFixed(4)}</div>
            `;
        }

        // =================== VARIABLES ALEATORIAS ===================
        function showContinuousParams() {
            const dist = document.getElementById('continuousDist').value;
            let html = '';
            
            if (dist === 'uniform') {
                html = `
                    <label>Límite inferior (a):</label>
                    <input type="number" id="param1" value="0">
                    <label>Límite superior (b):</label>
                    <input type="number" id="param2" value="1">
                `;
            } else if (dist === 'exponential') {
                html = `
                    <label>Tasa (λ):</label>
                    <input type="number" id="param1" value="1">
                    <label>Valor x:</label>
                    <input type="number" id="paramX" value="0.5">
                `;
            } else if (dist === 'normal') {
                html = `
                    <label>Media (μ):</label>
                    <input type="number" id="param1" value="0">
                    <label>Desviación (σ):</label>
                    <input type="number" id="param2" value="1">
                    <label>Valor x:</label>
                    <input type="number" id="paramX" value="0">
                `;
            }
            
            document.getElementById('continuousParams').innerHTML = html;
        }

        function calculateDiscreteVar() {
            const vals = parseData(document.getElementById('discreteVals').value);
            const probs = parseData(document.getElementById('discreteProbs').value);
            
            if (vals.length !== probs.length || probs.reduce((a, b) => a + b, 0) > 1.01) {
                alert('Número de valores y probabilidades debe coincidir, y suma de probabilidades ≈ 1');
                return;
            }
            
            // Esperanza
            let expectation = 0;
            for (let i = 0; i < vals.length; i++) {
                expectation += vals[i] * probs[i];
            }
            
            // Varianza
            let variance = 0;
            for (let i = 0; i < vals.length; i++) {
                variance += Math.pow(vals[i] - expectation, 2) * probs[i];
            }
            const stdDev = Math.sqrt(variance);
            
            document.getElementById('randomVarsOutput').innerHTML = `
                <div class="result-item"><strong>Valor esperado E(X):</strong> ${expectation.toFixed(4)}</div>
                <div class="result-item"><strong>Varianza Var(X):</strong> ${variance.toFixed(4)}</div>
                <div class="result-item"><strong>Desviación estándar σ:</strong> ${stdDev.toFixed(4)}</div>
            `;
        }

        function calculateContinuousVar() {
            const dist = document.getElementById('continuousDist').value;
            let result = '';
            
            if (dist === 'uniform') {
                const a = parseFloat(document.getElementById('param1').value);
                const b = parseFloat(document.getElementById('param2').value);
                if (a >= b) {
                    alert('a debe ser menor que b');
                    return;
                }
                const mean = (a + b) / 2;
                const variance = Math.pow(b - a, 2) / 12;
                result = `
                    <div class="result-item"><strong>Distribución Uniforme U(${a}, ${b})</strong></div>
                    <div class="result-item"><strong>Media:</strong> ${mean.toFixed(4)}</div>
                    <div class="result-item"><strong>Varianza:</strong> ${variance.toFixed(4)}</div>
                    <div class="result-item"><strong>Desviación:</strong> ${Math.sqrt(variance).toFixed(4)}</div>
                `;
            } else if (dist === 'exponential') {
                const lambda = parseFloat(document.getElementById('param1').value);
                const x = parseFloat(document.getElementById('paramX').value);
                if (lambda <= 0 || x < 0) {
                    alert('λ > 0 y x ≥ 0');
                    return;
                }
                const pdf = lambda * Math.exp(-lambda * x);
                const cdf = 1 - Math.exp(-lambda * x);
                const mean = 1 / lambda;
                const variance = 1 / Math.pow(lambda, 2);
                result = `
                    <div class="result-item"><strong>Distribución Exponencial Exp(λ=${lambda})</strong></div>
                    <div class="result-item"><strong>f(${x}) =</strong> ${pdf.toFixed(6)}</div>
                    <div class="result-item"><strong>F(${x}) = P(X ≤ ${x}) =</strong> ${cdf.toFixed(6)}</div>
                    <div class="result-item"><strong>Media (1/λ):</strong> ${mean.toFixed(4)}</div>
                    <div class="result-item"><strong>Varianza (1/λ²):</strong> ${variance.toFixed(4)}</div>
                `;
            } else if (dist === 'normal') {
                const mu = parseFloat(document.getElementById('param1').value);
                const sigma = parseFloat(document.getElementById('param2').value);
                const x = parseFloat(document.getElementById('paramX').value);
                if (sigma <= 0) {
                    alert('σ > 0');
                    return;
                }
                const z = (x - mu) / sigma;
                // Función densidad aproximada
                const pdf = (1/(sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(z, 2));
                result = `
                    <div class="result-item"><strong>Distribución Normal N(${mu}, ${sigma})</strong></div>
                    <div class="result-item"><strong>Valor Z para x=${x}:</strong> z = ${z.toFixed(4)}</div>
                    <div class="result-item"><strong>f(${x}) ≈</strong> ${pdf.toFixed(6)}</div>
                    <div class="result-item"><strong>Media:</strong> ${mu}</div>
                    <div class="result-item"><strong>Desviación:</strong> ${sigma}</div>
                `;
            }
            
            document.getElementById('randomVarsOutput').innerHTML = result;
        }

        // =================== DISTRIBUCIONES ===================
        function showDistributionParams() {
            const dist = document.getElementById('distributionType').value;
            let html = '';
            
            if (dist === 'binomial') {
                html = `
                    <label>Número de ensayos (n):</label>
                    <input type="number" id="distParam1" value="10">
                    <label>Probabilidad de éxito (p):</label>
                    <input type="number" id="distParam2" value="0.5" step="0.01" min="0" max="1">
                    <label>Número de éxitos (k):</label>
                    <input type="number" id="distParam3" value="5">
                `;
            } else if (dist === 'poisson') {
                html = `
                    <label>Tasa (λ):</label>
                    <input type="number" id="distParam1" value="3">
                    <label>Número de eventos (k):</label>
                    <input type="number" id="distParam2" value="2">
                `;
            } else if (dist === 'normal') {
                html = `
                    <label>Media (μ):</label>
                    <input type="number" id="distParam1" value="0">
                    <label>Desviación (σ):</label>
                    <input type="number" id="distParam2" value="1">
                    <label>Valor x:</label>
                    <input type="number" id="distParam3" value="0">
                `;
            } else if (dist === 'tstudent') {
                html = `
                    <label>Grados de libertad (ν):</label>
                    <input type="number" id="distParam1" value="10">
                    <label>Valor t:</label>
                    <input type="number" id="distParam2" value="1.5">
                `;
            }
            
            document.getElementById('distributionParams').innerHTML = html;
        }

        function calculateDistribution() {
            const dist = document.getElementById('distributionType').value;
            let result = '';
            
            if (dist === 'binomial') {
                const n = parseInt(document.getElementById('distParam1').value);
                const p = parseFloat(document.getElementById('distParam2').value);
                const k = parseInt(document.getElementById('distParam3').value);
                
                // PMF binomial
                const comb = factorial(n) / (factorial(k) * factorial(n - k));
                const pmf = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
                const mean = n * p;
                const variance = n * p * (1 - p);
                
                result = `
                    <div class="result-item"><strong>P(X = ${k}) =</strong> ${pmf.toFixed(6)}</div>
                    <div class="result-item"><strong>Media (np):</strong> ${mean.toFixed(4)}</div>
                    <div class="result-item"><strong>Varianza (np(1-p)):</strong> ${variance.toFixed(4)}</div>
                `;
            } else if (dist === 'poisson') {
                const lambda = parseFloat(document.getElementById('distParam1').value);
                const k = parseInt(document.getElementById('distParam2').value);
                
                // PMF Poisson
                const pmf = (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
                
                result = `
                    <div class="result-item"><strong>P(X = ${k}) =</strong> ${pmf.toFixed(6)}</div>
                    <div class="result-item"><strong>Media (λ):</strong> ${lambda.toFixed(4)}</div>
                    <div class="result-item"><strong>Varianza (λ):</strong> ${lambda.toFixed(4)}</div>
                `;
            } else if (dist === 'normal') {
            // AÑADIR ESTE BLOQUE:
            const mu = parseFloat(document.getElementById('distParam1').value);
            const sigma = parseFloat(document.getElementById('distParam2').value);
            const x = parseFloat(document.getElementById('distParam3').value);
            
            if (sigma <= 0) {
                alert('σ > 0');
                return;
            }
            
            const z = (x - mu) / sigma;
            // Aproximación simple de la CDF normal
            const t = 1 / (1 + 0.2316419 * Math.abs(z));
            const d = 0.3989423 * Math.exp(-z * z / 2);
            let p = 1 - d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
            
            if (z < 0) p = 1 - p;
            
            result = `
                <div class="result-item"><strong>Distribución Normal N(${mu}, ${sigma})</strong></div>
                <div class="result-item"><strong>Para x = ${x}:</strong> z = ${z.toFixed(4)}</div>
                <div class="result-item"><strong>P(X ≤ ${x}) ≈</strong> ${p.toFixed(6)}</div>
                <div class="result-item"><strong>P(X > ${x}) ≈</strong> ${(1 - p).toFixed(6)}</div>
            `;
        }
            
            document.getElementById('distributionOutput').innerHTML = result;
        }

        // =================== REGRESIÓN LINEAL ===================
        function calculateRegression() {
            const x = parseData(document.getElementById('regX').value);
            const y = parseData(document.getElementById('regY').value);
            
            if (x.length !== y.length || x.length < 2) {
                alert('X e Y deben tener el mismo número de valores (mínimo 2)');
                return;
            }
            
            const n = x.length;
            
            // Medias
            const meanX = x.reduce((a, b) => a + b, 0) / n;
            const meanY = y.reduce((a, b) => a + b, 0) / n;
            
            // Sumatorias
            let sumXY = 0, sumX2 = 0, sumY2 = 0;
            for (let i = 0; i < n; i++) {
                sumXY += (x[i] - meanX) * (y[i] - meanY);
                sumX2 += Math.pow(x[i] - meanX, 2);
                sumY2 += Math.pow(y[i] - meanY, 2);
            }
            
            // Pendiente e intersección
            const b1 = sumXY / sumX2;
            const b0 = meanY - b1 * meanX;
            
            // Coeficientes
            const r = sumXY / Math.sqrt(sumX2 * sumY2);
            const r2 = Math.pow(r, 2);
            
            document.getElementById('regressionOutput').innerHTML = `
                <div class="result-item"><strong>Ecuación de regresión:</strong> ŷ = ${b0.toFixed(4)} + ${b1.toFixed(4)}x</div>
                <div class="result-item"><strong>Coeficiente de correlación (r):</strong> ${r.toFixed(4)}</div>
                <div class="result-item"><strong>Coeficiente de determinación (R²):</strong> ${r2.toFixed(4)} (${(r2 * 100).toFixed(2)}%)</div>
                <div class="result-item"><strong>Interpretación R²:</strong> ${(r2 * 100).toFixed(1)}% de la variación en Y es explicada por X</div>
            `;
        }

        // =================== ESTADÍSTICA APLICADA ===================
        function calculateSampleSize() {
            const confLevel = parseFloat(document.getElementById('confLevel').value);
            const error = parseFloat(document.getElementById('maxError').value);
            const p = parseFloat(document.getElementById('estProp').value);
            
            // Valor Z para nivel de confianza
            let z;
            if (confLevel === 90) z = 1.645;
            else if (confLevel === 95) z = 1.96;
            else if (confLevel === 99) z = 2.576;
            else {
                // Aproximación normal estándar
                const alpha = (1 - confLevel/100);
                z = Math.abs(inverseNormal(1 - alpha/2));
            }
            
            const n = Math.ceil((Math.pow(z, 2) * p * (1 - p)) / Math.pow(error, 2));
            
            document.getElementById('appliedOutput').innerHTML = `
                <div class="result-item"><strong>Tamaño de muestra necesario:</strong> n ≥ ${n}</div>
                <div class="result-item"><strong>Nivel de confianza:</strong> ${confLevel}% (Z = ${z.toFixed(3)})</div>
                <div class="result-item"><strong>Error máximo:</strong> ${error}</div>
                <div class="result-item"><strong>Fórmula:</strong> n = Z² × p(1-p) / E²</div>
            `;
        }

        function calculateHypothesis() {
            const sampleMean = parseFloat(document.getElementById('sampleMean').value);
            const sampleStd = parseFloat(document.getElementById('sampleStd').value);
            const n = parseInt(document.getElementById('sampleSize').value);
            const popMean = 0; // Podrías agregar input para μ₀
            
            const t = (sampleMean - popMean) / (sampleStd / Math.sqrt(n));
            const df = n - 1;
            
            document.getElementById('appliedOutput').innerHTML += `
                <div class="result-item"><strong>Estadístico t:</strong> t = ${t.toFixed(4)}</div>
                <div class="result-item"><strong>Grados de libertad:</strong> ${df}</div>
                <div class="result-item"><strong>Fórmula:</strong> t = (x̄ - μ₀) / (s/√n)</div>
            `;
        }

        // =================== FUNCIONES AUXILIARES ===================
        function inverseNormal(p) {
            // Aproximación simple de Z para niveles de confianza comunes
            const zValues = {
                0.90: 1.645,
                0.95: 1.960,
                0.99: 2.576,
                0.80: 1.282,
                0.85: 1.440
            };
            
            // Convertir porcentaje a probabilidad
            const prob = p / 100;
            
            // Buscar valor más cercano
            let closestZ = 1.96; // valor por defecto para 95%
            let minDiff = Infinity;
            
            for (const [key, value] of Object.entries(zValues)) {
                const diff = Math.abs(parseFloat(key) - prob);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestZ = value;
                }
            }
            
            return closestZ;
        }

        // Inicializar parámetros de distribuciones continuas
        showContinuousParams();
        showDistributionParams();

        window.calculateDescriptive = calculateDescriptive;
        window.clearDescriptive = clearDescriptive;
        window.calculatePermComb = calculatePermComb;
        window.calculateProbability = calculateProbability;
        window.calculateDiscreteVar = calculateDiscreteVar;
        window.showContinuousParams = showContinuousParams;
        window.calculateContinuousVar = calculateContinuousVar;
        window.showDistributionParams = showDistributionParams;
        window.calculateDistribution = calculateDistribution;
        window.calculateRegression = calculateRegression;
        window.calculateSampleSize = calculateSampleSize;
        window.calculateHypothesis = calculateHypothesis;
        window.calculateContinuousVar = calculateContinuousVar;
       }); 