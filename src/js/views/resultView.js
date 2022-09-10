import View from './view.js';
import previewView from './previewView.js';


class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes was found for your query. Please try again :)';

  _generateMarkup() {
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
  }
}
export default new ResultsView();
