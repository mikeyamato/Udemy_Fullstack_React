// to refactor the following with es2017 syntax to make using promises
// easier

function fetchAlbums() {
	fetch('http://rallycoding.herokuapp.com/api/music_albums')
	.then(res => res.json())
	.then(json => console.log(json));
}

fetchAlbums();

// ********************************************************************

// the new syntax is called 'async await'. it is to be used with any 
// asynchronous code in a function
// step 1. identify the function with async code. for us we only have 
// one function and it is async. put the 'async' keyword in front of 
// the function declaration. this tells our js interpreter that the 
// function contains asynchronous code
// step 2. identify all the promises created within the function.
// for us we have 2 promises. one when calling 'fetch' and the other
// when calling 'res.json()'. in front of each of these add the 'await'
// keyword. for 'res.json()' remove everything but 'res.json()'.
// setp 3. assign a resolve value of 'fetch' and 'json' to intermediary 
// values. in front of 'await fetch', place 'const res ='.
// step 4. refactor to look synchronous in nature. remove the last part
// and just 'console.log(json)'
async function fetchAlbums() {
	const res = await fetch('http://rallycoding.herokuapp.com/api/music_albums')
	const json = await res.json()
	console.log(json);
}

fetchAlbums();

// ********************************************************************

// the function declaration can be further refactored for use with arrow 
// functions
const fetchAlbums = async () => {
	const res = await fetch('http://rallycoding.herokuapp.com/api/music_albums')
	const json = await res.json()
	console.log(json);
}

fetchAlbums();
