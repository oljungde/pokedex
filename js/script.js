let nextPokemonList = 'https://pokeapi.co/api/v2/pokemon/';
let loadedPokemons = [];

async function loadPokemon() {
    let response = await fetch(nextPokemonList);
    let responseAsJSON = await response.json();
    nextPokemonList = responseAsJSON.next;
    console.log(nextPokemonList);
    for (let i = 0; i < responseAsJSON.results.length; i++) {
        let pokemonResponse = await fetch(responseAsJSON.results[i].url);
        let pokemonAJSON = await pokemonResponse.json();
        loadedPokemons.push(pokemonAJSON);
    }
    renderAllPokemon();
}


function renderAllPokemon() {
    let pokemonContainer = document.getElementById('all_pokemon');
    for (let i = 0; i < loadedPokemons.length; i++) {
        const pokemon = loadedPokemons[i];
        let pokemonName = pokemon['name'];
        let pokemonImage = pokemon['sprites']['other']['official-artwork']['front_default'];
        let pokemonType0 = pokemon['types'][0]['type']['name'];
        pokemonContainer.innerHTML += /*html*/`
             <div class="one-pokemon ${pokemonType0}">
                 <h2>${pokemonName}</h2>
                 <div class="image">
                    <img src="${pokemonImage}" alt="">
                 </div>
                 
             </div>
        `;

    }
}


window.addEventListener('scroll', function () {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        renderAllPokemon();
    }
})