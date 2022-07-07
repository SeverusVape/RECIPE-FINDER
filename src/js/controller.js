import * as model from "./model.js";
import recipeView from "./view/recipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

//const recipeContainer = document.querySelector(".recipe");

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} second`)
            );
        }, s * 1000);
    });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
    try {
        // * LOADING RECIPE
        // getting id of hash
        const id = window.location.hash.slice(1);
        console.log(id);
        if (!id) return;

        recipeView.renderSpinner();
        await model.loadRecipe(id);
        // * RENDERING RECIPE
        recipeView.render(model.state.recipe);
    } catch (err) {
        console.error(err);
    }
};

// * LISTENER FOR HASH CHANGING
["hashchange", "load"].forEach((event) =>
    window.addEventListener(event, controlRecipes)
);
