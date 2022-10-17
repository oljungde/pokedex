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
    let pokemonContainer = document.getElementById('all_pokemon');
    for (let i = currentPokemon; i < loadedPokemon.length; i++) {
        const pokemon = loadedPokemon[i];
        let pokemonName = pokemon['name'];
        let pokemonFormattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
        let pokemonImage = pokemon['sprites']['other']['official-artwork']['front_default'];
        let pokemonId = pokemon['id'];
        let pokemonType0 = pokemon['types'][0]['type']['name'];
        pokemonContainer.innerHTML += pokemonTemplate(pokemonFormattedName, pokemonImage, pokemonId, pokemonType0);
        currentPokemon = i + 1;
    }
}


function pokemonTemplate(name, img, id, type0) {
    return /*html*/`
             <div class="one-pokemon ${type0}">
                 <h2>${name} #${id}</h2>
                 <div class="image">
                    <img src="${img}" alt="">
                 </div>
                 ${type0}
             </div>
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
        let pokemonContainer = document.getElementById('all_pokemon');
        pokemonContainer.innerHTML = '';
        nextPokemonList = 'https://pokeapi.co/api/v2/pokemon/';
        loadPokemon();
        isSearchResult = false;
    } else if (search.length < 3) {
        console.log('wenig')
        document.getElementById('search_message').classList.add('search-show');
        setTimeout(() => {
            document.getElementById('search_message').classList.remove('search-show');
        }, 1750);
        isSearchResult = false;
    } else {
        console.log(search);
        search = search.toLowerCase();
        loadSearchedPokemon(search);
    }
}


async function loadSearchedPokemon(searchTerm) {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    console.log(response);
    let responseAsJson = await response.json();
    console.log(responseAsJson);
    for (let i = 0; i < responseAsJson['results'].length; i++) {
        const pokemon = responseAsJson['results'][i];
        let pokemonName = pokemon['name'];
        if (pokemonName.toLocaleLowerCase().includes(searchTerm)) {
            let pokemonResponse = await fetch(pokemon['url']);
            let pokemonAsJson = await pokemonResponse.json();
            searchedPokemon.push(pokemonAsJson);
            console.log(searchedPokemon);
        }

    }
    renderSearchedPokemon();
    searchedPokemon = [];
    isSearchResult = true;
    console.log(searchedPokemon);
}


function renderSearchedPokemon() {
    let pokemonContainer = document.getElementById('all_pokemon');
    pokemonContainer.innerHTML = '';
    if (searchedPokemon.length == 0) {
        pokemonContainer.innerHTML = '<h2>Sorry! No pokemon found!</h2>';
    } else {
        for (let i = 0; i < searchedPokemon.length; i++) {
            const pokemon = searchedPokemon[i];
            let pokemonName = pokemon['name'];
            let pokemonFormattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
            let pokemonImage = pokemon['sprites']['other']['official-artwork']['front_default'];
            let pokemonId = pokemon['id'];
            let pokemonType0 = pokemon['types'][0]['type']['name'];
            pokemonContainer.innerHTML += pokemonTemplate(pokemonFormattedName, pokemonImage, pokemonId, pokemonType0);
        }
    }
}