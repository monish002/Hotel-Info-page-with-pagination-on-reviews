// scripts to run on document ready
$(function(){
	app.controllers.ReviewsController().init();
	app.controllers.PaginationController().init();
	app.controllers.ReviewsSortController().init();
	app.controllers.HotelInfoController().init();
});