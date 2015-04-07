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
	REVIEWS_PER_PAGE: 5,
	INITIAL_REVIEWS_PAGE_NO: 1,
	INITIAL_REVIEWS_SORT: false
};
