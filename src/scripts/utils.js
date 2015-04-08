(function(ns){
	/// takes 2 numbers as params such that start <= end.
	/// returns array containing numbers from start till end.
	ns.range = function(start, end){
		var result = [], current = start;
		while(current <= end){
			result.push(current++);
		}
		return result;
	}
})(app.utils);