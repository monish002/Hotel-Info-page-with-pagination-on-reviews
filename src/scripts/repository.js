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
	//				  It defaults to app.constants.REVIEWS_PER_PAGE
	var getReviews = function(hotelId, options){
		if(!options.take){
			options.take = app.constants.REVIEWS_PER_PAGE;
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
