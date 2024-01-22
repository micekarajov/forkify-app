import icons from 'url:../../img/icons.svg'; 

//* So at this time, we are actually exporting the class itself because of course, we are not going to create any instance of this view.
//* We will only use it as a parent class of these other child views
export default class View {
    _data;
    
    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {boolean} [render = true]  If false, create markup string instead of rendering to the DOM
     * @returns {undefined | string}  A markup string is returned if render=false
     * @this {Object} View instance
     * @author Mice Karajov
     * @todo Finish the implementation
     */
    render(data, render = true) {
        // if( !data || ( Array.isArray(data) || data.length === 0 )) return this.renderError();
        if(!data || data.length === 0) return this.renderError();

        this._data = data;
        // console.log(data);
        
        const markup = this._generateMarkup();

        if(!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };


    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDom = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDom.querySelectorAll('*'));
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEl, i) => {
            const curEl= currentElements[i];

            //* Update changes TEXT
            if (
                !newEl.isEqualNode(curEl) &&
                newEl.firstChild?.nodeValue.trim() !== ''
                ) {
                // console.log('💥',  newEl.firstChild.nodeValue.trim());
                curEl.textContent = newEl.textContent;
            }

            //* Update changes ATTRIBUTES
            //  convert this object to an array, and then we can loop over this array and basically copy all the attributes from one element to the other element. So from the new element basically to the current one.
            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
            }
                
        });
    }


    _clear() {
        this._parentElement.innerHTML = '';
    }


    //* Render Spinner
    renderSpiner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div> 
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    //* Error Messages
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
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    //* Success Messages
    renderSuccessError(message = this._successMessage) {
        const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;
        
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}