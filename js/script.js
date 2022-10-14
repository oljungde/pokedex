let nextPokemonList = 'https://pokeapi.co/api/v2/pokemon/';
let loadedPokemons = [];
let currentPokemon = 0;


async function loadPokemon() {
    let response = await fetch(nextPokemonList);
    let responseAsJSON = await response.json();
    nextPokemonList = responseAsJSON.next;
    for (let i = 0; i < responseAsJSON.results.length; i++) {
        let pokemonResponse = await fetch(responseAsJSON.results[i].url);
        let pokemonAJSON = await pokemonResponse.json();
        loadedPokemons.push(pokemonAJSON);
    }
    renderAllPokemon();
}


function renderAllPokemon() {
    let pokemonContainer = document.getElementById('all_pokemon');
    for (let i = currentPokemon; i < loadedPokemons.length; i++) {
        const pokemon = loadedPokemons[i];
        let pokemonName = pokemon['name'];
        let pokemonFormattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
        let pokemonImage = pokemon['sprites']['other']['official-artwork']['front_default'];
        let pokemonId = i + 1;
        let pokemonType0 = pokemon['types'][0]['type']['name'];
        pokemonContainer.innerHTML += /*html*/`
             <div class="one-pokemon ${pokemonType0}">
                 <h2>${pokemonFormattedName} #${pokemonId}</h2>
                 <div class="image">
                    <img src="${pokemonImage}" alt="">
                 </div>
                 ${pokemonType0}
             </div>
        `;
        currentPokemon = i + 1;
    }
}


window.addEventListener('scroll', function () {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        loadPokemon();
    }
})