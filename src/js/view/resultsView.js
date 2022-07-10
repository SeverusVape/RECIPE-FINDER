import View from "./View.js";
import previewView from "./previewView.js";
// import icons from "url:../../img/icons.svg";

class ResultsView extends View {
    _parentElement = document.querySelector(".results");
    _errorMessage = `NO RECIPE FOUND. TRY TO SEARCH AGAIN.`;
    _message = "SUCCSESS!";

    _generateMarkup() {
        return this._data
            .map((bookmark) => previewView.render(bookmark, false))
            .join("");
    }
}

export default new ResultsView();
