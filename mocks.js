var faker = require("faker");
var fs = require("fs");
faker.locale = "en";
var mock = require('mock-fs');

console.log("hello world");

mock(
	{
		'temp': 
		{	
  			'file1.txt': 'text content',
		}
	});


//mock.restore();

if (!fs.existsSync('temp')){
	console.log("nope");
	return false;
}

if( fs.existsSync('temp/file1.txt' ))
{
	console.log("WOOO")
}

console.log("end");