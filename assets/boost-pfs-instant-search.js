// Override Settings
var boostPFSInstantSearchConfig = {
  search: {
    //suggestionMode: 'test',
    //suggestionPosition: 'left'
  }
};

(function() {
  BoostPFS.inject(this);

  // Customize style of Suggestion box
  SearchInput.prototype.customizeInstantSearch = function() {};

  SearchInput.prototype.afterBindEvents = function() {
    // Fix cannot close search suggestion when clicking overlay 
    document.addEventListener('click', function(e) {
      if(this.searchAutoComplete && this.searchAutoComplete.isOpen && e && e.target) {
        var $clickedElement = jQ(e.target);
        var isClickSuggestion = $clickedElement.closest('.' + Class.searchSuggestionWrapper).length > 0;
        if (isClickSuggestion) {
          this.searchAutoComplete.$element.hide();
          this.searchAutoComplete.searchInput.onCloseAutocomplete();
          this.searchAutoComplete.isOpen = false;
        }
      }
    }.bind(this), true);
  }
  InstantSearchResultItemProduct.prototype.compileSuggestionProductPrice = function () {
          // If the multi-currency feature is enabled, update the product price
		this.prepareSuggestionProductPriceData();
		// Check on sale
        console.log(this.data);
		var onSale = this.data.compare_at_price_min > this.data.price_min;
		// Format price
		var price = Utils.formatMoney(this.data.price_min*10);
		var compareAtPrice = '';
		if (this.data && this.data.compare_at_price_min) {
			compareAtPrice = Utils.formatMoney(this.data.compare_at_price_min*10);
			if (Settings.getSettingValue('search.removePriceDecimal')) {
				price = Utils.removeDecimal(price);
				compareAtPrice = Utils.removeDecimal(compareAtPrice);
			}
		}
		
		// Build Price
		var result = '';
		if (Settings.getSettingValue('search.showSuggestionProductPrice')) {
			if (onSale && Settings.getSettingValue('search.showSuggestionProductSalePrice')) {
				result = this.getTemplate(InstantSearchResultItemProduct.tempType.PRICE_SALE);
			} else {
				result = this.getTemplate(InstantSearchResultItemProduct.tempType.PRICE);
			}
		}
		return result
			.replace(/{{regularPrice}}/g, price)
			.replace(/{{compareAtPrice}}/g, compareAtPrice);
  }
  InstantSearch.prototype.afterBindEvents = function() {
      if (typeof DoublyGlobalCurrency !== 'undefined' && jQ('[name=doubly-currencies]').length > 0) {
        DoublyGlobalCurrency.convertAll(jQ('[name=doubly-currencies]').val());
      }
    }
})();