
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
(function(ns, repo, models, consts){
	var HotelInfoModel = function(hotelInfo){
		this.basicHotelInfo = hotelInfo.basicHotelInfo;
		this.description = hotelInfo.description;
		this.photos = hotelInfo.photos;
		this.facilities = hotelInfo.facilities;
	
		this.rooms = !$.isArray(hotelInfo.rooms) ? [] : $.map(hotelInfo.rooms, function(rawRoom){
			return new models.Room(rawRoom);
		});

		this.allReviews = $.isArray(hotelInfo.reviews) ? hotelInfo.reviews : [];
	};
	
	
	HotelInfoModel.prototype = (function(){
		return {};
	})();

	ns.HotelInfoModel = HotelInfoModel;

})(app.models, app.repository, app.models, app.constants);
