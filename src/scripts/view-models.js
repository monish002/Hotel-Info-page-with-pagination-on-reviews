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
(function(ns, repo, $, Review, pubSub, factories, events){
	var ReviewsModule = function(){
		if(!(this instanceof ReviewsModule)){
			return new ReviewsModule();
		}

		// TODO: get hotelId from URL. 
		// For now, setting it to 123 as mock hotel id.
		this.hotelId = 123; 
	};
	
	ReviewsModule.prototype = (function(){
		var updateReviews = function(event){
			var hotelId = this.hotelId; 
			factories.hotelInfo.getInstance(hotelId, function(hotelInfoModel){
				hotelInfoModel.updateReviews(hotelId, {
					pageNumber: event.key == 'pageNumber' ? event.newValue : null,
					areReviewsSorted: event.key == 'areReviewsSorted' ? event.newValue : null
				});
			});
		};
		var init = function(){
			pubSub.subscribe(events.reviews_page_change, updateReviews);
			pubSub.subscribe(events.sorting_reviews_change, updateReviews);

			factories.hotelInfo.getInstance(this.hotelId, function(hotelInfoModel){
				ko.applyBindings(hotelInfoModel, $('#reviews_list')[0]);
			});
		};

		return {
			init: init
		};
	})();
	
	ns.ReviewsModule = ReviewsModule;
})(app.modules, app.repository, $, app.models.Review, app.extensions.getPubSubRef(), app.factories, app.events);

// Pagination module
(function(ns, repo, $, factories, consts){
	var PaginationModule = function(){
		if(!(this instanceof PaginationModule)){
			return new PaginationModule();
		}
		
		// TODO: get hotelId from URL. 
		// For now, setting it to 123 as mock hotel id.
		this.hotelId = 123; 
	};
	
	PaginationModule.prototype = (function(){
		var init = function(){
			factories.hotelInfo.getInstance(this.hotelId, function(hotelInfoModel){
				var pageCount = Math.floor((hotelInfoModel.reviewsTotalCount + consts.REVIEWS_PER_PAGE - 1)/consts.REVIEWS_PER_PAGE);
				ko.applyBindings(factories.paginationModel.getInstance(pageCount), $('#reviews_pagination')[0]);
			});
		};
		return {
			init: init
		};
	})();
	
	ns.PaginationModule = PaginationModule;
})(app.modules, app.repository, $, app.factories, app.constants);

// Sorting Module for reviews
(function(ns, repo, $, factories, consts, pubSub, events){
	var ReviewsSortModule = function(){
		if(!(this instanceof ReviewsSortModule)){
			return new ReviewsSortModule();
		}
		
		this.areReviewsSorting = false;
		this.sortElem = $('#reviews_sorting');
	};

	ReviewsSortModule.prototype = (function(){
		var onChangeSortedBy = function(){
			var newValue = this.sortElem.is(":checked");
			if(this.areReviewsSorting == newValue){
				return;
			}
			pubSub.publish(events.sorting_reviews_change, {
				'key': 'areReviewsSorting',
				'newValue': newValue
			});
			this.areReviewsSorting = newValue;
		},
		init = function(){
			var self = this;
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
})(app.modules, app.repository, $, app.factories, app.constants, app.extensions.getPubSubRef(), app.events);

