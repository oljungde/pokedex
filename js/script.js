let themeSwitchBtns;
let nextPokemonList = 'https://pokeapi.co/api/v2/pokemon/';
let loadedPokemon = [];
let currentPokemon = 0;
let searchInput = document.getElementById('search');
let searchedPokemon = [];
let isSearchResult = false;


async function init() {
    themeChange();
    loadPokemon();
    searchForm();
}


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


function pokemonContainerTemplate(pokemonIndex, type0) {
    return /*html*/`
             <div id="pokemon_${pokemonIndex}" class="one-pokemon ${type0}">
                 
             </div>
    `;
}


function renderPokemonName(pokemonIndex) {
    let pokemonContainer = document.getElementById(`pokemon_${pokemonIndex}`);
    let pokemonName = loadedPokemon[pokemonIndex]['name'];
    let pokemonFormattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    pokemonContainer.innerHTML += pokemonNameTemplate(pokemonFormattedName);
}


function pokemonNameTemplate(pokemonName) {
    return `
        <h2>${pokemonName}</h2>   
    `;
}


function renderPokemonData(pokemonIndex) {
    let pokemonContainer = document.getElementById(`pokemon_${pokemonIndex}`);
    let pokemonImage = loadedPokemon[pokemonIndex]['sprites']['other']['official-artwork']['front_default'];
    let pokemonType0 = loadedPokemon[pokemonIndex]['types'][0]['type']['name'];
    pokemonContainer.innerHTML += pokemonDataTemplate(pokemonIndex, pokemonImage, pokemonType0);
}


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


function renderPokemonSecondType(pokemonIndex) {
    let pokemonTypeContainer = document.getElementById(`pokemon_types_${pokemonIndex}`);
    let pokemonTypes = loadedPokemon[pokemonIndex]['types'];
    if (pokemonTypes.length > 1) {
        let pokemonType1 = loadedPokemon[pokemonIndex]['types'][1]['type']['name'];
        pokemonTypeContainer.innerHTML += pokemonSecondTypeTemplate(pokemonType1);
    }
}


function pokemonSecondTypeTemplate(pokemonType1) {
    return `
       <span class="type ${pokemonType1}">${pokemonType1}</span> 
    `;
}


window.addEventListener('scroll', function () {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        if (!isSearchResult) {
            loadPokemon();
        }
    }
})


function searchForm() {
    let searchInput = document.getElementById('search');
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('search_btn').click();
        }
    })
}


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


function emtySearchTerm() {
    let pokemonContainer = document.getElementById('all_pokemon');
    pokemonContainer.innerHTML = '';
    nextPokemonList = 'https://pokeapi.co/api/v2/pokemon/';
    loadPokemon();
    isSearchResult = false;
}


function toShortSearchTerm() {
    document.getElementById('search_message').classList.add('search-show');
    setTimeout(() => {
        document.getElementById('search_message').classList.remove('search-show');
    }, 1750);
    isSearchResult = false;
}


async function loadSearchedPokemon(searchTerm) {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    let responseAsJson = await response.json();
    test(responseAsJson, searchTerm);
    searchedPokemon = [];
    isSearchResult = true;
}


async function test(responseAsJson, searchTerm) {
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


function pokemonSearch() {
    let pokemonContainer = document.getElementById('all_pokemon');
    pokemonContainer.innerHTML = '';
    if (searchedPokemon.length == 0) {
        pokemonContainer.innerHTML = noPokemonFoundTemplate();
    } else {
        renderSearchedPokemon();
    }
}


function noPokemonFoundTemplate() {
    return `
        <h2>Sorry! No pokemon found!</h2>
    `;
}


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


function renderSearchedPokemonName(pokemonIndex) {
    let pokemonContainer = document.getElementById(`pokemon_${pokemonIndex}`);
    let pokemonName = searchedPokemon[pokemonIndex]['name'];
    let pokemonFormattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    pokemonContainer.innerHTML += pokemonNameTemplate(pokemonFormattedName);
}


function renderSearchedPokemonData(pokemonIndex) {
    let pokemonContainer = document.getElementById(`pokemon_${pokemonIndex}`);
    let pokemonImage = searchedPokemon[pokemonIndex]['sprites']['other']['official-artwork']['front_default'];
    let pokemonType0 = searchedPokemon[pokemonIndex]['types'][0]['type']['name'];
    pokemonContainer.innerHTML += pokemonDataTemplate(pokemonIndex, pokemonImage, pokemonType0);
}


function renderSearchedPokemonSecondType(pokemonIndex) {
    let pokemonTypeContainer = document.getElementById(`pokemon_types_${pokemonIndex}`);
    let pokemonTypes = searchedPokemon[pokemonIndex]['types'];
    if (pokemonTypes.length > 1) {
        let pokemonType1 = searchedPokemon[pokemonIndex]['types'][1]['type']['name'];
        pokemonTypeContainer.innerHTML += pokemonSecondTypeTemplate(pokemonType1);
    }
}