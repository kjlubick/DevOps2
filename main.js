var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var faker = require("faker");
var fs = require("fs");
faker.locale = "en";
var mock = require('mock-fs');

var mockDir = "testPath";
var mockFile = "testFile";
var dirDoesNotExist = "doesnotexist";
var fileDoesNotExist = "stillDoesNotExist";
var mockEmptyFile = "emptyFile";

function main()
{
	var args = process.argv.slice(2);

	if( args.length == 0 )
	{
		args = ["subject.js"];
	}
	var filePath = args[0];

	constraints(filePath);

	generateTestCases()

}


function fakeDemo()
{
	console.log( faker.phone.phoneNumber() );
	console.log( faker.phone.phoneNumberFormat() );
	console.log( faker.phone.phoneFormats() );
}

fakeDemo();

var functionConstraints =
{
}

function generateTestCases()
{

	var content = "var subject = require('./subject.js');\n";

	var mockOptions = {testPath:{testFile:'text content', emptyFile:''}};


	content += "var mock = require('mock-fs');mock(" + JSON.stringify(mockOptions)+");\n";
	content += "var testPath = 'testPath';";
	content += "var testFile ='testFile';";
	content += "var doesnotexist = 'doesnotexist';";
	content += "var stillDoesNotExist = 'stillDoesNotExist';";
	content += "var emptyFile = 'emptyFile';\n";

	for ( var funcName in functionConstraints )
	{
		var paramList = [];

		var permutes = 1;
		var permuteCounters = [];
		// initialize params
		for (var i =0; i < functionConstraints[funcName].params.length; i++ )
		{
			var paramName = functionConstraints[funcName].params[i];
			//params[paramName] = '\'' + faker.phone.phoneNumber()+'\'';
			//params[paramName] = "''";
			paramList.push(paramName);
			var num = functionConstraints[funcName].constraints[paramName].length;
			permuteCounters.push({ max: num, current:0});
			permutes *= num;
			
		}
		
		var constraints = functionConstraints[funcName].constraints;
		console.log("constraints");
		console.log(constraints);

		//console.log("params:");
		//console.log( params );
		console.log("Permutes: "+permutes);

		// update parameter values based on known constraints.
		outer:
		while (true) {
			
			console.log(JSON.stringify(permuteCounters));
			
			var args = "";
			for( var c = 0; c < permuteCounters.length; c++) {
				if (c != 0) {
					args+=",";
				}
				args += constraints[paramList[c]][permuteCounters[c].current];
			}
			content += "subject.{0}({1});\n".format(funcName, args );
			
			permuteCounters[0].current++;
			for( var d = 0; d < permuteCounters.length; d++) {
				if (permuteCounters[d].current >= permuteCounters[d].max) {
					if (d == permuteCounters.length - 1) {
						break outer;
					}
					permuteCounters[d].current = 0;
					permuteCounters[d+1].current++;
				} else {
					break;	//go again
				}
			}
		}

		/*for( var c = 0; c < functionConstraints[funcName].constraints.length; c++ )
		{
			var constraint = functionConstraints[funcName].constraints[c];

			if( params.hasOwnProperty( constraint.ident ) )
			{

				params[constraint.ident] = constraint.value;
			}
		}

		// Prepare function arguments.
		var args = Object.keys(params).map( function(k) {return params[k]; }).join(",");

		// Emit test case.
		content += "subject.{0}({1});\n".format(funcName, args );
	*/
	}

	content += "\nmock.restore()";

	fs.writeFileSync('test.js', content, "utf8");

}

function constraints(filePath)
{
   var buf = fs.readFileSync(filePath, "utf8");
	var result = esprima.parse(buf, options);

	traverse(result, function (node) 
	{
		if (node.type === 'FunctionDeclaration') 
		{
			var funcName = functionName(node);
			console.log("Line : {0} Function: {1}".format(node.loc.start.line, funcName ));

			var paramConstraints = {};

			var params = node.params.map(function(p) {
				var constraints = ["''"];		//defaults for everybody
				
				
				
				if (p.name == "dir") {
					constraints.push( mockDir);
				}
				if (p.name == "filePath") {
					constraints.push( mockDir + '+"/"+'+mockFile);
					constraints.splice(constraints.indexOf("''"),1);
				}
				
				
				paramConstraints[p.name] = constraints;
				
				return p.name;
			});


			functionConstraints[funcName] = {constraints:paramConstraints, params: params};


			// Check for expressions using argument.
			traverse(node, function(child)
			{
				if( child.type === 'BinaryExpression' && child.operator == "==")
				{
					if( child.left.type == 'Identifier' && params.indexOf( child.left.name ) > -1)
					{
						// get expression from original source code:
						//var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1]);
						var constraints = functionConstraints[funcName].constraints[child.left.name];
						if (constraints.indexOf(rightHand) == -1){
							constraints.push(rightHand);
						}
						
						//todo less than, greater than, etc
						
					}
				}
			});

			console.log( functionConstraints[funcName]);

		}
	});
}

function traverse(object, visitor) 
{
    var key, child;

    visitor.call(null, object);
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function traverseWithCancel(object, visitor)
{
    var key, child;

    if( visitor.call(null, object) )
    {
	    for (key in object) {
	        if (object.hasOwnProperty(key)) {
	            child = object[key];
	            if (typeof child === 'object' && child !== null) {
	                traverseWithCancel(child, visitor);
	            }
	        }
	    }
 	 }
}

function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "";
}


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

main();