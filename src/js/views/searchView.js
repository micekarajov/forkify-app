


class SearchView {
    _parentElement = document.querySelector('.search');
 
    _clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }


    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;

        this._clearInput();
        return query;
    }


    // Publisher-Subscriber pattern
    addHandlerSearch(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        })
    }
}

//* We will not export that class but export an instance, so an object that was created by this class.
//* So export default new SearchView, and without passing in any data,
export default new SearchView();