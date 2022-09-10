import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) module.hot.accept();
///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // 0. Update resultsview to mark selected seach results
    recipeView.renderSpinner();
    resultView.update(model.getSearchResultsPage());
    // Update bookmarks
    bookmarkView.update(model.state.bookmarks);

    // 1. Loading Recipe
    await model.loadRecipe(id);
    // 2. Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};
const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();

    // 1. Get Search quary
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load Seach Results
    await model.loadSearchResult(query);

    // 3. Render Results
    //  resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());

    // 4. Render Initial Paginaion
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render New Results
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2. Render New Paginaion
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update Recipeview
  recipeView.update(model.state.recipe);
  // Render Recipeview
  bookmarkView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // Render Spinner
    addRecipeView.renderSpinner();
    // Upload new Recipe Data
    await model.uploadRecipe(newRecipe);
    // Render new Recipe
    recipeView.render(model.state.recipe);
    //Succes Message
    addRecipeView.renderMessage();
    // Rener bookmark view
    bookmarkView.render(model.state.bookmarks);
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
    window.location.reload();
  }
};
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandelerRender(controlRecipes);
  recipeView.addHandelerUpdateServings(controlServings);
  recipeView.addHandelerAddBookmark(controlAddBookmark);
  searchView.addHandelerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
