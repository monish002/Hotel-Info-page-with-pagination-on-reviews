var app = app || {};
app.models = app.models || {}; // Models like hotelInfo, Room, Reivew etc.

// TODO factory.create('PubSub', 'implV1');
app.factories = app.factories || {}; // In this piece of code, factories are used to create model instances.
app.modules = app.modules || {}; // Modules are identified as components that have DOM to manage in UI. Example: hotelInfo, Reviews, Pagination.
app.extensions = app.extensions || {}; // Extensions are utility components like PubSub module, Logging module, exception handling module etc.
app.events = {
	reviews_page_change: 'reviews_page_change',
	sorting_reviews_change: 'sorting_reviews_change'
};
app.constants = {
	reviewBlockSize: 5
};

// scripts to run on document ready
$(function(){
	app.modules.HotelInfoModule().init();
	app.modules.ReviewsModule().init();
	app.modules.PaginationModule().init();
	app.modules.ReviewsSortModule().init();
});

// PubSub module to publish and subscribe events.
// This is used for modules - ReviewsModule and PaginationModule.
// PaginationModule publishes an event whenever user clicks on another page number.
(function(ns, global){

	var PubSub = function(){};
	
	PubSub.prototype = (function(){
		var eventsRegister = {};
		function subscribe(eventName, callback, context){
			if(!$.isArray(eventsRegister.eventName)){
				eventsRegister.eventName = [];
			}
			eventsRegister.eventName.push({
				callback: callback,
				context: context
			});
		}
		function publish(eventName, data){
			if($.isArray(eventsRegister.eventName)){
				_.each(eventsRegister.eventName, function(elem){
					global.setTimeout(function(){
						elem.callback.apply(elem.context, [data]);
					}, 0);
				});
			}
		}
		return {
			subscribe: subscribe,
			publish: publish
		};
	})();

	ns.pubSub = new PubSub();
})(app.extensions, window);

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
				score: 5,
				content: 'Pellentesque ligula nibh, lacinia eget pharetra ut, vulputate vitae odio. Donec non mattis nisi. Pellentesque elit leo, tincidunt nec felis vitae, aliquet imperdiet purus. In elit ante, vestibulum non accumsan at, volutpat eget dolor. Quisque ut tincidunt elit. Curabitur rutrum dignissim enim ac aliquet. Curabitur et aliquam nisl.',
				cite: 'Malcolm Reynolds'
			},{
				score: 5,
				content: 'Pellentesque ligula nibh, lacinia eget pharetra ut, vulputate vitae odio. Donec non mattis nisi. Pellentesque elit leo, tincidunt nec felis vitae, aliquet imperdiet purus. In elit ante, vestibulum non accumsan at, volutpat eget dolor. Quisque ut tincidunt elit. Curabitur rutrum dignissim enim ac aliquet. Curabitur et aliquam nisl.',
				cite: 'Malcolm Reynolds'
			},{
				score: 1,
				content: 'Pellentesque ligula nibh, lacinia eget pharetra ut, vulputate vitae odio. Donec non mattis nisi. Pellentesque elit leo, tincidunt nec felis vitae, aliquet imperdiet purus. In elit ante, vestibulum non accumsan at, volutpat eget dolor. Quisque ut tincidunt elit. Curabitur rutrum dignissim enim ac aliquet. Curabitur et aliquam nisl.',
				cite: 'Malcolm Reynolds'
			},{
				score: 8,
				content: 'Duis ac nisi id lorem rhoncus tempus eu sit amet nisi. Aenean ultrices congue ligula, ac molestie velit ultricies a. Nulla ac nunc et nisi placerat interdum sit amet ut erat. Integer vulputate nulla id orci cursus, eget ullamcorper justo ultricies. Nulla lorem dui, euismod non porttitor eu, sagittis in lacus. In suscipit lectus non viverra luctus. Pellentesque egestas, dolor at luctus eleifend, velit dui viverra risus, ac rutrum sapien ante at massa. Donec imperdiet consequat laoreet.',
				cite: 'Zoe Washburne'
			}],
			reviewsTotalCount: 25
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
		var stubReview = function(){
			return {
				score: Math.floor(Math.random()),
				content: 'Pellentesque ligula nibh, lacinia eget pharetra ut, vulputate vitae odio. Donec non mattis nisi. Pellentesque elit leo, tincidunt nec felis vitae, aliquet imperdiet purus. In elit ante, vestibulum non accumsan at, volutpat eget dolor. Quisque ut tincidunt elit. Curabitur rutrum dignissim enim ac aliquet. Curabitur et aliquam nisl.',
				cite: 'Malcolm Reynolds'
			};
		};

		var stubbedReviews = [];
		_.each(new Array(options.take), function(){
			stubbedReviews.push(stubReview());
		});
		return $.when(stubbedReviews);
	};
	
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
	var updateReviews = function(hotelId, pageNum){
		var self = this;
		repo.getReviews(hotelId, {
			skip: pageNum * consts.reviewBlockSize,
			take: consts.reviewBlockSize
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

// Pagination model
(function(ns, _, factories, models, extensions, events){
	function Pagination(pageCount){
		this.selectedPageNumber = ko.observable(1); // initial page selected is 1
		this.pageCount = pageCount;
	};
	
	Pagination.prototype = (function(){
		var getSelectedPage = function(){
			return this.selectedPageNumber();
		};
		var setSelectedPage = function(pageNum){
			if(pageNum == this.selectedPageNumber()){
				return;
			}
			extensions.pubSub.publish(events.reviews_page_change, {
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
			pageNumbers: pageNumbers
		};
	})();
	
	factories.paginationModel = (function(){
		var getInstance = function(pageCount){
			if(!this.pagiModel){
				this.pagiModel = new models.Pagination(pageCount);
			}
			return this.pagiModel;
		};
		return {
			getInstance: getInstance
		};
	})();
	
	ns.Pagination = Pagination;
})(app.models, _, app.factories, app.models, app.extensions, app.events);

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
})(app.modules, app.repository, $, app.models.Review, app.extensions.pubSub, app.factories, app.events);

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
				var pageCount = Math.floor((hotelInfoModel.reviewsTotalCount + consts.reviewBlockSize - 1)/consts.reviewBlockSize);
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
(function(ns, repo, $, factories, consts, extensions, events){
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
			extensions.pubSub.publish(events.sorting_reviews_change, {
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
})(app.modules, app.repository, $, app.factories, app.constants, app.extensions, app.events);

