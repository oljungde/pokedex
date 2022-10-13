let allPokemon = [];


async function getAllPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/';
    let response = await fetch(url);
    allPokemon = await response.json();
}