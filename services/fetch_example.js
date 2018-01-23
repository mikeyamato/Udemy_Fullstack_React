// this is not part of the app
// just reconfiguring promises with es2017 syntax

// purpose is to write a function to retrieve a blob of json.
// in other words, make an ajax request
// use the 'fetch()' function

// we'll need a URL with a json file. let's use
// http://rallycoding.herokuapp.com/api/music_albums

// since we are fetching albums, we'll name our function 'fetchAlbums'
function fetchAlbums() {
	// use the 'fetch' api to make a request to our route
	// 'fetch' returns a promise. that promise is resolved with an 
	// object that represents the underlying request.
	// to get notification/callback that the promise has been resolved
	// we chain on a '.then' statement  
	fetch('http://rallycoding.herokuapp.com/api/music_albums')
	// '.then' will be called with the request coming from the original 
	// 'fetch' call. we receive this as an argument called 'res'
	// to read the json data from the api we make a call ('res.json()').
	// this returns a promise of its own that is resolved after the json
	// in the request is ready for us to work with.
	.then(res => res.json())
	// chain on another '.then' that will be called with the json data 
	// we care about. we can do whatever we want with the data now. 
	// we'll just console.log it for now
	.then(json => console.log(json));
}

// under the function declaration call the function
fetchAlbums();

// to test this out go to the browser tab with the album and copy and 
// paste this into the console and run it. what returns is a list of albums

function fetchAlbums() {
	fetch('http://rallycoding.herokuapp.com/api/music_albums')
	.then(res => res.json())
	.then(json => console.log(json));
}

fetchAlbums();
