/**
 * @param {string} pokemonType0 is the name of the main taype of the pokemon. It's needed for selection of background color
 * @returns the html code for pokemon card in the detail overlay view 
 */
function pokemonDetailsTemplate(pokemonType0) {
    return /*html*/`
        <div id="pokemon_details" onclick="propagation(event)" class="${pokemonType0}">
            <button onclick="hidePokemonDetails()" class="close-btn"><img src="./img/close.png" alt="Close Button"></button>
            <div id="pokemon_details_top">

            </div>

            <div id="pokemon_details_bottom">
                <div class="details-switch">
                    <span style="border-bottom: 5px solid ${pokemonOverlayBorder[0][pokemonType0]}">
                        <h3>Stats</h3>
                    </span>
                    <span onclick="switchToMoves()">
                        <h3>Moves</h3>
                    </span>          
                </div>        
            </div>

            <div id="pokemon_details_moves" class="display-none">
                <div class="details-switch">
                    <span onclick="switchToStats()">
                        <h3>Stats</h3>
                    </span>
                    <span style="border-bottom: 5px solid ${pokemonOverlayBorder[0][pokemonType0]}">
                        <h3>Moves</h3>
                    </span>          
                </div>        
            </div>
        </div>
    `;
}


/**
 * @param {string} pokemonType0 is the name of main type of pokemon
 * @param {*} pokemonType1 is the name of the addinional pokemon type
 * @returns the html code for redering two pokemon types
 */
function pokemonDetailsDataTwoTypesTemplate(pokemonType0, pokemonType1) {
    return /*html*/`
        <div class="type-container-overlay">
            <span class="type ${pokemonType0}">${pokemonType0}</span>
            <span class="type ${pokemonType1}">${pokemonType1}</span> 
        </div>
    `;
}


/**
 * @param {string} pokemonType0 is the name of main pokemon type
 * @returns the html code to render the pokemon type if is just one type
 */
function pokemonDetailsDataOneTypeTemplate(pokemonType0) {
    return /*html*/`
        <div class="type-container-overlay">
            <span class="type ${pokemonType0}">${pokemonType0}</span>
        </div>
    `;
}


/**
 * 
 * @param {number} pokemonSize is the height of the pokemon
 * @param {number}  pokemonKg is the weight of pokemon
 * @returns the html code to render height and weight of the pokemon
 */
function pokemonDetailsBodyTemplate(pokemonSize, pokemonKg) {
    return /*html*/`
        <div class="weight-container-overlay">
            <span><b>size:</b><br>${pokemonSize}m</span>
            <span><b>weight:</b><br>${pokemonKg}kg</span>
        </div> 
    `;
}


/**
 * @param {string} pokemonImage url as string for the pokemon image
 * @param {string} pokemonType0 name of pokemon main type
 * @returns the html code to render the image of the pokemon with a colored border 
 */
function pokemonDetailsImageTemplate(pokemonImage, pokemonType0) {
    return /*html*/`
        <div class="circle" style="border: 6px solid ${pokemonOverlayBorder[0][pokemonType0]}">
            <img src="${pokemonImage}" alt="">
        </div>
    `;
}


/**
 * @returns the html code to render the abilities vontainer
 */
function pokemonDetailsAbilitiesContainerTemplate() {
    return /*html*/`
        <div id="pokemon_abilities">
            <h3>Abilities:</h3>
        </div>
    `;
}


/**
 * @param {string} pokemonAbility is the name of a pokemon ability
 * @returns the html code to render the ability
 */
function pokemonDetailsAbilityTemplate(pokemonAbility) {
    return /*html*/`
            <span>${pokemonAbility['ability']['name']}</span><br>
    `;
}


/**
 * @returns the html code to render the stats and evolution chain containers 
 */
function pokemonDetailsStatsContainerTemplate() {
    return /*html*/`
        <div id="pokemon_stats" class="pokemon-abilities">
            <h3>Stats:</h3>
        </div>
        <div id="chain">
                
        </div>
    `;
}


/**
 * @returns the html code to render the pokemon stats chart using chart.js libary
 */
function pokemonDetailsStatTemplate() {
    return /*html*/`
        <div>
            <canvas id="stats_chart"></canvas>
        </div>
    `;
}


/**
 * @returns the html code evolution chain container
 */
function pokemonDetailsEvolutionChainContainerTemplate() {
    return /*html*/`
        <div id="pokemon_evolution">
            <h3>Evolution-Chain</h3>
            <div id="evolution_steps">
            
            </div>
        </div>   
    `;
}


/**
 * @returns the html code if there is no evolution chain
 */
function pokemonDetailsNoEvolutionChainTemplate() {
    return /*html*/`
        <span>Sorry, there is no evolution chain.</span>
    `;
}


/**
 * 
 * @param {string} evolutionStepName ist the name of an evelution step
 * @param {string} evolutionStepImage is the url of the image of pokemon from the evolution step
 * @returns the html code to render an evolution step
 */
function evolutionStepTemplate(evolutionStepName, evolutionStepImage) {
    return /*html*/ `
        <div class="evolution-step">
            <img src="${evolutionStepImage}" alt="" class="evo-image">
            ${evolutionStepName}
        </div>
    `;
}


/**
 * @returns the html code for the moves container
 */
function pokemonMovesContainerTemplate() {
    return /*html*/`
        <div id="pokemon_moves" class="pokemon-abilities">
            <h3>Moves:</h3><br>
        </div>
    `;
}


/**
 * @param {string} pokemonMove is name of a single move
 * @returns the html code to render a pokemon move
 */
function pokemonMoveTemplate(pokemonMove) {
    return /*html*/`
        <div class="pokemon-move">${pokemonMove}</div> 
    `;
}