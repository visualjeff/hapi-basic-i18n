[![Build Status](https://travis-ci.org/visualjeff/hapi-basic-i18n.png)](https://travis-ci.org/visualjeff/hapi-basic-i18n)
[![bitHound Overall Score](https://www.bithound.io/github/visualjeff/hapi-basic-i18n/badges/score.svg)](https://www.bithound.io/github/visualjeff/hapi-basic-i18n)
[![bitHound Dependencies](https://www.bithound.io/github/visualjeff/hapi-basic-i18n/badges/dependencies.svg)](https://www.bithound.io/github/visualjeff/hapi-basic-i18n/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/visualjeff/hapi-basic-i18n/badges/devDependencies.svg)](https://www.bithound.io/github/visualjeff/hapi-basic-i18n/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/visualjeff/hapi-basic-i18n/badges/code.svg)](https://www.bithound.io/github/visualjeff/hapi-basic-i18n)

##hapi-basic-i18n-accept-language

* npm install hapi-basic-i18n-accept-language --save
* npm install accept-language-parser --save 

* Plugin options w/ registration;

	```js
	server.register([
    {
        register: require("hapi-basic-i18n-accept-language"),
        options: {
			locale_path: "<absolutePath>",
			cookie_name: "language",
			default_language: "EN",
			available_languages: ["EN"]
        }
    }], cb);
    
   ```

* In view context:

	```js
	{{i18n "wtf"}}
	```

* In route handler:

	```js
	function(request, reply) {
		reply(request.i18n("wtf"));
	}
	```




* Simply

	```js
	// en.js
	module.exports = {
		"Hello": "Hello {0}!",
	};
	
	// in route handler
	console.log(request.i18n("Hello", "John"));
	
	// in view 
	{{i18n "Hello" "John"}}
	
	// Both outputs are "Hello John!"
	```
	
	


