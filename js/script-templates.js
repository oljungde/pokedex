function themeCheckLightThemeTemplate() {
    return /*html*/ `
        <input type="checkbox" class="checkbox" id="checkbox" checked>
        <label for="checkbox" class="label">
            <img src="./img/moon.png" alt="">
            <img src="./img/sun.png" alt="">
            <div class="ball">
        </label>
    `;
}


function themeCheckDarkThemeTemplate() {
    return  /*html*/ `
        <input type="checkbox" class="checkbox" id="checkbox">
        <label for="checkbox" class="label">
            <img src="./img/moon.png" alt="">
            <img src="./img/sun.png" alt="">
            <div class="ball">
        </label>
    `;
}


/**
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
 * @param {string} pokemonName ist the name of a pokemon, e.g bulbasaur
 * @returns the html code to render the name of a pokemon
 */
function pokemonNameTemplate(pokemonName) {
    return /*html*/`
        <h2>${pokemonName}</h2>   
    `;
}


/**
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 * @param {string} pokemonType0 is the type of the pokemon, e.g. grass
 * @returns the html code to render the name and type of a pokemon
 */
function pokemonDataTemplate(pokemonIndex, pokemonType0) {
    return /*html*/`
        <div class="pokemon-content">
            <div id="pokemon_image_${pokemonIndex}" class="image">
                
            </div>
            <div id="pokemon_types_${pokemonIndex}" class="type-container">
                <span class="type ${pokemonType0}">${pokemonType0}</span>
            </div>                  
        </div>  
    `;
}


/**
 * @param {string} pokemonType1 is the name of the second type of a pokemon
 * @returns the html code to render the second type of a pokemon
 */
function pokemonSecondTypeTemplate(pokemonType1) {
    return /*html*/`
       <span class="type ${pokemonType1}">${pokemonType1}</span> 
    `;
}


/**
 * 
 * @param {string} pokemonImage ist the url of pokemon image
 * @returns the html code to render the pokemon image
 */
function pokemonImageTemplate(pokemonImage) {
    return /*html*/`
        <img src="${pokemonImage}">
    `;
}


/**
 * @returns the html code if no pokemon was found
 */
function noPokemonFoundTemplate() {
    return /*html*/`
        <h2>Sorry! No pokemon found!</h2>
    `;
}