var app = app || {};
app.utils = app.utils || {}; // Utils like range(5, 10) that returns [5,6,7,8,9,10].
app.models = app.models || {}; // Models like hotelInfo, Room, Reivew etc.
app.controllers = app.controllers || {}; // Controllers are identified as components that have DOM to manage in UI. Example: hotelInfo, Reviews, Pagination.
app.extensions = app.extensions || {}; // Extensions are utility components like PubSub module, Logging module, exception handling module etc.
app.eventsList = {
	reviews_page_change: 'reviews_page_change',
	sorting_reviews_change: 'sorting_reviews_change',
	hotel_info_loaded: 'hotel_info_loaded'
};
app.constants = {
	REVIEWS_PER_PAGE: 5,
	INITIAL_REVIEWS_PAGE_NO: 1,
	INITIAL_REVIEWS_SORT: false
};
