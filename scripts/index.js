// const URL = "https://my-little-cors-proxy.herokuapp.com/https://anapioficeandfire.com/api/characters?page=1&pageSize=50";

let allCharactersArray = [];

const storageKey = 'game-of-thrones'

function storeCharacters(arrayOfCharacters) {
//  convert the array to a JSON string
    const jsonCharacters = JSON.stringify
    (arrayOfCharacters)
    console.log(`saving ${arrayOfCharacters.length} characters`);

//  set that string in localStorage
localStorage.setItem(storageKey,
jsonCharacters);
}


function loadCharacters() {
    //  get the JSON string from LocalStorage
    const jsonCharacters = localStorage.getItem(storageKey);

    //  convert it back into an array 
    const arrayOfCharacters = JSON.parse(jsonCharacters);

    console.log(`loaded ${arrayOfCharacters.length}characters`)
    // return it 
    return arrayOfCharacters


}
function urlForPage(pageNumber=1) {
    return `https://my-little-cors-proxy.herokuapp.com/https://anapioficeandfire.com/api/characters?page=${pageNumber}&pageSize=50`

}



function accumulateCharacters(theActualData) {
    allCharactersArray = [
        ...allCharactersArray,
        ...theActualData
    ];
    storeCharacters(allCharactersArray);
};

function retrievePageOfCharacters(pageNumber) {
    fetch(urlForPage(pageNumber))
    .then(function(response) {
        return response.json();
    })
    .then(accumulateCharacters)
    .then(function() {
        console.log(`done with page ${pageNumber}`)
    })
};

function drawSingleCharacterToListing(characterObject) {
    const characterName = characterObject.name; 
    if (characterName.length === 0) {
        return;
    }
    const anchorElement = document.createElement('a');
    anchorElement.textContent = characterName; 

    const listItem = document.createElement ('li');
    listItem.appendChild(anchorElement); 

    const listArea = document.querySelector('[data-listing]');

    listArea.appendChild(listItem); 

}
function drawListOfCharacters() {
    // uses global variable allCharactersArray 

    //  loop through the array of characters
    //  for each one, draw the name in the listing area
    //  of the page
    allCharactersArray.forEach(drawSingleCharacterToListing) 

}
function sortByName(obj1, obj2) {
    const letter1 = obj1.name[0];
    const letter2 = obj2.name[0];

    if (letter1 < letter2) {
        return -1

    } else if (letter2 < letter1) {
        return 1;

    }
    return 0;
}

function main() {
    let charactersInLocalStorage = loadCharacters(); 
    if (charactersInLocalStorage) {
        allCharactersArray = [
            ...charactersInLocalStorage.sort()
        ];
        drawListOfCharacters();
    } else {
        for (let pageNumber=0; pageNumber <50; pageNumber++){
        let delay = pageNumber*500;

         // we have to wrap retrievPageOfCharacters in
            //  an anonymous function so we can pass 
            //  it into an argument.
        
            setTimeout(function() {
                retrievePageOfCharacters(pageNumber);
            }, delay); 
        }   
    }
}
main();

console.log(allCharactersArray)

