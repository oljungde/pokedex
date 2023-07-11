let themeSwitchBtns;
let nextPokemonList = 'https://pokeapi.co/api/v2/pokemon/';
let numberOfAllPokemon;
let loadedPokemon = [];
let currentPokemon = 0;
let searchInput = document.getElementById('search');
let searchedPokemon = [];
let isSearchResult = false;


/**
 * function is loading on side load, function provides to change the theme, the search function and the loading of Pokemon
 */
async function init() {
    themeChange();
    loadPokemon();
    searchForm();
}


/**
 * check the local storage for theme setting and render the theme change input checked or not checked
 */
function themeCheck() {
    let themeChangeBtn = document.getElementById('theme_change');
    let theme = localStorage.getItem('data-theme');
    if (theme == 'light-theme') {
        document.body.dataset.theme = 'light-theme';
        themeChangeBtn.innerHTML = themeCheckLightThemeTemplate();
    } else {
        themeChangeBtn.innerHTML = themeCheckDarkThemeTemplate();
    }
}


/**
 * function for theme change, with an event-listener
 */
function themeChange() {
    themeCheck();
    themeSwitchBtns = document.getElementById('checkbox');
    themeSwitchBtns.addEventListener('change', event => {
        let isChecked = event.target.checked;
        if (isChecked) {
            document.body.dataset.theme = 'light-theme';
            localStorage.setItem('data-theme', 'light-theme');
        } else {
            document.body.dataset.theme = '';
            localStorage.setItem('data-theme', '');
        }
    })
}


/**
 * loading function for Pokemon, every execution is loading 20 Pokemon
 */
async function loadPokemon() {
    loading();
    if (loadedPokemon.length != numberOfAllPokemon) {
        let response = await fetch(nextPokemonList);
        let responseAsJSON = await response.json();
        numberOfAllPokemon = responseAsJSON.count
        nextPokemonList = responseAsJSON.next;
        for (let i = 0; i < responseAsJSON.results.length; i++) {
            let pokemonResponse = await fetch(responseAsJSON.results[i].url);
            let pokemonAsJson = await pokemonResponse.json();
            loadedPokemon.push(pokemonAsJson);
        }
        renderAllPokemon();
    }
    loadingDone();
}


/**
 * loading animation, when the function is called the loading animation is visible
 */
function loading() {
    let htmlBody = document.body;
    htmlBody.style.overflowY = 'hidden';
    document.getElementById('loading').classList.remove('display-none');
}


/**
 * loading animation, when the function is called the loading animation is not visible
 */
function loadingDone() {
    let htmlBody = document.body;
    htmlBody.style.overflowY = 'scroll';
    document.getElementById('loading').classList.add('display-none');
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
        renderPokemonFirstType(i);
        renderPokemonSecondType(i);
        renderPokemonImage(i);
        currentPokemon = i + 1;
    }
}


/**
 * render the name of pokemon on main card
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 */
function renderPokemonName(pokemonIndex) {
    let pokemonContainer = document.getElementById(`pokemon_${pokemonIndex}`);
    let pokemonName = loadedPokemon[pokemonIndex]['name'];
    let pokemonFormattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    pokemonContainer.innerHTML += pokemonNameTemplate(pokemonFormattedName);
}


/**
 * render the main type (pokemonType0) of the pokemon
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 */
function renderPokemonFirstType(pokemonIndex) {
    let pokemonContainer = document.getElementById(`pokemon_${pokemonIndex}`);
    let pokemonType0 = loadedPokemon[pokemonIndex]['types'][0]['type']['name'];
    pokemonContainer.innerHTML += pokemonDataTemplate(pokemonIndex, pokemonType0);
}


/**
 * render the optinal seceond type (pokemonType1) of a pokemon
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
 * render the image of pokemon
 * @param {number} pokemonIndex is the index of pokemon in the array loaded pokemon
 */
function renderPokemonImage(pokemonIndex) {
    let pokemonImageContainer = document.getElementById(`pokemon_image_${pokemonIndex}`)
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
    pokemonImageContainer.innerHTML += pokemonImageTemplate(pokemonImage);
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
    search = search.toLowerCase();
    loadSearchedPokemon(search);
}


/**
 * load all pokemon an call the function to filter the pokemon
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
 * filter the searched pokemon and push the results to the array searchedPokemon
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
        loadedPokemon = searchedPokemon;
        currentPokemon = 0;
        renderAllPokemon();
    }
}