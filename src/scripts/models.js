
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
		this.score = review.score;
		this.content = review.content;
		this.cite = review.cite;
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
		this.basicHotelInfo = hotelInfo.basicHotelInfo;
		this.description = hotelInfo.description;
		this.photos = hotelInfo.photos;
		this.facilities = hotelInfo.facilities;
	
		this.rooms = !$.isArray(hotelInfo.rooms) ? [] : $.map(hotelInfo.rooms, function(rawRoom){
			return new models.Room(rawRoom);
		});

		this.allReviews = $.isArray(hotelInfo.reviews) ? hotelInfo.reviews : [];
		this.reviews = ko.observableArray();
		
		if($.isArray(hotelInfo.reviews) && hotelInfo.reviews.length){
			var pageOneReviewCount = Math.min(this.allReviews.length, consts.REVIEWS_PER_PAGE),
			pageOneRawReviews = this.allReviews.slice(0, pageOneReviewCount),
			pageOneReviews = $.map(pageOneRawReviews, function(rawReview){
				return new models.Review(rawReview);
			});
			this.reviews(pageOneReviews);
		}
	};
	
	// todo: move to proto
	// filters: object having keys pageNumber, areReviewsSorted 
	var updateReviews = function(hotelId, filters){
		if(!this.allReviews){
			return;
		}
		
		var reviews = this.allReviews.slice(0); // make a copy of all reviews
		if(filters.areReviewsSorted){
			reviews.sort(function(r1, r2){
				return r1.score - r2.score;
			});
		}
	
		var skipReviews = (filters.pageNumber-1) * consts.REVIEWS_PER_PAGE;
		var takeReviews = consts.REVIEWS_PER_PAGE;
		var newRawReviews = reviews.slice(skipReviews, skipReviews+takeReviews);
		var newReviews = $.map(newRawReviews, function(rawReview){
			return new models.Review(rawReview);
		});
		this.reviews(newReviews);
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
