var app = app || {};
app.models = app.models || {}; // Models like hotelInfo, Room, Reivew etc.
app.factories = app.factories || {}; // In this piece of code, factories are used to create model instances.
app.modules = app.modules || {}; // Modules are identified as components that have DOM to manage in UI. Example: hotelInfo, Reviews, Pagination.
app.extensions = app.extensions || {}; // Extensions are utility components like PubSub module, Logging module, exception handling module etc.
app.constants = {
	reviewBlockSize: 5
};

// scripts to run on document ready
$(function(){
	app.modules.hotelInfoModule.init();
	app.modules.reviewsModule.init();
	app.modules.paginationModule.init();
});

// PubSub module to publish and subscribe events.
// This is used for modules - ReviewsModule and PaginationModule.
// PaginationModule publishes an event whenever user clicks on another page number.
(function(ns){

	var PubSub = function(){};
	
	PubSub.prototype = (function(){
		var register = {};
		function subscribe(eventName, callback, context){
			if(!$.isArray(register.eventName)){
				register.eventName = [];
			}
			register.eventName.push({
				callback: callback,
				context: context
			});
		}
		function publish(eventName, data){
			if($.isArray(register.eventName)){
				_.each(register.eventName, function(elem){
					elem.callback.apply(elem.context, [data]);
				});
			}
		}
		return {
			subscribe: subscribe,
			publish: publish
		};
	})();

	ns.pubSub = new PubSub();
})(app.extensions);

// Proposed JSON structure from API
// Repository module that takes care of fetching data from data source
(function(ns, $){
	var getHotelInfo = function(hotelId){
		// mocked API response 
		return $.when({
			basicHotelInfo: {
				id: hotelId,
				name: 'Hotel Fantastique',
				address: '72b Rue de Awesome, 75001, Paris, France',
				stars: 4
			},
			description: [
				'Located in the heart of Paris, this 5-star hotel offers elegant guest rooms in a Hausmannian-style building. It features a fitness centre, a concierge and a tour desk with ticket service.',
				'Decorated in a unique style, the air-conditioned guest rooms at the Hotel du Louvre are equipped with satellite TV, a minibar and free Wi-Fi access. Some rooms feature a seating area. All rooms have a private bathroom, some include marble features.',
				'The hotel restaurant, Brasserie du Louvre, has a traditional Parisian decor and serves traditional French cuisine. A buffet breakfast is served every morning. Guests can also enjoy a cocktail and jazz evenings twice a week in the Defender Bar.',
				'The 4 facades and terrace of this hotel overlook the famous Louvre Museum, the Opéra Garnier and the Comédie Française theatre.',
				'Hotel du Louvre is situated 2 minutes from Palais Royal Metro Station, providing direct access to the Champs Elysees and the Place de la Bastille. Public parking is available nearby.'
			],
			photos: [{
				large: 'img/1_large.jpg',
				thumb: 'img/1_thumb.jpg',
				description: 'description of photo 1'
			},{
				large: 'img/3_large.jpg',
				thumb: 'img/3_thumb.jpg',
				description: 'description of photo 2'
			}],
			facilities: ['Free Wifi', 'Swimming Pool', 'Gym', 
				'24/7 reception', 'Concierge', 'Restaurant',
				'Free Parking', 'Shoe-Shine', 'Satellite TV', 
				'Room Service'
			],
			rooms: [{
				name: 'Basic 2 Bed',
				occupancy: 2,
				price: 88.99,
				currencySymbol: '€',
				availableRoomCount: 5
			},{
				name: 'Basic Family Room',
				occupancy: 4,
				price: 98.99,
				currencySymbol: '€',
				availableRoomCount: 5
			},{
				name: 'Deluxe 2 Bed',
				occupancy: 2,
				price: 109.99,
				currencySymbol: '€',
				availableRoomCount: 5
			}],
			reviews: [{
				score: 5,
				content: 'Pellentesque ligula nibh, lacinia eget pharetra ut, vulputate vitae odio. Donec non mattis nisi. Pellentesque elit leo, tincidunt nec felis vitae, aliquet imperdiet purus. In elit ante, vestibulum non accumsan at, volutpat eget dolor. Quisque ut tincidunt elit. Curabitur rutrum dignissim enim ac aliquet. Curabitur et aliquam nisl.',
				cite: 'Malcolm Reynolds'
			},{
				score: 8,
				content: 'Duis ac nisi id lorem rhoncus tempus eu sit amet nisi. Aenean ultrices congue ligula, ac molestie velit ultricies a. Nulla ac nunc et nisi placerat interdum sit amet ut erat. Integer vulputate nulla id orci cursus, eget ullamcorper justo ultricies. Nulla lorem dui, euismod non porttitor eu, sagittis in lacus. In suscipit lectus non viverra luctus. Pellentesque egestas, dolor at luctus eleifend, velit dui viverra risus, ac rutrum sapien ante at massa. Donec imperdiet consequat laoreet.',
				cite: 'Zoe Washburne'
			}],
			reviewCount: 25
		});
	};
	
	// makes an API call to get reviews
	// hotelId - hotelId for which review are to be fetched
	// options.skip - how many reviews to skip.
	//				  It defaults to zero.
	// options.take - how many reviews to return if they exist. 
	//				  It defaults to app.constants.reviewBlockSize
	var getReviews = function(hotelId, options){
		if(!options.take){
			options.take = app.constants.reviewBlockSize;
		}
		if(!options.skip){
			options.skip = 0;
		}

		// mocked API response
		var stubReview = {
			score: 5,
			content: 'Pellentesque ligula nibh, lacinia eget pharetra ut, vulputate vitae odio. Donec non mattis nisi. Pellentesque elit leo, tincidunt nec felis vitae, aliquet imperdiet purus. In elit ante, vestibulum non accumsan at, volutpat eget dolor. Quisque ut tincidunt elit. Curabitur rutrum dignissim enim ac aliquet. Curabitur et aliquam nisl.',
			cite: 'Malcolm Reynolds'
		};
		var stubbedReviews = [options.take];
		_.each(stubbedReviews, function(){
			stubbedReviews.push(stubReview);
		});
		return $.when(stubbedReviews);
	}	
	
	ns.repository = {
		getHotelInfo: getHotelInfo,
		getReviews: getReviews
	};
})(app, $);

// Room model
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

// Review model
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
(function(ns, repo, models, factories){
	var HotelInfoModel = function(hotelInfo){
		var keys = ['basicHotelInfo', 'description', 'photos', 'facilities', 'reviewCount'];
		_.extend(this, _.chain(hotelInfo).pick(keys).value());
	
		this.rooms = !$.isArray(hotelInfo.rooms) ? [] : _.map(hotelInfo.rooms, function(rawRoom){
			return new models.Room(rawRoom);
		});
		
		var rawReviews = !$.isArray(hotelInfo.reviews) ? [] : _.map(hotelInfo.reviews, function(rawReview){
			return new models.Review(rawReview);
		});
		this.reviews = ko.observableArray(rawReviews);
	};
	
	var updateReviews = function(reviews){
		this.reviews(reviews);
	};
	
	HotelInfoModel.prototype = (function(){
		return {
			updateReviews: updateReviews
		};
	})();

	ns.HotelInfoModel = HotelInfoModel;

	factories.hotelInfo = (function(){
		var hotelInfoModel;
		var getInstance = function(hotelId, callback, context){
			if(hotelInfoModel && hotelInfoModel.basicHotelInfo && hotelInfoModel.basicHotelInfo.id === hotelId){
				callback(hotelInfoModel);
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

})(app.models, app.repository, app.models, app.factories);

// Pagination model
(function(ns, _, factories, models){
	function Pagination(pageCount){
		this.selectedPageNumber = 1;
		this.pageCount = pageCount;
	};
	
	Pagination.prototype = (function(){
		var getSelectedPage = function(){
			return this.selectedPageNumber;
		};
		var setSelectedPage = function(pageNum){
			pubSub.publish('reviews_page_change', {
				newValue: pageNum,
				oldValue: this.selectedPageNumber
			});
			this.selectedPageNumber = pageNum;
		};
		var pageNumbers = function(){
			return _.range(this.pageCount);
		};
		return {
			getSelectedPage: getSelectedPage,
			setPage: setSelectedPage,
			pageNumbers: pageNumbers
		};
	})();
	
	factories.paginationModel = (function(){
		var getInstance = function(){
			if(!this.pagiModel){
				this.pagiModel = new models.Pagination(20);
			}
			return this.pagiModel;
		};
		return {
			getInstance: getInstance
		};
	})();
	
	ns.Pagination = Pagination;
})(app.models, _, app.factories, app.models);

// Hotel info module to manage hotel related content (this exclues reviews)
(function(ns, repo, $, factories){
	var init = function(){

		// TODO: get hotelId from URL. 
		// For now, setting it to 123 as mock hotel id.
		var hotelId = 123; 

		factories.hotelInfo.getInstance(hotelId, function(hotelInfoModel){
			ko.applyBindings(hotelInfoModel, $('#hotelInfo')[0]);
		});
	};
	
	ns.hotelInfoModule = {
		init: init
	};
})(app.modules, app.repository, $, app.factories);

// reviews module
(function(ns, repo, $, Review, pubSub, factories){
	var updateReviews = function(pageNumbers){

		// TODO: get hotelId from URL. 
		// For now, setting it to 123 as mock hotel id.
		var hotelId = 123; 

		factories.hotelInfo.getInstance(hotelId, function(hotelInfoModel){
			hotelInfoModel.updateReviews(pageNumbers.newValue);
		});
	};
	var init = function(){
		pubSub.subscribe('reviews_page_changed', updateReviews);

		// TODO: get hotelId from URL. 
		// For now, setting it to 123 as mock hotel id.
		var hotelId = 123; 

		factories.hotelInfo.getInstance(hotelId, function(hotelInfoModel){
			ko.applyBindings(hotelInfoModel, $('#reviews_section')[0]);
		});
	};
	ns.reviewsModule = {
		init: init
	};
})(app.modules, app.repository, $, app.models.Review, app.extensions.pubSub, app.factories);

// pagination module
(function(ns, repo, $, factories){
	var init = function(){
		//ko.applyBindings(factories.paginationModel.getInstance(), $('reviews_pagination')[0]);
	};
	
	ns.paginationModule = {
		init: init
	};
})(app.modules, app.repository, $, app.factories);
