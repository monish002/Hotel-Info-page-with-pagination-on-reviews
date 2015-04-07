// PubSub module to publish and subscribe events.
// This is used for modules - ReviewsModule and PaginationModule.
// PaginationModule publishes an event whenever user clicks on another page number.
(function(ns, global){

	var PubSub = function(){
		this.eventsRegister = {};
	};
	
	// Singleton
	var _instance = null;
	var getPubSubRef = function(){
		if(!_instance){
			_instance = new PubSub();
		}
		return _instance;
	};

	PubSub.prototype = (function(){
		// pub sub implementation
		function subscribe(eventName, callback, context){
			console.log('Event subscribed: ' + eventName + '\nData: ' + JSON.stringify(context));
			if(!$.isArray(this.eventsRegister.eventName)){
				this.eventsRegister.eventName = [];
			}
			this.eventsRegister.eventName.push({
				callback: callback,
				context: context
			});
		}
		function publish(eventName, data){
			console.log('Event published: ' + eventName + '\nData: ' + JSON.stringify(data));
			if($.isArray(this.eventsRegister.eventName)){
				_.each(this.eventsRegister.eventName, function(elem){
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
	
	ns.PubSub = PubSub;
	ns.getPubSubRef = getPubSubRef;
})(app.extensions, window);
