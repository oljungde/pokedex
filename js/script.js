let pokemonList = [];
let allPokemon = [];


async function getPokemonList() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    let response = await fetch(url);
    pokemonList = await response.json();
    getAllPokemon()
}


async function getAllPokemon() {
    for (let i = 0; i < pokemonList['results'].length; i++) {
        const onePokemon = pokemonList['results'][i];
        let onePokemonUrl = onePokemon['url'];
        let response = await fetch(onePokemonUrl);
        let responseAsJson = await response.json();
        allPokemon.push(responseAsJson);
    }
    renderPokemon();
}


function renderPokemon() {
    let pokemonContainer = document.getElementById('all_pokemon');
    for (let i = 0; i < allPokemon.length; i++) {
        const pokemon = allPokemon[i];
        let pokemonName = pokemon['name'];
        let pokemonId = pokemon['id'];
        let pokemonImage = pokemon['sprites']['other']['official-artwork']['front_default'];
        pokemonContainer.innerHTML += /*html*/`
            <div>
                <h2>${pokemonName} #${pokemonId}</h2>
                <img src="${pokemonImage}" alt="">
            </div>
        `;
    }
}