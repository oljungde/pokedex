let themeSwitchBtns;
let nextPokemonList = 'https://pokeapi.co/api/v2/pokemon/';
let loadedPokemon = [];
let currentPokemon = 0;
let searchInput = document.getElementById('search');
let searchedPokemon = [];
let isSearchResult = false;


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
 * function is loading on side load, function provides to change the theme, the search function and the loading of Pokemon
 */
async function init() {
    themeChange();
    loadPokemon();
    searchForm();
}


/**
 * function for theme change, with an event-listener
 */
function themeChange() {
    themeSwitchBtns = document.getElementById('checkbox');
    themeSwitchBtns.addEventListener('change', event => {
        let isChecked = event.target.checked;
        if (isChecked) {
            document.body.dataset.theme = 'light-theme';
        } else {
            document.body.dataset.theme = '';
        }
    })
}


/**
 * loading function for Pokemon, every execution is loading 20 Pokemon
 */
async function loadPokemon() {
    let response = await fetch(nextPokemonList);
    let responseAsJSON = await response.json();
    nextPokemonList = responseAsJSON.next;
    for (let i = 0; i < responseAsJSON.results.length; i++) {
        let pokemonResponse = await fetch(responseAsJSON.results[i].url);
        let pokemonAsJson = await pokemonResponse.json();
        loadedPokemon.push(pokemonAsJson);
    }
    renderAllPokemon();
}


/**
 * render the pokemon in html container with id all_pokemon
 */
function renderAllPokemon() {
    let allPokemonContainer = document.getElementById('all_pokemon');
    for (let i = currentPokemon; i < loadedPokemon.length; i++) {
        const pokemon = loadedPokemon[i];
        let pokemonType0 = pokemon['types'][0]['type']['name'];
        allPokemonContainer.innerHTML += pokemonContainerTemplate(i, pokemonType0);
        renderPokemonName(i);
        renderPokemonData(i);
        renderPokemonSecondType(i);
        currentPokemon = i + 1;
    }
}


/**
 * 
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 * @param {string} type0 is the type of pokemon, e.g. grass, is used to set background color of pokemon card
 * @returns the html code for main container for one pokemon
 */
function pokemonContainerTemplate(pokemonIndex, type0) {
    return /*html*/`
        <div id="pokemon_${pokemonIndex}" onclick="showPokemonDetails(${pokemonIndex})" class="one-pokemon ${type0}">
            
        </div>
    `;
}


/**
 * 
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 */
function renderPokemonName(pokemonIndex) {
    let pokemonContainer = document.getElementById(`pokemon_${pokemonIndex}`);
    let pokemonName = loadedPokemon[pokemonIndex]['name'];
    let pokemonFormattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    pokemonContainer.innerHTML += pokemonNameTemplate(pokemonFormattedName);
}


/**
 * 
 * @param {string} pokemonName ist the name of a pokemon, e.g bulbasaur
 * @returns the html code to render the name of a pokemon
 */
function pokemonNameTemplate(pokemonName) {
    return `
        <h2>${pokemonName}</h2>   
    `;
}


/**
 * 
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 */
function renderPokemonData(pokemonIndex) {
    let pokemonContainer = document.getElementById(`pokemon_${pokemonIndex}`);
    let pokemonImage = loadedPokemon[pokemonIndex]['sprites']['other']['official-artwork']['front_default'];
    let pokemonType0 = loadedPokemon[pokemonIndex]['types'][0]['type']['name'];
    pokemonContainer.innerHTML += pokemonDataTemplate(pokemonIndex, pokemonImage, pokemonType0);
}


/**
 * 
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 * @param {string} pokemonImage is the url to load the image from the pokemon
 * @param {string} pokemonType0 is the type of the pokemon, e.g. grass
 * @returns the html code to render the name and type of a pokemon
 */
function pokemonDataTemplate(pokemonIndex, pokemonImage, pokemonType0) {
    return `
        <div class="pokemon-content">
            <div class="image">
                <img src="${pokemonImage}">
            </div>
            <div id="pokemon_types_${pokemonIndex}" class="type-container">
                <span class="type ${pokemonType0}">${pokemonType0}</span>
            </div>                  
        </div>  
    `;
}


/**
 * 
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 */
function renderPokemonSecondType(pokemonIndex) {
    let pokemonTypeContainer = document.getElementById(`pokemon_types_${pokemonIndex}`);
    let pokemonTypes = loadedPokemon[pokemonIndex]['types'];
    if (pokemonTypes.length > 1) {
        let pokemonType1 = loadedPokemon[pokemonIndex]['types'][1]['type']['name'];
        pokemonTypeContainer.innerHTML += pokemonSecondTypeTemplate(pokemonType1);
    }
}


/**
 * 
 * @param {string} pokemonType1 is the name of the second type of a pokemon
 * @returns the html code to render the second type of a pokemon
 */
function pokemonSecondTypeTemplate(pokemonType1) {
    return `
       <span class="type ${pokemonType1}">${pokemonType1}</span> 
    `;
}


/**
* event listener to detect end of page to load more pokemon
*/
window.addEventListener('scroll', function () {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        if (!isSearchResult) {
            loadPokemon();
        }
    }
})


/**
 * event listener to detect pressing "enter" key in search form, gives a "click" to the search button
 */
function searchForm() {
    let searchInput = document.getElementById('search');
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('search_btn').click();
        }
    })
}


/**
 * checks the length of search term and if the search term is correct the search will be executed 
 */
async function getSearchTerm() {
    let search = document.getElementById('search').value;
    if (search.length == 0) {
        emtySearchTerm();
    } else if (search.length < 3) {
        toShortSearchTerm();
    } else {
        search = search.toLowerCase();
        loadSearchedPokemon(search);
    }
}


/**
 * load all pokemon if search term is emty 
 */
function emtySearchTerm() {
    let pokemonContainer = document.getElementById('all_pokemon');
    pokemonContainer.innerHTML = '';
    nextPokemonList = 'https://pokeapi.co/api/v2/pokemon/';
    loadPokemon();
    isSearchResult = false;
}


/**
 * shows a message if search term is less than 3 letters
 */
function toShortSearchTerm() {
    document.getElementById('search_message').classList.add('search-show');
    setTimeout(() => {
        document.getElementById('search_message').classList.remove('search-show');
    }, 1750);
    isSearchResult = false;
}


/**
 * 
 * @param {string} searchTerm is the term that will search in all names of pokemon
 */
async function loadSearchedPokemon(searchTerm) {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    let responseAsJson = await response.json();
    filterPokemon(responseAsJson, searchTerm);
    searchedPokemon = [];
    isSearchResult = true;
}


/**
 * 
 * @param {json array} responseAsJson is the json array with all pokemon names and url of pokemon
 * @param {string} searchTerm for pokemon names
 */
async function filterPokemon(responseAsJson, searchTerm) {
    for (let i = 0; i < responseAsJson['results'].length; i++) {
        const pokemon = responseAsJson['results'][i];
        let pokemonName = pokemon['name'];
        if (pokemonName.toLocaleLowerCase().includes(searchTerm)) {
            let pokemonResponse = await fetch(pokemon['url']);
            let pokemonAsJson = await pokemonResponse.json();
            searchedPokemon.push(pokemonAsJson);
        }
    }
    pokemonSearch();
}


/**
 * check if the length of search term bigger than 0 and render the search result
 */
function pokemonSearch() {
    let pokemonContainer = document.getElementById('all_pokemon');
    pokemonContainer.innerHTML = '';
    if (searchedPokemon.length == 0) {
        pokemonContainer.innerHTML = noPokemonFoundTemplate();
    } else {
        renderSearchedPokemon();
    }
}


/**
 * 
 * @returns the html code if no pokemon was found
 */
function noPokemonFoundTemplate() {
    return `
        <h2>Sorry! No pokemon found!</h2>
    `;
}


/**
 * render the search result
 */
function renderSearchedPokemon() {
    let pokemonContainer = document.getElementById('all_pokemon');
    for (let i = 0; i < searchedPokemon.length; i++) {
        const pokemon = searchedPokemon[i];
        let pokemonType0 = pokemon['types'][0]['type']['name'];
        pokemonContainer.innerHTML += pokemonContainerTemplate(i, pokemonType0);
        renderSearchedPokemonName(i);
        renderSearchedPokemonData(i);
        renderSearchedPokemonSecondType(i);
    }
}


/**
 * 
 * @param {number} pokemonIndex is the index of the pokemon from array "searchedPokemon"
 * render the names of found pokemon
 */
function renderSearchedPokemonName(pokemonIndex) {
    let pokemonContainer = document.getElementById(`pokemon_${pokemonIndex}`);
    let pokemonName = searchedPokemon[pokemonIndex]['name'];
    let pokemonFormattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    pokemonContainer.innerHTML += pokemonNameTemplate(pokemonFormattedName);
}


/**
 * 
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 * render the image and type of found pokemon
 */
function renderSearchedPokemonData(pokemonIndex) {
    let pokemonContainer = document.getElementById(`pokemon_${pokemonIndex}`);
    let pokemonImage = searchedPokemon[pokemonIndex]['sprites']['other']['official-artwork']['front_default'];
    let pokemonType0 = searchedPokemon[pokemonIndex]['types'][0]['type']['name'];
    pokemonContainer.innerHTML += pokemonDataTemplate(pokemonIndex, pokemonImage, pokemonType0);
}


/**
 * 
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 * render the second type of the pokemon
 */
function renderSearchedPokemonSecondType(pokemonIndex) {
    let pokemonTypeContainer = document.getElementById(`pokemon_types_${pokemonIndex}`);
    let pokemonTypes = searchedPokemon[pokemonIndex]['types'];
    if (pokemonTypes.length > 1) {
        let pokemonType1 = searchedPokemon[pokemonIndex]['types'][1]['type']['name'];
        pokemonTypeContainer.innerHTML += pokemonSecondTypeTemplate(pokemonType1);
    }
}


/**
 * 
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 * function to show the pokemon card details
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
}


function pokemonDetailsTemplate(pokemonType0) {
    return /*html*/`
        <div id="pokemon_details" class="${pokemonType0}">
            <div id="pokemon_details_top">

            </div>

            <div id="pokemon_details_bottom">
                <div class="details-switch">
                    <span style="border-bottom: 5px solid ${pokemonOverlayBorder[0][pokemonType0]}">
                        <h3>Stats</h3>
                    </span>
                    <span>
                        <h3>Moves</h3>
                    </span>              
                </div>
            </div>

        </div>
    `;
}


function renderPokemonDetailsName(pokemonIndex) {
    let pokemonDetailsTopContainer = document.getElementById('pokemon_details_top');
    let pokemonName = loadedPokemon[pokemonIndex]['name'];
    let pokemonFormattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    pokemonDetailsTopContainer.innerHTML += pokemonNameTemplate(pokemonFormattedName);
}


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


function pokemonDetailsDataTwoTypesTemplate(pokemonType0, pokemonType1) {
    return /*html*/`
        <div class="type-container-overlay">
            <span class="type ${pokemonType0}">${pokemonType0}</span>
            <span class="type ${pokemonType1}">${pokemonType1}</span> 
        </div>
    `;
}


function pokemonDetailsDataOneTypeTemplate(pokemonType0) {
    return /*html*/`
        <div class="type-container-overlay">
            <span class="type ${pokemonType0}">${pokemonType0}</span>
        </div>
    `;
}


function renderPokemonDetailsBody(pokemonIndex) {
    let pokemonDetailsTopContainer = document.getElementById('pokemon_details_top');
    let pokemonHeight = loadedPokemon[pokemonIndex]['height'];
    let pokemonSize = (+pokemonHeight / 10).toLocaleString();
    let pokemonWeight = loadedPokemon[pokemonIndex]['weight'];
    let pokemonKg = (+pokemonWeight / 10).toLocaleString();
    pokemonDetailsTopContainer.innerHTML += pokemonDetailsBodyTemplate(pokemonSize, pokemonKg);
}


function pokemonDetailsBodyTemplate(pokemonSize, pokemonKg) {
    return /*html*/`
        <div class="weight-container-overlay">
            <span><b>size:</b><br>${pokemonSize}m</span>
            <span><b>weight:</b><br>${pokemonKg}kg</span>
        </div> 
    `;
}


function renderPokemonDetailsImage(pokemonIndex, pokemonType0) {
    let pokemonDetailsContainer = document.getElementById('pokemon_details');
    let pokemonImage = loadedPokemon[pokemonIndex]['sprites']['other']['official-artwork']['front_default'];
    pokemonDetailsContainer.innerHTML += pokemonDetailsImageTemplate(pokemonImage, pokemonType0);
}


function pokemonDetailsImageTemplate(pokemonImage, pokemonType0) {
    return /*html*/`
        <div class="circle" style="border: 6px solid ${pokemonOverlayBorder[0][pokemonType0]}">
            <img src="${pokemonImage}" alt="">
        </div>
    `;
}


function renderPokemonDetailsAbilitiesContainer() {
    let pokemonDetailsBottomContainer = document.getElementById('pokemon_details_bottom');
    pokemonDetailsBottomContainer.innerHTML += pokemonDetailsAbilitiesContainerTemplate();
}


function pokemonDetailsAbilitiesContainerTemplate() {
    return /*html*/`
        <div id="pokemon_abilities">
            <h3>Abilities:</h3>
        </div>
    `;
}


function renderPokemonDetailsAbilities(pokemonIndex) {
    renderPokemonDetailsAbilitiesContainer();
    let pokemonDetailsAbilitiesContainer = document.getElementById('pokemon_abilities');
    let pokemonAbilities = loadedPokemon[pokemonIndex]['abilities'];
    for (let i = 0; i < pokemonAbilities.length; i++) {
        const pokemonAbility = pokemonAbilities[i];
        pokemonDetailsAbilitiesContainer.innerHTML += pokemonDetailsAbilityTemplate(pokemonAbility);
    }
}


function pokemonDetailsAbilityTemplate(pokemonAbility) {
    return /*html*/`
            <span>${pokemonAbility['ability']['name']}</span><br>
    `;
}


function renderPokemonDetailsStatsContainer() {
    let pokemonDetailsBottomContainer = document.getElementById('pokemon_details_bottom');
    pokemonDetailsBottomContainer.innerHTML += pokemonDetailsStatsContainerTemplate();
}


function pokemonDetailsStatsContainerTemplate() {
    return /*html*/`
        <div id="pokemon_stats" class="pokemon-abilities">
            <h3>Stats:</h3>
        </div>
        <div id="chain">
                
        </div>
    `;
}


function getPokemonStats(pokemonIndex) {
    let pokemon = loadedPokemon[pokemonIndex];
    statsChartData['datasets'][0]['data'] = [];
    for (let i = 0; i < pokemon['stats'].length; i++) {
        const pokemonStat = pokemon['stats'][i]['base_stat'];
        statsChartData['datasets'][0]['data'].push(pokemonStat);
    }
}


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





function pokemonDetailsStatTemplate() {
    return /*html*/`
        <div>
            <canvas id="stats_chart"></canvas>
        </div>
    `;
}


function renderPokemonDetailsEvolutionChainContainer() {
    let pokemonDetailsBottomContainer = document.getElementById('chain');
    pokemonDetailsBottomContainer.innerHTML += pokemonDetailsEvolutionChainContainerTemplate();
}


function pokemonDetailsEvolutionChainContainerTemplate() {
    return /*html*/`
        <div id="pokemon_evolution">
            <h3>Evolution-Chain</h3>
            <div id="evolution_steps">
            
            </div>
        </div>   
    `;
}


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


function pokemonDetailsNoEvolutionChainTemplate() {
    return /*html*/`
        <span>Sorry, there is no evolution chain.</span>
    `;
}


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


function evolutionStepTemplate(evolutionStepName, evolutionStepImage) {
    return /*html*/ `
        <div class="evolution-step">
            <img src="${evolutionStepImage}" alt="" class="evo-image">
            ${evolutionStepName}
        </div>
    `;
}