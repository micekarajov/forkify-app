import { async } from 'regenerator-runtime';
import { API_URL, KEY, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';


export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })
    };
}

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
        // console.log(data);

        state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

    } catch (error) {
        // console.log(`${error} 💥💥💥`);
        throw error;
    }
}



export const loadSearchResults = async function (query) {
    try {   
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);    // https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
        // console.log(data);

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                sourceUrl: rec.source_url,
                image: rec.image_url,
                ...(rec.key && { key: rec.key })
            }
        });

        state.search.page = 1;
    } catch (error) {
        // console.log(`${error} 💥💥💥`);
        throw error;
    }
};



export const getSearchResultPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage; //0
    const end = page * state.search.resultsPerPage; //9

    return state.search.results.slice(start, end);
}


//* Reach into the state, and in particular into the recipe ingredients, and then change the quantity in each ingredient.
export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        // newQt = ( oldQt * newServings / oldServings); 
    });
    state.recipe.servings = newServings;
}   


const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}


export const addBookmark = function (recipe) {
    //* Add bookmark
    state.bookmarks.push(recipe);

    //* Mark current recipe as bookmarked // allow to display current recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks()
}


// preety common pattern // when we add something we get the entire data.
// And when we want to delete something, we only get to the ID.
export const deleteBookmark = function (id) {
    //* Delete bookmarked
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    //* Mark current recipe as NOT bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
};



//
const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
}
init();


const clearBookmarks = function () {
    localStorage.clear('bookmarks');
}
// clearBookmarks();


export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
            const ingArray = ing[1].split(',').map(el => el.trim());

            if (ingArray.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format :)');

            const [quantity, unit, description] = ingArray;

            return { quantity: quantity ? +quantity : null, unit, description };
        });

        console.log(ingredients);
        

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    }
    catch(error) {
        throw error;
    }

    
}