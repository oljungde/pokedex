let themeSwitchBtns;
let nextPokemonList = 'https://pokeapi.co/api/v2/pokemon/';
let loadedPokemons = [];
let currentPokemon = 0;
let searchedPokemon = [];


async function init() {
    themeChange();
    loadPokemon();
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
        loadedPokemons.push(pokemonAsJson);
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


async function getSearchTerm() {
    let search = document.getElementById('search').value;
    if (search.length >= 3) {
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

}


// function filterPosts(searchTerm) {
//     let pokemonContainer = document.getElementById('all_pokemon');
//     pokemonContainer.innerHTML = '';
//     for (let i = 0; i < posts.length; i++) {
//         let postAuthor = posts[i].author;
//         let postLocation = posts[i].postLocation;
//         let postText = `${posts[i].postTextTeaser} ${posts[i].postTextMore}`;
//         if (postAuthor.toLocaleLowerCase().includes(searchTerm) || postText.toLocaleLowerCase().includes(searchTerm) || postLocation.toLocaleLowerCase().includes(searchTerm)) {
//             postsContainer.innerHTML += templatePost(i);
//             renderPost(i);
//             renderModalWithoutFunction(i);
//         }
//     }
// }