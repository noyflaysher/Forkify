import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    //1)Loading recipe
    await model.loadRecipe(id);

    //2) Rendering recipe
    recipeView.render(model.state.recipe);
    //Update bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controllSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //Load results
    await model.loadSearchResult(query);
    //Render results
    resultsView.render(model.getSearchResultPage(model.state.page));

    //render the pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //Render new  results
  resultsView.render(model.getSearchResultPage(goToPage));
  //render the new pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe serving(in state)
  model.updateServings(newServings);
  //Update the recipe view

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controllAddBookmark = function () {
  //1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2)Update recipeView
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controllAddBookmark);
  searchView.addHandlerSearch(controllSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
