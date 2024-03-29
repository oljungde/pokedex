/**
 * array for border colors in the overlay, one color for each pokemon type
 */
let pokemonOverlayBorder = [
  {
    normal: '#474734',
    fire: '#8a4a21',
    water: '#455a8c',
    grass: '#39632b',
    electric: '#917A1F',
    ice: '#567575',
    fighting: '#661A16',
    poison: '#8C378B',
    ground: '#7D6C3E',
    flying: '#62558A',
    psychic: '#943B56',
    bug: '#505710',
    rock: '#594E1D',
    ghost: '#281F36',
    dark: '#0F0C0A',
    dragon: '#452491',
    steel: '#63636E',
    fairy: '#99518D',
  }
];
let indexOfPokemon;
let loadingInProgress = false;


/**
 * function to show the pokemon card details
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 */
function showPokemonDetails(pokemonIndex) {
  let htmlBody = document.body;
  htmlBody.style.overflowY = 'hidden';
  let contentContainer = document.getElementById('content');
  contentContainer.classList.add('content-overlay');
  let pokemonOverlay = document.getElementById('pokemon_overlay');
  pokemonOverlay.classList.remove('display-none');
  renderPokemonDetails(pokemonIndex);
}


/**
 * card won't close on click
 * @param {*} event click event on pokemon card in the over
 */
function propagation(event) {
  event.stopPropagation();
}


/**
 * function to close the pokemon details overlay
 */
function hidePokemonDetails() {
  let htmlBody = document.body;
  htmlBody.style.overflowY = 'scroll';
  let contentContainer = document.getElementById('content');
  contentContainer.classList.remove('content-overlay');
  let pokemonOverlay = document.getElementById('pokemon_overlay');
  pokemonOverlay.classList.add('display-none');
}


/**
 * renders the pokemon card in the overlay
 * @param {number} pokemonIndex of the array loadedPokemon, 
 */
async function renderPokemonDetails(pokemonIndex) {
  indexOfPokemon = pokemonIndex;
  let pokemonOverlay = document.getElementById('pokemon_overlay');
  let pokemonType0 = loadedPokemon[pokemonIndex]['types'][0]['type']['name'];
  pokemonOverlay.innerHTML = pokemonDetailsTemplate(pokemonType0);
  renderPokemonDetailsName(pokemonIndex);
  renderPokemonDetailsData(pokemonIndex);
  renderPokemonDetailsBody(pokemonIndex);
  renderPokemonDetailsNavigation(pokemonIndex);
  renderPokemonDetailsImage(pokemonIndex, pokemonType0);
  renderPokemonDetailsAbilities(pokemonIndex);
  renderPokemonDetailsStats(pokemonIndex);
  await getPokemonEvolutionChain(pokemonIndex);
  renderPokemonMoves(pokemonIndex);
}


/**
 * renders the name of pokemon in the overlay card 
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
function renderPokemonDetailsName(pokemonIndex) {
  let pokemonDetailsTopContainer = document.getElementById('pokemon_details_top');
  let pokemonName = loadedPokemon[pokemonIndex]['name'];
  let pokemonFormattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  pokemonDetailsTopContainer.innerHTML += pokemonNameTemplate(pokemonFormattedName);
}


/**
 * check if pokemon as one or two types and render the type(s)
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
function renderPokemonDetailsData(pokemonIndex) {
  let pokemonDetailsTopContainer = document.getElementById('pokemon_details_top');
  let pokemonTypes = loadedPokemon[pokemonIndex]['types'];
  let pokemonType0 = pokemonTypes[0]['type']['name'];
  if (pokemonTypes.length > 1) {
    let pokemonType1 = pokemonTypes[1]['type']['name'];
    pokemonDetailsTopContainer.innerHTML += pokemonDetailsDataTwoTypesTemplate(pokemonType0, pokemonType1);
  } else {
    pokemonDetailsTopContainer.innerHTML += pokemonDetailsDataOneTypeTemplate(pokemonType0);
  }
}


/**
 * renders the poke height and wheigt
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
function renderPokemonDetailsBody(pokemonIndex) {
  let pokemonDetailsTopContainer = document.getElementById('pokemon_details_top');
  let pokemonHeight = loadedPokemon[pokemonIndex]['height'];
  let pokemonSize = (+pokemonHeight / 10).toLocaleString();
  let pokemonWeight = loadedPokemon[pokemonIndex]['weight'];
  let pokemonKg = (+pokemonWeight / 10).toLocaleString();
  pokemonDetailsTopContainer.innerHTML += pokemonDetailsBodyTemplate(pokemonSize, pokemonKg);
}


/**
 * renders the navigation arrows in pokemon details card
 * @param {number} pokemonIndex of Array loadedPokemon
 */
function renderPokemonDetailsNavigation(pokemonIndex) {
  let pokemonDetailsTopContainer = document.getElementById('pokemon_details_top');
  pokemonDetailsTopContainer.innerHTML += pokemonDetailsNavigationTemplate(pokemonIndex);
  pokemonDetailsNavigationBlendOff(pokemonIndex);
}


/**
 * blend off the forward button if it is the last pokemon, and blend off the bachward button if it is the first pokemon
 * @param {number} pokemonIndex of array loadedPokemon
 */
function pokemonDetailsNavigationBlendOff(pokemonIndex) {
  if (pokemonIndex == 0) {
    let pokemonDetailsNavigation = document.getElementById('navigation_overlay');
    let backwardButton = document.getElementById('backward');
    backwardButton.classList.add('display-none');
    pokemonDetailsNavigation.classList.add('justify-end');
  }
  if (pokemonIndex == numberOfAllPokemon - 1) {
    let pokemonDetailsNavigation = document.getElementById('navigation_overlay');
    let forwardButton = document.getElementById('forward');
    forwardButton.classList.add('display-none');
    pokemonDetailsNavigation.classList.add('justify-start');
  }
}


/**
 * add event listener to detect the input of the navigation keys left and right arrow
 */
window.addEventListener('keydown', (event) => {
  if (event.key == 'ArrowRight') {
    console.log('right');
    forward(indexOfPokemon);
  }
  if (event.key == 'ArrowLeft') {
    console.log('left');
    backward(indexOfPokemon);
  }
});


/**
 * disable the navigation keys left and right arrow
 */
function disableArrowKeys() {
  window.addEventListener('keydown', disableEnableArrowKeys);
}


/**
 * enable the navigation keys left and right arrow
 */
function enableArrowKeys() {
  window.removeEventListener('keydown', disableEnableArrowKeys);
}


/**
 * disable / enable the navigation keys left and right arrow
 * @param {opject} event of pressed key
 */
let disableEnableArrowKeys = function (event) {
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowLeft':
      event.preventDefault();
      break;
    default:
      break;
  }
};


/**
 * load next pokemon detail card
 * @param {number} pokemonIndex of array loadedPokemon
 * @returns true or false if loading is in progress or not
 */
async function forward(pokemonIndex) {
  if (loadingInProgress) return;
  loadingInProgress = true;
  disableArrowKeys();
  loading();
  if (pokemonIndex == loadedPokemon.length - 1 && loadedPokemon.length < numberOfAllPokemon) {
    await loadPokemon();
    await renderPokemonDetails(pokemonIndex + 1);
  } else {
    await renderPokemonDetails(pokemonIndex + 1);
  }
  disableEnableButtons();
  loadingDone();
  enableArrowKeys();
  loadingInProgress = false;
  let htmlBody = document.body;
  htmlBody.style.overflowY = 'hidden';
}


/**
 * load previous pokemon detail card
 * @param {number} pokemonIndex of array loadedPokemon
 * @returns true or false if loading is in progress or not
 */
function backward(pokemonIndex) {
  if (loadingInProgress) return;
  loadingInProgress = true;
  disableArrowKeys();
  renderPokemonDetails(pokemonIndex - 1);
  disableEnableButtons();
  enableArrowKeys();
  loadingInProgress = false;
}


/**
 * disable the navigation button on pokemon details card, afer move forward or bachward an enable it again after 300 milliseconds
 */
function disableEnableButtons() {
  let forwardButton = document.getElementById('forward');
  let backwardButton = document.getElementById('backward');
  forwardButton.disabled = true;
  forwardButton.classList.add('disabled');
  backwardButton.disabled = true;
  backwardButton.classList.add('disabled');
  setTimeout(() => {
    forwardButton.disabled = false;
    forwardButton.classList.remove('disabled');
    backwardButton.disabled = false;
    backwardButton.classList.remove('disabled');
  }, 300);
}


/**
 * renders the image of pokemon with a different border for each pokemon main type (type0)
 * @param {number} pokemonIndex of the array loadedPokemon,
 * @param {string} pokemonType0 name of type from pokemon
 */
function renderPokemonDetailsImage(pokemonIndex, pokemonType0) {
  let pokemonDetailsContainer = document.getElementById('pokemon_details');
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
  pokemonDetailsContainer.innerHTML += pokemonDetailsImageTemplate(pokemonImage, pokemonType0);
}


/**
 * renders the container for pokemon abilities
 */
function renderPokemonDetailsAbilitiesContainer() {
  let pokemonDetailsBottomContainer = document.getElementById('pokemon_details_bottom');
  pokemonDetailsBottomContainer.innerHTML += pokemonDetailsAbilitiesContainerTemplate();
}


/**
 * render a single ability
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
function renderPokemonDetailsAbilities(pokemonIndex) {
  renderPokemonDetailsAbilitiesContainer();
  let pokemonDetailsAbilitiesContainer = document.getElementById('pokemon_abilities');
  let pokemonAbilities = loadedPokemon[pokemonIndex]['abilities'];
  for (let i = 0; i < pokemonAbilities.length; i++) {
    const pokemonAbility = pokemonAbilities[i];
    pokemonDetailsAbilitiesContainer.innerHTML += pokemonDetailsAbilityTemplate(pokemonAbility);
  }
}


/**
 * renders the container for pokemon evolution chain
 */
function renderPokemonDetailsEvolutionChainContainer() {
  let pokemonDetailsBottomContainer = document.getElementById('chain');
  pokemonDetailsBottomContainer.innerHTML += pokemonDetailsEvolutionChainContainerTemplate();
}


/**
 * get the evolution from json and call the render function for evolution container and the evolution chain
 * @param {number} pokemonIndex of the array loadedPokemon,
 */
async function getPokemonEvolutionChain(pokemonIndex) {
  let pokemonSpeciesUrl = loadedPokemon[pokemonIndex]['species']['url'];
  let pokemonSpecies = await fetch(pokemonSpeciesUrl);
  let pokemonSpeciesAsJson = await pokemonSpecies.json();
  if (pokemonSpeciesAsJson.evolution_chain !== null) {
    let pokemonEvolutionChainUrl = pokemonSpeciesAsJson['evolution_chain']['url'];
    let pokemonEvolutionChain = await fetch(pokemonEvolutionChainUrl);
    let pokemonEvolutionChainAsJson = await pokemonEvolutionChain.json();
    renderPokemonDetailsEvolutionChainContainer();
    renderPokemonDetailsEvolutionChain(pokemonEvolutionChainAsJson);
  }
}


/**
 * @param {json} pokemonEvolutionChainAsJson get the single stops in evolution chain from jason
 * and render it
 */
function renderPokemonDetailsEvolutionChain(pokemonEvolutionChainAsJson) {
  let pokemonEvolutionSteps = document.getElementById('evolution_steps');
  let pokemonEvolutionChain = pokemonEvolutionChainAsJson['chain']['evolves_to'];
  if (pokemonEvolutionChain.length < 1) {
    pokemonEvolutionSteps.innerHTML += pokemonDetailsNoEvolutionChainTemplate();
  } else if (pokemonEvolutionChain[0]['evolves_to'].length == 0) {
    renderFirstEvolutionStep(pokemonEvolutionChainAsJson);
    renderSecondEvolutionStep(pokemonEvolutionChainAsJson);
  } else if (pokemonEvolutionChain[0]['evolves_to'].length > 0) {
    renderFirstEvolutionStep(pokemonEvolutionChainAsJson);
    renderSecondEvolutionStep(pokemonEvolutionChainAsJson);
    renderThirdEvolutionStep(pokemonEvolutionChainAsJson);
  }
}


/**
 * render the first evolution step on pokemon overlay card
 * @param {json} pokemonEvolutionChainAsJson 
 */
function renderFirstEvolutionStep(pokemonEvolutionChainAsJson) {
  let pokemonEvolutionSteps = document.getElementById('evolution_steps');
  let firstEvolutionStepName = pokemonEvolutionChainAsJson['chain']['species']['name'];
  let firstEvolutionStepNameFormatted = firstEvolutionStepName.charAt(0).toUpperCase() + firstEvolutionStepName.slice(1);
  for (let i = 0; i < loadedPokemon.length; i++) {
    const firstEvolutionPokemon = loadedPokemon[i];
    let firstEvolutionPokemonName = firstEvolutionPokemon['name'];
    let firstEvolutionPokemonNameFormatted = firstEvolutionPokemonName.charAt(0).toUpperCase() + firstEvolutionPokemonName.slice(1)
    let firstEvolutionPokemonImage = loadedPokemon[i]['sprites']['other']['official-artwork']['front_default'];
    if (firstEvolutionStepNameFormatted == firstEvolutionPokemonNameFormatted) {
      pokemonEvolutionSteps.innerHTML += evolutionStepTemplate(firstEvolutionStepNameFormatted, firstEvolutionPokemonImage);
    }
  }
}


/**
 * render the second evolution step on pokemon overlay card
 * @param {json} pokemonEvolutionChainAsJson 
 */
function renderSecondEvolutionStep(pokemonEvolutionChainAsJson) {
  let pokemonEvolutionSteps = document.getElementById('evolution_steps');
  let secondEvolutionStepName = pokemonEvolutionChainAsJson['chain']['evolves_to'][0]['species']['name'];
  let secondEvolutionStepNameFormatted = secondEvolutionStepName.charAt(0).toUpperCase() + secondEvolutionStepName.slice(1);
  for (let i = 0; i < loadedPokemon.length; i++) {
    const secondEvolutionPokemon = loadedPokemon[i];
    let secondEvolutionPokemonName = secondEvolutionPokemon['name'];
    let secondEvolutionPokemonNameFormatted = secondEvolutionPokemonName.charAt(0).toUpperCase() + secondEvolutionPokemonName.slice(1)
    let secondEvolutionPokemonImage = loadedPokemon[i]['sprites']['other']['official-artwork']['front_default'];
    if (secondEvolutionStepNameFormatted == secondEvolutionPokemonNameFormatted) {
      pokemonEvolutionSteps.innerHTML += evolutionStepTemplate(secondEvolutionStepNameFormatted, secondEvolutionPokemonImage);
    }
  }
}


/**
 * render the third evolution step on pokemon overlay card
 * @param {json} pokemonEvolutionChainAsJson 
 */
function renderThirdEvolutionStep(pokemonEvolutionChainAsJson) {
  let pokemonEvolutionSteps = document.getElementById('evolution_steps');
  let thirdEvolutionStepName = pokemonEvolutionChainAsJson['chain']['evolves_to'][0]['evolves_to'][0]['species']['name'];
  let thirdEvolutionStepNameFormatted = thirdEvolutionStepName.charAt(0).toUpperCase() + thirdEvolutionStepName.slice(1);
  for (let i = 0; i < loadedPokemon.length; i++) {
    const thirdEvolutionPokemon = loadedPokemon[i];
    let thirdEvolutionPokemonName = thirdEvolutionPokemon['name'];
    let thirdEvolutionPokemonNameFormatted = thirdEvolutionPokemonName.charAt(0).toUpperCase() + thirdEvolutionPokemonName.slice(1)
    let thirdEvolutionPokemonImage = loadedPokemon[i]['sprites']['other']['official-artwork']['front_default'];
    if (thirdEvolutionStepNameFormatted == thirdEvolutionPokemonNameFormatted) {
      pokemonEvolutionSteps.innerHTML += evolutionStepTemplate(thirdEvolutionStepNameFormatted, thirdEvolutionPokemonImage);
    }
  }
}


/**
 * function to switch to the moves tab on pokemon overlay card
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 */
function switchToMoves(pokemonIndex) {
  let pokemonStatsContainer = document.getElementById('pokemon_details_bottom');
  let pokemonMovesContainer = document.getElementById('pokemon_details_moves')
  pokemonStatsContainer.classList.add('display-none');
  pokemonMovesContainer.classList.remove('display-none');
}


/**
 * function to switch back to main stats of pokemon
 */
function switchToStats() {
  let pokemonStatsContainer = document.getElementById('pokemon_details_bottom');
  let pokemonMovesContainer = document.getElementById('pokemon_details_moves')
  pokemonStatsContainer.classList.remove('display-none');
  pokemonMovesContainer.classList.add('display-none');
}


/**
 * render the container for the pokemon moves on overlay card
 */
function renderPokemonMovesContainer() {
  let pokemonMovesContainer = document.getElementById('pokemon_details_moves');
  pokemonMovesContainer.innerHTML += pokemonMovesContainerTemplate();
}


/**
 * render a single pokemon move
 * @param {number} pokemonIndex is the index of the pokemon from array "loadedPokemon"
 */
function renderPokemonMoves(pokemonIndex) {
  renderPokemonMovesContainer();
  let pokemonMovesContainer = document.getElementById('pokemon_moves')
  let pokemonMoves = loadedPokemon[pokemonIndex]['moves'];
  for (let i = 0; i < pokemonMoves.length; i++) {
    const pokemonMove = pokemonMoves[i]['move']['name'];
    pokemonMovesContainer.innerHTML += pokemonMoveTemplate(pokemonMove);
  }
}