import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// import icons from '../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// const recipeContainer = document.querySelector('.recipe');
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// parcel
if (module.hot) {
  module.hot.accept();
}

//! Control Recipe
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpiner();

    //* 0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    //* 1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //* 2. Loading Recipe
    await model.loadRecipe(id);

    //* 3. Render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(`${error} 💥💥💥`);
    console.error(error);
  }
};

//! Search Results
const controlSearchResults = async function () {
  try {
    resultsView.renderSpiner();

    //* 1. Get Search querry
    const query = searchView.getQuery();
    if (!query) return;

    //* 2. Load Search results
    await model.loadSearchResults(query);

    //* 3.Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    //* 4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
    resultsView.renderError(`${error} 💥💥💥`);
  }
};

//! Pagination
const controlPagination = function (goToPage) {
  //* 1.Render NEW results
  resultsView.render(model.getSearchResultPage(goToPage));

  //* 2. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

//! Update Rcipe Servings
const controlServings = function (updateTo) {
  //* 1.Update the recipe servings (in state)
  //  I would like to keep this controller flexible and as robust as possible. Don't want this controller to be the one responsible for telling, which should be the next serving. So that should come from the view, and not from the controller, because it is in the view where the user is actually updating the servings. And so in order to keep this controller as flexible as possible, we can simply pass in, basically the new servings, and then pass that new servings into update servings.
  model.updateServings(updateTo);

  //* 2. Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//! Adding a new Bookmark
const controlAddBookmark = function () {
  //* 1. Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //* 2. Update the recipe view
  recipeView.update(model.state.recipe);

  //* 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

//! Render bookmarks
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//! Receive new Recipe Data
const controlAddRecipe = async function (newRecipe) {
  try {
    //* 0. Show loading spinner
    addRecipeView.renderSpiner();

    //* 1. Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //* 2. Render recipe
    recipeView.render(model.state.recipe);

    //* 3. Success message
    addRecipeView.renderSuccessError();

    //* 4. Render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    //* Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //* 4. Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log('💥💥💥', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHendlerUpdateServings(controlServings);
  recipeView.addHendlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome');
};
init();
