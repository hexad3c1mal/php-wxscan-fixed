var GLOBAL_LAT, GLOBAL_LONG;  // declare globals

function DataManager(){
	var $this = $(this),
		that = this;
	
	var _locations = [];

	this.locations = _locations;	
	
	this.location = function(id) { // search by lat,long string or other unique id
		return _locations.find(x => `${x.lat},${x.long}` === id);
	}
	
	this.init = function (searchString) {
		_locations[0] = new Location();
		
		$(_locations[0])
			.on('refresh', function(){ $this.trigger('refresh') })
			.on('ready',   function(){ $this.trigger('ready:main'); })
			.on('init', initLocations);
            
		_locations[0].first = true;			
		_locations[0].init(searchString);
	};
		
	function initLocations(){
        // Set globals from the first location
        GLOBAL_LAT = _locations[0].lat;
        GLOBAL_LONG = _locations[0].long;
		
		$this.trigger('allinit');	
	}
}
