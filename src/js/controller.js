import * as model from "./model.js";
import recipeView from "./view/recipeView.js";
import searchView from "./view/searchView.js";
import resultsView from "./view/resultsView.js";
import paginationView from "./view/paginationView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
// import { async } from "regenerator-runtime";

if (module.hot) {
    module.hot.accept();
}

const controlRecipes = async function () {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;
        recipeView.renderSpinner();
        // Update results view to mark selected search result
        resultsView.update(model.getSearchResultPage());
        // Loading recipe
        await model.loadRecipe(id);
        // rendering recipe
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.renderError();
    }
};

const controlSearchResults = async function () {
    try {
        resultsView.renderSpinner();

        const query = searchView.getQuery();
        if (!query) return;

        await model.loadSearchResults(query);
        resultsView.render(model.getSearchResultPage());

        // Pagination
        paginationView.render(model.state.search);
    } catch (error) {
        console.error(error);
    }
};

const controlPagination = function (goToPage) {
    resultsView.render(model.getSearchResultPage(goToPage));
    paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
    model.updateServings(newServings);

    recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
    if (!model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe);
    } else {
        model.deleteBookmark(model.state.recipe.id);
    }
    recipeView.update(model.state.recipe);
};

const init = function () {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
};
init();
