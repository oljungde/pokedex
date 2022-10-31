/**
 * array for border colors in the overlay, one color for each pokemon type
 */
let pokemonOverlayBorder = [
    {
        normal: '#474734',
        fire: '#8a4a21',
        water: '#455a8c',
        grass: '#39632b',
        electric: '#917A1F',
        ice: '#567575',
        fighting: '#661A16',
        poison: '#8C378B',
        ground: '#7D6C3E',
        flying: '#62558A',
        psychic: '#943B56',
        bug: '#505710',
        rock: '#594E1D',
        ghost: '#281F36',
        dark: '#0F0C0A',
        dragon: '#452491',
        steel: '#63636E',
        fairy: '#99518D',
    }
];


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
 * function to show the pokemon card details
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 */
function showPokemonDetails(pokemonIndex) {
    let htmlBody = document.body;
    htmlBody.style.overflowY = 'hidden';
    let contentContainer = document.getElementById('content');
    contentContainer.classList.add('content-overlay');
    let pokemonOverlay = document.getElementById('pokemon_overlay');
    pokemonOverlay.classList.remove('display-none');
    renderPokemonDetails(pokemonIndex);
}


/**
 * card won't close on click
 * @param {*} event click event on pokemon card in the over
 */
function propagation(event) {
    event.stopPropagation();
}


/**
 * function to close the pokemon details overlay
 */
function hidePokemonDetails() {
    let htmlBody = document.body;
    htmlBody.style.overflowY = 'scroll';
    let contentContainer = document.getElementById('content');
    contentContainer.classList.remove('content-overlay');
    let pokemonOverlay = document.getElementById('pokemon_overlay');
    pokemonOverlay.classList.add('display-none');
}


/**
 * renders the pokemon card in the overlay
 * @param {number} pokemonIndex of the array loadedPokemon, 
 */
async function renderPokemonDetails(pokemonIndex) {
    let pokemonOverlay = document.getElementById('pokemon_overlay');
    let pokemonType0 = loadedPokemon[pokemonIndex]['types'][0]['type']['name'];
    pokemonOverlay.innerHTML = pokemonDetailsTemplate(pokemonType0);
    renderPokemonDetailsName(pokemonIndex);
    renderPokemonDetailsData(pokemonIndex);
    renderPokemonDetailsBody(pokemonIndex);
    renderPokemonDetailsImage(pokemonIndex, pokemonType0);
    renderPokemonDetailsAbilities(pokemonIndex);
    renderPokemonDetailsStats(pokemonIndex);
    getPokemonEvolutionChain(pokemonIndex);
    renderPokemonMoves(pokemonIndex);
}


/**
 * renders the name of pokemon in the overlay card 
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
function renderPokemonDetailsName(pokemonIndex) {
    let pokemonDetailsTopContainer = document.getElementById('pokemon_details_top');
    let pokemonName = loadedPokemon[pokemonIndex]['name'];
    let pokemonFormattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    pokemonDetailsTopContainer.innerHTML += pokemonNameTemplate(pokemonFormattedName);
}


/**
 * check if pokemon as one or two types an render the type(s)
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
function renderPokemonDetailsData(pokemonIndex) {
    let pokemonDetailsTopContainer = document.getElementById('pokemon_details_top');
    let pokemonTypes = loadedPokemon[pokemonIndex]['types'];
    let pokemonType0 = pokemonTypes[0]['type']['name'];
    if (pokemonTypes.length > 1) {
        let pokemonType1 = pokemonTypes[1]['type']['name'];
        pokemonDetailsTopContainer.innerHTML += pokemonDetailsDataTwoTypesTemplate(pokemonType0, pokemonType1);
    } else {
        pokemonDetailsTopContainer.innerHTML += pokemonDetailsDataOneTypeTemplate(pokemonType0);
    }
}


/**
 * renders the poke height and wheigt
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
function renderPokemonDetailsBody(pokemonIndex) {
    let pokemonDetailsTopContainer = document.getElementById('pokemon_details_top');
    let pokemonHeight = loadedPokemon[pokemonIndex]['height'];
    let pokemonSize = (+pokemonHeight / 10).toLocaleString();
    let pokemonWeight = loadedPokemon[pokemonIndex]['weight'];
    let pokemonKg = (+pokemonWeight / 10).toLocaleString();
    pokemonDetailsTopContainer.innerHTML += pokemonDetailsBodyTemplate(pokemonSize, pokemonKg);
}


/**
 * renders the image of pokemon with a different border for each pokemon main type (type0)
 * @param {number} pokemonIndex of the array loadedPokemon,
 * @param {string} pokemonType0 name of type from pokemon
 */
function renderPokemonDetailsImage(pokemonIndex, pokemonType0) {
    let pokemonDetailsContainer = document.getElementById('pokemon_details');
    let pokemonImage = loadedPokemon[pokemonIndex]['sprites']['other']['official-artwork']['front_default'];
    if (pokemonImage == null) {
        pokemonImage = loadedPokemon[pokemonIndex]['sprites']['front_default'];
        if (pokemonImage == null) {
            pokemonImage = loadedPokemon[pokemonIndex]['sprites']['other']['home']['front_default'];
            if (pokemonImage == null) {
                pokemonImage = `./img/no-image.png`;
            }
        }
    }
    pokemonDetailsContainer.innerHTML += pokemonDetailsImageTemplate(pokemonImage, pokemonType0);
}


/**
 * renders the container for pokemon abilities
 */
function renderPokemonDetailsAbilitiesContainer() {
    let pokemonDetailsBottomContainer = document.getElementById('pokemon_details_bottom');
    pokemonDetailsBottomContainer.innerHTML += pokemonDetailsAbilitiesContainerTemplate();
}


/**
 * render a single ability
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
function renderPokemonDetailsAbilities(pokemonIndex) {
    renderPokemonDetailsAbilitiesContainer();
    let pokemonDetailsAbilitiesContainer = document.getElementById('pokemon_abilities');
    let pokemonAbilities = loadedPokemon[pokemonIndex]['abilities'];
    for (let i = 0; i < pokemonAbilities.length; i++) {
        const pokemonAbility = pokemonAbilities[i];
        pokemonDetailsAbilitiesContainer.innerHTML += pokemonDetailsAbilityTemplate(pokemonAbility);
    }
}


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


/**
 * renders the container for pokemon evolution chain
 */
function renderPokemonDetailsEvolutionChainContainer() {
    let pokemonDetailsBottomContainer = document.getElementById('chain');
    pokemonDetailsBottomContainer.innerHTML += pokemonDetailsEvolutionChainContainerTemplate();
}


/**
 * get the evolution from json and call the render function for evolution container and the evolution chain
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
async function getPokemonEvolutionChain(pokemonIndex) {
    let pokemonSpeciesUrl = loadedPokemon[pokemonIndex]['species']['url'];
    let pokemonSpecies = await fetch(pokemonSpeciesUrl);
    let pokemonSpeciesAsJson = await pokemonSpecies.json();
    let pokemonEvolutionChainUrl = pokemonSpeciesAsJson['evolution_chain']['url'];
    let pokemonEvolutionChain = await fetch(pokemonEvolutionChainUrl);
    let pokemonEvolutionChainAsJson = await pokemonEvolutionChain.json();
    renderPokemonDetailsEvolutionChainContainer();
    renderPokemonDetailsEvolutionChain(pokemonEvolutionChainAsJson);
}


/**
 * @param {json} pokemonEvolutionChainAsJson get the single stops in evolution chain from jason
 * and render it
 */
function renderPokemonDetailsEvolutionChain(pokemonEvolutionChainAsJson) {
    let pokemonEvolutionSteps = document.getElementById('evolution_steps');
    let pokemonEvolutionChain = pokemonEvolutionChainAsJson['chain']['evolves_to'];
    if (pokemonEvolutionChain.length < 1) {
        pokemonEvolutionSteps.innerHTML += pokemonDetailsNoEvolutionChainTemplate();
    } else if (pokemonEvolutionChain[0]['evolves_to'].length == 0) {
        renderFirstEvolutionStep(pokemonEvolutionChainAsJson);
        renderSecondEvolutionStep(pokemonEvolutionChainAsJson);
    } else if (pokemonEvolutionChain[0]['evolves_to'].length > 0) {
        renderFirstEvolutionStep(pokemonEvolutionChainAsJson);
        renderSecondEvolutionStep(pokemonEvolutionChainAsJson);
        renderThirdEvolutionStep(pokemonEvolutionChainAsJson);
    }
}


/**
 * render the first evolution step on pokemon overlay card
 * @param {json} pokemonEvolutionChainAsJson 
 */
function renderFirstEvolutionStep(pokemonEvolutionChainAsJson) {
    let pokemonEvolutionSteps = document.getElementById('evolution_steps');
    let firstEvolutionStepName = pokemonEvolutionChainAsJson['chain']['species']['name'];
    let firstEvolutionStepNameFormatted = firstEvolutionStepName.charAt(0).toUpperCase() + firstEvolutionStepName.slice(1);
    for (let i = 0; i < loadedPokemon.length; i++) {
        const firstEvolutionPokemon = loadedPokemon[i];
        let firstEvolutionPokemonName = firstEvolutionPokemon['name'];
        let firstEvolutionPokemonNameFormatted = firstEvolutionPokemonName.charAt(0).toUpperCase() + firstEvolutionPokemonName.slice(1)
        let firstEvolutionPokemonImage = loadedPokemon[i]['sprites']['other']['official-artwork']['front_default'];
        if (firstEvolutionStepNameFormatted == firstEvolutionPokemonNameFormatted) {
            pokemonEvolutionSteps.innerHTML += evolutionStepTemplate(firstEvolutionStepNameFormatted, firstEvolutionPokemonImage);
        }
    }
}


/**
 * render the second evolution step on pokemon overlay card
 * @param {json} pokemonEvolutionChainAsJson 
 */
function renderSecondEvolutionStep(pokemonEvolutionChainAsJson) {
    let pokemonEvolutionSteps = document.getElementById('evolution_steps');
    let secondEvolutionStepName = pokemonEvolutionChainAsJson['chain']['evolves_to'][0]['species']['name'];
    let secondEvolutionStepNameFormatted = secondEvolutionStepName.charAt(0).toUpperCase() + secondEvolutionStepName.slice(1);
    for (let i = 0; i < loadedPokemon.length; i++) {
        const secondEvolutionPokemon = loadedPokemon[i];
        let secondEvolutionPokemonName = secondEvolutionPokemon['name'];
        let secondEvolutionPokemonNameFormatted = secondEvolutionPokemonName.charAt(0).toUpperCase() + secondEvolutionPokemonName.slice(1)
        let secondEvolutionPokemonImage = loadedPokemon[i]['sprites']['other']['official-artwork']['front_default'];
        if (secondEvolutionStepNameFormatted == secondEvolutionPokemonNameFormatted) {
            pokemonEvolutionSteps.innerHTML += evolutionStepTemplate(secondEvolutionStepNameFormatted, secondEvolutionPokemonImage);
        }
    }
}


/**
 * render the third evolution step on pokemon overlay card
 * @param {json} pokemonEvolutionChainAsJson 
 */
function renderThirdEvolutionStep(pokemonEvolutionChainAsJson) {
    let pokemonEvolutionSteps = document.getElementById('evolution_steps');
    let thirdEvolutionStepName = pokemonEvolutionChainAsJson['chain']['evolves_to'][0]['evolves_to'][0]['species']['name'];
    let thirdEvolutionStepNameFormatted = thirdEvolutionStepName.charAt(0).toUpperCase() + thirdEvolutionStepName.slice(1);
    for (let i = 0; i < loadedPokemon.length; i++) {
        const thirdEvolutionPokemon = loadedPokemon[i];
        let thirdEvolutionPokemonName = thirdEvolutionPokemon['name'];
        let thirdEvolutionPokemonNameFormatted = thirdEvolutionPokemonName.charAt(0).toUpperCase() + thirdEvolutionPokemonName.slice(1)
        let thirdEvolutionPokemonImage = loadedPokemon[i]['sprites']['other']['official-artwork']['front_default'];
        if (thirdEvolutionStepNameFormatted == thirdEvolutionPokemonNameFormatted) {
            pokemonEvolutionSteps.innerHTML += evolutionStepTemplate(thirdEvolutionStepNameFormatted, thirdEvolutionPokemonImage);
        }
    }
}


/**
 * function to switch to the moves tab on pokemon overlay card
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 */
function switchToMoves(pokemonIndex) {
    let pokemonStatsContainer = document.getElementById('pokemon_details_bottom');
    let pokemonMovesContainer = document.getElementById('pokemon_details_moves')
    pokemonStatsContainer.classList.add('display-none');
    pokemonMovesContainer.classList.remove('display-none');
}


/**
 * function to switch back to main stats of pokemon
 */
function switchToStats() {
    let pokemonStatsContainer = document.getElementById('pokemon_details_bottom');
    let pokemonMovesContainer = document.getElementById('pokemon_details_moves')
    pokemonStatsContainer.classList.remove('display-none');
    pokemonMovesContainer.classList.add('display-none');
}


/**
 * render the container for the pokemon moves on overlay card
 */
function renderPokemonMovesContainer() {
    let pokemonMovesContainer = document.getElementById('pokemon_details_moves');
    pokemonMovesContainer.innerHTML += pokemonMovesContainerTemplate();
}


/**
 * render a single pokemon move
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 */
function renderPokemonMoves(pokemonIndex) {
    renderPokemonMovesContainer();
    let pokemonMovesContainer = document.getElementById('pokemon_moves')
    let pokemonMoves = loadedPokemon[pokemonIndex]['moves'];
    for (let i = 0; i < pokemonMoves.length; i++) {
        const pokemonMove = pokemonMoves[i]['move']['name'];
        pokemonMovesContainer.innerHTML += pokemonMoveTemplate(pokemonMove);
    }
}