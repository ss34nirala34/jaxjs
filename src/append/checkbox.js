/**
 * append/checkbox.js
 */
jax.extend({
    /**
     * Function to append a new set of checkbox elements to the current element
     *
     * @param   {Array}   values
     * @param   {Object}  attribs
     * @param   {Mixed}   marked
     * @param   {Boolean} pre
     * @returns {jax}
     */
    appendCheckbox : function(values, attribs, marked, pre) {
        if (this[0] == undefined) {
            throw 'An object must be selected in which to append.';
        }

        // Set the main child element.
        var objChild = document.createElement('fieldset');
        objChild.setAttribute('class', 'check-box-fieldset');

        // Set the elements that are marked/checked.
        if ((marked != undefined) && (marked != null)) {
            if (marked.constructor != Array) {
                marked = [marked];
            }
        } else {
            marked = [];
        }

        // Create the child checkbox elements.
        var i = 0;
        for (var key in values) {
            var newElem = document.createElement('input');
            newElem.setAttribute('type', 'checkbox');
            newElem.setAttribute('class', 'check-box');

            // Set any element attributes.
            if ((attribs != undefined) && (attribs != null)) {
                for (var attrib in attribs) {
                    var att = ((attrib == 'id') && (i > 0)) ? attribs[attrib] + i : attribs[attrib];
                    if (attrib == 'tabindex') {
                        att = att + i;
                    }
                    newElem.setAttribute(attrib, att);
                }
            }

            // Set elements' values and append them to the parent element.
            newElem.setAttribute('value', key);
            newElem.checked = (marked.indexOf(key) != -1);
            objChild.appendChild(newElem);

            var spanElem = document.createElement('span');
            spanElem.setAttribute('class', 'check-span');
            spanElem.innerHTML = values[key];

            objChild.appendChild(spanElem);
            i++;
        }

        // Prepend or append the child element to the parent element.
        if ((pre != undefined) && (pre) && (this[0].childNodes[0] != undefined)) {
            this[0].insertBefore(objChild, this[0].childNodes[0]);
        } else {
            this[0].appendChild(objChild);
        }

        return this;
    },
    /**
     * Alias function to prepend a new set of checkbox elements to the current element
     *
     * @param   {Array}  values
     * @param   {Object} attribs
     * @param   {Mixed}  marked
     * @returns {jax}
     */
    prependCheckbox : function(values, attribs, marked) {
        return this.appendCheckbox(values, attribs, marked, true);
    }
});