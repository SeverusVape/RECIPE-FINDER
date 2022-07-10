import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./view/recipeView.js";
import searchView from "./view/searchView.js";
import resultsView from "./view/resultsView.js";
import paginationView from "./view/paginationView.js";
import bookmarksView from "./view/bookmarksView.js";
import addRecipeView from "./view/addRecipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

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
        // updating bookmarks view
        bookmarksView.update(model.state.bookmarks);
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
    // add/remove bookmark
    if (!model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe);
    } else {
        model.deleteBookmark(model.state.recipe.id);
    }
    // update recipe
    recipeView.update(model.state.recipe);
    // render bookmark
    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
    try {
        // show spiner
        addRecipeView.renderSpinner();
        //  upload new recipe
        await model.uploadRecipe(newRecipe);
        // render recipe
        recipeView.render(model.state.recipe);
        // success message
        addRecipeView.renderMessage();
        // render bookmark
        bookmarksView.render(model.state.bookmarks);
        // change id in URL
        window.history.pushState(null, "", `#${model.state.recipe.id}`);
        // close form
        setTimeout(function () {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);
    } catch (error) {
        console.error(error);
        addRecipeView.renderError(error.message);
    }
};

const init = function () {
    bookmarksView.addHandlerRander(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHAndlerUpload(controlAddRecipe);
};
init();

// ! JUST FOR DEVELOPMENT PORPOSE
// const clearBookmarks = function () {
//     localStorage.clear("bookmarks");
// };
// clearBookmarks()
