// Hotel info module to manage hotel related content (this exclues reviews)
(function(ns, repo, $, models, pubSub, eventsList){
	var HotelInfoModule = function(){
		// if new operator is not called, force it.
		if(!(this instanceof HotelInfoModule)){
			return new HotelInfoModule();
		}
	
		this.hotelModel = null;
	}
	
	HotelInfoModule.prototype = (function(){
		var init = function(){
			// Get hotelId from URL. 
			// For now, setting it to 123 as mock hotel id.
			var hotelId = 123; 
			repo.getHotelInfo(hotelId).then(
				// success callback
				function(rawHotelInfoModel){
					var hotelModel = new models.HotelInfoModel(rawHotelInfoModel);
					pubSub.publish(eventsList.hotel_info_loaded, {
						'key': 'hotelModel',
						'newValue': hotelModel
					});
					ko.applyBindings(hotelModel, $('#hotelInfo')[0]);
					ko.applyBindings(hotelModel, $('#pageTitle')[0]);
				},
				// error callback
				function(){ 
					throw "API call failed";
					// Log the error with details in server side.
					// Show appropriate error to user
				}
			);
		};

		return {
			init: init
		};
	})();
	
	ns.HotelInfoModule = HotelInfoModule;
})(app.modules, app.repository, $, app.models, app.extensions.getPubSubRef(), app.eventsList);

// reviews module
(function(ns, repo, $, pubSub, models, eventsList, consts){
	var ReviewsModule = function(){
		if(!(this instanceof ReviewsModule)){
			return new ReviewsModule();
		}

		// TODO: get hotelId from URL. 
		// For now, setting it to 123 as mock hotel id.
		this.hotelId = 123; 
		this.areReviewsSorted = consts.INITIAL_REVIEWS_SORT;
		this.pageNumber = consts.INITIAL_REVIEWS_PAGE_NO;
		this.allReviews = null; // init in init function
		this.reviews = ko.observableArray(); // used for view
	};
	
	ReviewsModule.prototype = (function(){
		var updateReviews = function(event){
			var self = this;
			if(!this.allReviews || this.allReviews.length <= 0){
				return;
			}
			
			this.areReviewsSorted = (event && event.key == 'areReviewsSorting' ? event.newValue : this.areReviewsSorted);
			this.pageNumber = (event && event.key == 'pageNumber' ? event.newValue : this.pageNumber);
			
			var reviews = this.allReviews.slice(0); // make a copy of all reviews
			if(this.areReviewsSorted){
				reviews.sort(function(r1, r2){
					return r2.score - r1.score; // desc order
				});
			}
		
			var skipReviews = (this.pageNumber-1) * consts.REVIEWS_PER_PAGE;
			var takeReviews = consts.REVIEWS_PER_PAGE;
			var newRawReviews = reviews.slice(skipReviews, skipReviews+takeReviews);
			var newReviews = $.map(newRawReviews, function(rawReview){
				return new models.Review(rawReview);
			});
			this.reviews(newReviews);
		};
		var init = function(){
			var self = this;
			var callback = function(event){
				self.updateReviews(event);
			};
			pubSub.subscribe(eventsList.reviews_page_change, callback);
			pubSub.subscribe(eventsList.sorting_reviews_change, callback);

			pubSub.subscribe(eventsList.hotel_info_loaded, function(event){
				var hotelModel = event.key == 'hotelModel' ? event.newValue : null;
				if(!hotelModel){
					throw "hotelModel should have some values";
				}
				self.allReviews = hotelModel.allReviews;
				ko.applyBindings({reviews: self.reviews}, $('#reviews_list')[0]);
				self.updateReviews();
			});
		};

		return {
			init: init,
			updateReviews: updateReviews
		};
	})();
	
	ns.ReviewsModule = ReviewsModule;
})(app.modules, app.repository, $, app.extensions.getPubSubRef(), app.models, app.eventsList, app.constants);

// Pagination module
(function(ns, repo, $, consts, pubSub, eventsList){
	var PaginationModule = function(){
		if(!(this instanceof PaginationModule)){
			return new PaginationModule();
		}
		
		this.selectedPageNumber = ko.observable(consts.INITIAL_REVIEWS_PAGE_NO);
		this.pageCount = null; // will be set in the init()
	};
	
	PaginationModule.prototype = (function(){
		var init = function(){
			var self = this;
			pubSub.subscribe(eventsList.hotel_info_loaded, function(event){
				var hotelInfoModel = event.key == 'hotelModel' ? event.newValue : null;
				if(!hotelInfoModel){
					throw "hotelInfoModel should have some values";
				}
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
})(app.modules, app.repository, $, app.constants, app.extensions.getPubSubRef(), app.eventsList);

// Sorting Module for reviews
(function(ns, repo, $, consts, pubSub, eventsList){
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
})(app.modules, app.repository, $, app.constants, app.extensions.getPubSubRef(), app.eventsList);

