// Get Sunrise and Sunset, Needed for Icons
// This won't work after 24 hours pass, but who gives a shit
var GLOBAL_SUNRISE, GLOBAL_SUNSET;
function fetchSunTimes() {
    if (typeof GLOBAL_LAT !== "undefined" && typeof GLOBAL_LONG !== "undefined") {
        $.getJSON(`https://api.sunrise-sunset.org/json?lat=${GLOBAL_LAT}&lng=${GLOBAL_LONG}&formatted=0`, function(data) {
            GLOBAL_SUNRISE = new Date(data.results.civil_twilight_begin);
            GLOBAL_SUNSET = new Date(data.results.civil_twilight_end);
        });
    } else {
        setTimeout(fetchSunTimes, 100);
    }
}
fetchSunTimes();

//  Fisher-Yates shuffle
function shuffle (array) {
	var i = 0,
	    j = 0,
	    temp = null;

	for (i = array.length - 1; i > 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1));
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	
	return array;
}

// Add this helper function at the top of the file or in a utility script
function mapWMOtoText(code) {
    const mapping = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        66: 'Light freezing rain', 67: 'Heavy freezing rain',
        71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
        85: 'Slight snow showers', 86: 'Heavy snow showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };
    return mapping[code] || 'N/A';
}

function mapWMOtoIcons(code) {
    return getCCicon(code)
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}


function getNextHighestIndex(arr, value) {
    var i = arr.length;
    while (arr[--i] > value);
    return ++i; 
}


function getUrlParameter(e) {
	return decodeURI((new RegExp(e + "=(.+?)(&|$)").exec(location.search) || [, null])[1])
}


		
// convert celsius to farenheight
function C2F(c){
	return Math.round( c * 9 / 5 + 32 );
}


// meters per second to mph
function mps2mph(meters) {
	return Math.round(  parseFloat(meters) * 2.23694 );
}
	

// array swap
Array.prototype.swap = function(a,b){ var tmp=this[a];this[a]=this[b];this[b]=tmp;};

	
function degToCompass(deg){
    val = Math.round((deg/22.5)+.5);
    arr=["N","NE","E","SE","S","SW","W","NW"];
    return arr[(val % 8)];
}
	


function distance(lat1, lon1, lat2, lon2) {
	var radlat1 = Math.PI * lat1/180,
		radlat2 = Math.PI * lat2/180,
		theta = lon1-lon2,
		radtheta = Math.PI * theta/180,
		dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	return dist;
}


function dewPoint(tem, r){
    tem = -1.0*(tem-32)*5/9	;
    es = 6.112*Math.exp(-1.0*17.67*tem/(243.5 - tem));
    ed = r/100.0*es;
    eln = Math.log(ed/6.112);
    td = -243.5*eln/(eln - 17.67 );
    return Math.round( (td*9/5)+32 );	
}

function heatIndex(T, R) { // T = temp, R = relative humidity
	var T2 = T*T, R2= R*R,
		c1 = -42.379, c2 = 2.04901523, c3 = 10.14333127,
		c4 = -0.22475541, c5 = -6.83783*Math.pow(10,-3), c6 = -5.481717*Math.pow(10,-2),
		c7 = 1.22874*Math.pow(10,-3), c8 = 8.5282*Math.pow(10,-4), c9 = -1.99*Math.pow(10,-6);
		
	return Math.round(c1 + c2*T + c3 *R + c4*T*R + c5*T2 + c6*R2 + c7*T2*R + c8*T*R2 + c9*T2*R2);
}


// maps current condition code to icon
// maps WMO weather code to icon
function getCCicon(wmoCode) {
    const map = {
        0: [26, 25],
        1: [28, 27],
        2: [28, 27],
        3: [22, 21],
        45: [15, 15],
        48: [15, 15],
        51: [8, 8],
        53: [8, 8],
        55: [8, 8],
        61: [7, 7],
        63: [7, 7],
        65: [5, 5],
        71: [10, 10],
        73: [10, 10],
        75: [11, 11],
        80: [7, 7],
        81: [5, 5],
        82: [5, 5],
        85: [10, 10],
        86: [11, 11],
        95: [1, 1],
        96: [1, 1],
        99: [1, 1]
    };

    const nightMap = {
        21: 22,
        22: 21,
        23: 24,
        24: 23,
        25: 26,
        26: 25,
        27: 28,
        28: 27,
        30: 35,
        32: 36,
        29: 37
    };

    const icons = map[wmoCode] || [22, 21];

    const now = new Date();
    const isNight = now < GLOBAL_SUNRISE || now > GLOBAL_SUNSET;

    let iconToUse = icons[0];
    if (isNight && nightMap[icons[0]]) {
        iconToUse = nightMap[icons[0]];
    }

    return ['images/icons/' + ('0' + iconToUse).slice(-2) + '.png'];
}



// https://date-fns.org/docs/Getting-Started

