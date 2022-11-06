/**
 * register a new chart with libary chart.js for the stats of pokemon 
 */
Chart.register(ChartDataLabels);
let statsChartLabels = ['HP', 'Attack', 'Defense', 'Special-Attack', 'Special-Defense', 'Speed']
let statsChartData = {
    labels: statsChartLabels,
    datasets: [{
        label: '',
        borderSkipped: '',
        borderRadius: 8,
        backgroundColor: [
            'rgb(40, 167, 69)',
            'rgb(220, 53, 69)',
            'rgb(121, 182, 185)',
            'rgb(220, 53, 69)',
            'rgb(121, 182, 185)',
            'rgb(255, 153, 51)',
        ],
        borderColor: 'rgb(255, 99, 132)',
        data: [],
    }]
};


/**
 * configuration for stats chart
 */
const statsChartConfig = {
    type: 'bar',
    data: statsChartData,
    options: {
        indexAxis: 'y',
        scales: {
            xAxis: {
                display: false
            },
            yAxis: {
                grid: {
                    display: false,
                    borderWidth: 0
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                display: true,
                color: 'rgb(239, 239, 239)',
            },
            tooltip: {
                enabled: false
            }
        }
    }
};


/**
 * renders the polemon stats container
 */
function renderPokemonDetailsStatsContainer() {
    let pokemonDetailsBottomContainer = document.getElementById('pokemon_details_bottom');
    pokemonDetailsBottomContainer.innerHTML += pokemonDetailsStatsContainerTemplate();
}


/**
 * get the values of each stat from the pokemon and push i in the data array for the chart
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
function getPokemonStats(pokemonIndex) {
    let pokemon = loadedPokemon[pokemonIndex];
    statsChartData['datasets'][0]['data'] = [];
    for (let i = 0; i < pokemon['stats'].length; i++) {
        const pokemonStat = pokemon['stats'][i]['base_stat'];
        statsChartData['datasets'][0]['data'].push(pokemonStat);
    }
}


/**
 * renders the poskemon stats chart 
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
function renderPokemonDetailsStats(pokemonIndex) {
    getPokemonStats(pokemonIndex);
    renderPokemonDetailsStatsContainer();
    let pokemonDetailsStatsContainer = document.getElementById('pokemon_stats');
    pokemonDetailsStatsContainer.innerHTML += pokemonDetailsStatTemplate();
    const statsChart = new Chart(
        document.getElementById('stats_chart'),
        statsChartConfig
    );
}