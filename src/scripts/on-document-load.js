// scripts to run on document ready
$(function(){
	app.modules.ReviewsModule().init();
	app.modules.PaginationModule().init();
	app.modules.ReviewsSortModule().init();
	app.modules.HotelInfoModule().init();
});