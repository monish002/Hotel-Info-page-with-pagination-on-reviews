// Hotel info module to manage hotel related content (this exclues reviews)
(function(ns, repo, $, factories){
	var HotelInfoModule = function(){
		// if new operator is not called, force it.
		if(!(this instanceof HotelInfoModule)){
			return new HotelInfoModule();
		}
	
		// TODO: get hotelId from URL. 
		// For now, setting it to 123 as mock hotel id.
		this.hotelId = 123; 
	}
	
	HotelInfoModule.prototype = (function(){
		var init = function(){
			factories.hotelInfo.getInstance(this.hotelId, function(hotelInfoModel){
				ko.applyBindings(hotelInfoModel, $('#hotelInfo')[0]);
				ko.applyBindings(hotelInfoModel, $('#pageTitle')[0]);
			});
		};

		return {
			init: init
		};
	})();
	
	
	ns.HotelInfoModule = HotelInfoModule;
})(app.modules, app.repository, $, app.factories);

// reviews module
(function(ns, repo, $, Review, pubSub, factories, eventsList, consts){
	var ReviewsModule = function(){
		if(!(this instanceof ReviewsModule)){
			return new ReviewsModule();
		}

		// TODO: get hotelId from URL. 
		// For now, setting it to 123 as mock hotel id.
		this.hotelId = 123; 
		this.areReviewsSorted = consts.INITIAL_REVIEWS_SORT;
		this.pageNumber = consts.INITIAL_REVIEWS_PAGE_NO;
	};
	
	ReviewsModule.prototype = (function(){
		var updateReviews = function(event){
			this.areReviewsSorted = (event.key == 'areReviewsSorting' ? event.newValue : this.areReviewsSorted);
			this.pageNumber = (event.key == 'pageNumber' ? event.newValue : this.pageNumber);
			
			var self = this;
			factories.hotelInfo.getInstance(this.hotelId, function(hotelInfoModel){
				hotelInfoModel.updateReviews(self.hotelId, {
					pageNumber: self.pageNumber,
					areReviewsSorted: self.areReviewsSorted
				});
			});
		};
		var init = function(){
			var self = this;
			var callback = function(event){
				self.updateReviews(event);
			};
			pubSub.subscribe(eventsList.reviews_page_change, callback);
			pubSub.subscribe(eventsList.sorting_reviews_change, callback);

			factories.hotelInfo.getInstance(this.hotelId, function(hotelInfoModel){
				ko.applyBindings(hotelInfoModel, $('#reviews_list')[0]);
			});
		};

		return {
			init: init,
			updateReviews: updateReviews
		};
	})();
	
	ns.ReviewsModule = ReviewsModule;
})(app.modules, app.repository, $, app.models.Review, app.extensions.getPubSubRef(), app.factories, app.eventsList, app.constants);

// Pagination module
(function(ns, repo, $, factories, consts, pubSub, eventsList){
	var PaginationModule = function(){
		if(!(this instanceof PaginationModule)){
			return new PaginationModule();
		}
		
		this.selectedPageNumber = ko.observable(consts.INITIAL_REVIEWS_PAGE_NO);
		this.pageCount = null; // will be set in the init()
		
		// TODO: get hotelId from URL. 
		// For now, setting it to 123 as mock hotel id.
		this.hotelId = 123;	
	};
	
	PaginationModule.prototype = (function(){
		var init = function(){
			var self = this;
			factories.hotelInfo.getInstance(this.hotelId, function(hotelInfoModel){
				var totalReviewCount = hotelInfoModel.allReviews.length;
				self.pageCount = Math.floor((totalReviewCount + consts.REVIEWS_PER_PAGE - 1)/consts.REVIEWS_PER_PAGE);
				ko.applyBindings(self, $('#reviews_pagination')[0]);
			});
		};
		var getSelectedPage = function(){
			return this.selectedPageNumber();
		};
		var setSelectedPage = function(pageNum){
			if(pageNum == this.selectedPageNumber()){
				return;
			}
			pubSub.publish(eventsList.reviews_page_change, {
				'key': 'pageNumber',
				'newValue': pageNum
			});
			this.selectedPageNumber(pageNum);
		};
		var pageNumbers = function(){
			return _.range(1, this.pageCount + 1);
		};
		return {
			getSelectedPage: getSelectedPage,
			setSelectedPage: setSelectedPage,
			pageNumbers: pageNumbers,
			init: init
		};
	})();
	
	ns.PaginationModule = PaginationModule;
})(app.modules, app.repository, $, app.factories, app.constants, app.extensions.getPubSubRef(), app.eventsList);

// Sorting Module for reviews
(function(ns, repo, $, factories, consts, pubSub, eventsList){
	var ReviewsSortModule = function(){
		if(!(this instanceof ReviewsSortModule)){
			return new ReviewsSortModule();
		}
		
		this.areReviewsSorting = consts.INITIAL_REVIEWS_SORT;
		this.sortElem = $('#reviews_sorting');
	};

	ReviewsSortModule.prototype = (function(){
		var onChangeSortedBy = function(){
			var newValue = this.sortElem.is(":checked");
			if(this.areReviewsSorting == newValue){
				return;
			}
			pubSub.publish(eventsList.sorting_reviews_change, {
				'key': 'areReviewsSorting',
				'newValue': newValue
			});
			this.areReviewsSorting = newValue;
		},
		init = function(){
			var self = this;
			this.sortElem.prop('checked', consts.INITIAL_REVIEWS_SORT);
			this.sortElem.on('change', function(){
				self.onChangeSortedBy();
			});
		};

		return {
			init: init,
			onChangeSortedBy: onChangeSortedBy
		};
	})();
		
	ns.ReviewsSortModule = ReviewsSortModule;
})(app.modules, app.repository, $, app.factories, app.constants, app.extensions.getPubSubRef(), app.eventsList);

