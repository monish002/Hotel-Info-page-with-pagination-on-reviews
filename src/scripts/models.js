
// Room view model
(function(ns){
	var Room = function(room){
		var keys = ['name', 'occupancy', 'price', 'currencySymbol', 'availableRoomCount'];
		_.extend(this, _.chain(room).pick(keys).value());
	};
	
	Room.prototype = (function(){
		var getNumRoomsOptions = function(){
			return _.range(this.availableRoomCount + 1);
		};
		return {
			getNumRoomsOptions: getNumRoomsOptions
		};
	})();
	
	ns.Room = Room;
})(app.models);

// Review view model
(function(ns, _){
	function Review(review){
		var keys = ['score', 'content', 'cite'];
		_.extend(this, _.chain(review).pick(keys).value());
	};
	
	Review.prototype = (function(){
		var getReviewHtmlStr = function(){
			return (this.content ? this.content : '') + 
			(this.cite ? '<cite>' + this.cite + '</cite>' : '');
		};
		return {
			getReviewHtmlStr: getReviewHtmlStr
		};
	})();
	
	ns.Review = Review;
})(app.models, _);

// Hotel info model
(function(ns, repo, models, factories, consts){
	var HotelInfoModel = function(hotelInfo){
		var keys = ['basicHotelInfo', 'description', 'photos', 'facilities', 'reviewsTotalCount'];
		_.extend(this, _.chain(hotelInfo).pick(keys).value());
	
		this.rooms = !$.isArray(hotelInfo.rooms) ? [] : _.map(hotelInfo.rooms, function(rawRoom){
			return new models.Room(rawRoom);
		});
		
		var reviews = !$.isArray(hotelInfo.reviews) ? [] : _.map(hotelInfo.reviews, function(rawReview){
			return new models.Review(rawReview);
		});
		this.reviews = ko.observableArray(reviews);
	};
	
	// todo: move to proto
	// filters: object having keys pageNumber, areReviewsSorted 
	var updateReviews = function(hotelId, filters){
		var self = this;
		repo.getReviews(hotelId, {
			skip: filters.pageNumber * consts.REVIEWS_PER_PAGE,
			take: consts.REVIEWS_PER_PAGE,
			sortByScore: filters.areReviewsSorted
		}).then(
			// success callback
			function(rawReviews){
				var reviews = !$.isArray(rawReviews) ? [] : _.map(rawReviews, function(rawReview){
					return new models.Review(rawReview);
				});
				self.reviews(reviews); // Make reviewsPage class and add set(pageContents)
			},
			// error callback
			function(){ 
				throw "API call failed";
				// Log the error with details in server side.
				// Show appropriate error to user
			});
	};
	
	HotelInfoModel.prototype = (function(){
		return {
			updateReviews: updateReviews
		};
	})();

	ns.HotelInfoModel = HotelInfoModel;

	factories.hotelInfo = (function(){
		var self = this;
		var getInstance = function(hotelId, callback, context){
			if(self.hotelInfoModel && self.hotelInfoModel.basicHotelInfo && self.hotelInfoModel.basicHotelInfo.id === hotelId){
				callback(self.hotelInfoModel);
			}
			repo.getHotelInfo(hotelId).then(
				// success callback
				function(rawHotelInfoModel){
					var hotelModel = new HotelInfoModel(rawHotelInfoModel);
					context ? context.callback(hotelModel) : callback(hotelModel); 
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
			getInstance: getInstance
		};
	})();

})(app.models, app.repository, app.models, app.factories, app.constants);
