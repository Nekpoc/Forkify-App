import { mark } from "regenerator-runtime";
import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {Object} View instance
   * @author Michael Platts
   * @todo finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newEl = Array.from(newDOM.querySelectorAll("*"));
    const curEl = Array.from(this._parentEl.querySelectorAll("*"));

    newEl.forEach((newEl, i) => {
      const cEl = curEl[i];

      //  Update changed TEXT
      if (
        !newEl.isEqualNode(cEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        cEl.textContent = newEl.textContent;
      }

      //  Update changed ATTRIBUTES
      if (!newEl.isEqualNode(cEl))
        Array.from(newEl.attributes).forEach((attr) =>
          cEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
              <svg>
                  <use href="${icons}#icon-loader"></use>
              </svg>
          </div>
          `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}
