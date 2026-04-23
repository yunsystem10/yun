class WeatherWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .weather-container {
                    background: #2C2C2C;
                    border-radius: 20px;
                    padding: 20px;
                    margin-bottom: 20px;
                    color: white;
                    text-align: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    font-family: 'Helvetica Neue', sans-serif;
                    min-width: 250px;
                }
                .temp {
                    font-size: 2.5rem;
                    font-weight: 300;
                    margin: 10px 0;
                }
                .desc {
                    font-size: 1.1rem;
                    color: #aaa;
                    text-transform: capitalize;
                }
                .details {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 15px;
                    font-size: 0.9rem;
                    color: #888;
                }
                .loading {
                    color: #666;
                    font-style: italic;
                }
            </style>
            <div class="weather-container">
                <div id="weather-content">
                    <div class="loading">Loading weather...</div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.fetchWeather();
    }

    async fetchWeather() {
        try {
            const response = await fetch('https://wttr.in/?format=j1');
            const data = await response.json();
            const current = data.current_condition[0];
            const temp = current.temp_C;
            const desc = current.weatherDesc[0].value;
            const humidity = current.humidity;
            const feelsLike = current.FeelsLikeC;

            this.shadowRoot.getElementById('weather-content').innerHTML = `
                <div class="desc">${desc}</div>
                <div class="temp">${temp}°C</div>
                <div class="details">
                    <span>Humidity: ${humidity}%</span>
                    <span>Feels like: ${feelsLike}°C</span>
                </div>
            `;
        } catch (error) {
            this.shadowRoot.getElementById('weather-content').innerHTML = `
                <div style="color: #ff4d4d;">Failed to load weather</div>
            `;
        }
    }
}

customElements.define('weather-widget', WeatherWidget);

class LottoDrawingMachine extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --hue-rotate: 200deg;
                }
                .lotto-machine {
                    background: #2C2C2C;
                    border-radius: 25px;
                    padding: 40px;
                    text-align: center;
                    color: white;
                    box-shadow: 
                        0px 2.8px 2.2px rgba(0, 0, 0, 0.02), 
                        0px 6.7px 5.3px rgba(0, 0, 0, 0.028), 
                        0px 12.5px 10px rgba(0, 0, 0, 0.035), 
                        0px 22.3px 17.9px rgba(0, 0, 0, 0.042), 
                        0px 41.8px 33.4px rgba(0, 0, 0, 0.05), 
                        0px 100px 80px rgba(0, 0, 0, 0.07), 
                        inset 0 1px 2px rgba(255, 255, 255, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .lotto-machine:hover {
                    transform: translateY(-5px);
                    box-shadow: 
                        0px 4px 3px rgba(0, 0, 0, 0.03), 
                        0px 8.7px 7.3px rgba(0, 0, 0, 0.04), 
                        0px 15.5px 13px rgba(0, 0, 0, 0.05), 
                        0px 27.3px 22.9px rgba(0, 0, 0, 0.06), 
                        0px 51.8px 43.4px rgba(0, 0, 0, 0.07), 
                        0px 120px 100px rgba(0, 0, 0, 0.1), 
                        inset 0 1px 2px rgba(255, 255, 255, 0.1);
                }
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 30px;
                    font-weight: 300;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #E0E0E0;
                }
                .lotto-red {
                    color: #ff4d4d; /* Using a vibrant red that fits the dark theme better than pure red */
                    font-weight: bold;
                }
                .number-display {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 80px;
                    margin: 30px 0;
                    gap: 15px;
                }
                .number-row {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }
                .number-ball {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 60px;
                    height: 60px;
                    margin: 0 8px;
                    border-radius: 50%;
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: white;
                    position: relative;
                    animation: pop-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
                    transform: scale(0);
                }
                @keyframes pop-in {
                    to { transform: scale(1); }
                }
                .button-group {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                #generate-btn, #reset-btn {
                    padding: 15px 35px;
                    border: none;
                    border-radius: 50px;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: all 0.3s ease-in-out;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                #generate-btn {
                    background: linear-gradient(145deg, #333, #1a1a1a);
                }
                #reset-btn {
                    background: linear-gradient(145deg, #4a1a1a, #2a0a0a);
                }
                #generate-btn::before, #reset-btn::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(0deg);
                    width: 200%;
                    height: 200%;
                    animation: rotate-glow 5s linear infinite paused;
                }
                #generate-btn::before {
                    background: conic-gradient(from 0deg, transparent 50%, #ff5722, #ffc107, #4caf50, #03a9f4, #9c27b0, #ff5722);
                }
                #reset-btn::before {
                    background: conic-gradient(from 0deg, transparent 50%, #ff4d4d, #d32f2f, #b71c1c, #ff4d4d);
                }
                #generate-btn:hover::before, #reset-btn:hover::before {
                    animation-play-state: running;
                }
                #generate-btn:hover, #reset-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.4);
                }
                #generate-btn span, #reset-btn span {
                    position: relative;
                    z-index: 1;
                }
                @keyframes rotate-glow {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
            </style>
            <div class="lotto-machine">
                <h1><span class="lotto-red">로또</span> 기계</h1>
                <div class="number-display"></div>
                <div class="button-group">
                    <button id="generate-btn"><span>Generate</span></button>
                    <button id="reset-btn"><span>초기화</span></button>
                </div>
            </div>
        `;

        this.generateBtn = this.shadowRoot.getElementById('generate-btn');
        this.resetBtn = this.shadowRoot.getElementById('reset-btn');
        this.numberDisplay = this.shadowRoot.querySelector('.number-display');
        
        this.generateBtn.addEventListener('click', this.generateNumbers.bind(this));
        this.resetBtn.addEventListener('click', this.resetNumbers.bind(this));
    }

    resetNumbers() {
        this.numberDisplay.innerHTML = '';
    }

    getColor(number) {
        if (number <= 10) return 'linear-gradient(135deg, #FFD700, #FFA500)'; // Gold to Orange
        if (number <= 20) return 'linear-gradient(135deg, #87CEEB, #4682B4)'; // SkyBlue to SteelBlue
        if (number <= 30) return 'linear-gradient(135deg, #F08080, #CD5C5C)'; // LightCoral to IndianRed
        if (number <= 40) return 'linear-gradient(135deg, #98FB98, #3CB371)'; // PaleGreen to MediumSeaGreen
        return 'linear-gradient(135deg, #DDA0DD, #BA55D3)'; // Plum to MediumOrchid
    }

    generateNumbers() {
        this.numberDisplay.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const row = document.createElement('div');
            row.classList.add('number-row');
            
            const numbers = new Set();
            while (numbers.size < 6) {
                const randomNumber = Math.floor(Math.random() * 45) + 1;
                numbers.add(randomNumber);
            }

            const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

            sortedNumbers.forEach((number, index) => {
                const ball = document.createElement('div');
                ball.classList.add('number-ball');
                ball.textContent = number;
                ball.style.background = this.getColor(number);
                ball.style.animationDelay = `${(i * 6 + index) * 0.05}s`;
                row.appendChild(ball);
            });
            this.numberDisplay.appendChild(row);
        }
    }
}

customElements.define('lotto-drawing-machine', LottoDrawingMachine);
