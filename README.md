# React Doc Valid  Document validation system using redux

v 1.0.6
  Added huge improvements, moved validation main method to validate service 
  
v 1.0.5
 Made huge improvements, added processed files report, move columns config to table-columns-config 
 
v 1.0
 Base init stable application


##  How to install

```bash
# Install dependencies
cd reactdocvalid
npm install
```

Main plot
 Uses classical redux pattern, with store and reducers.
 Uses axios for backend http client to get backend movies information.
 
## How to test
Currently using react-scripts build-in test tool based on jest with test help of enzyme.
Tests are commonly spread among component folders 
Exm. utils tests are in folder  utils/test this way, in my opinion, is more comfortable for importing 
required files

cmd -> npm run test

 
## How to run

### The backend serve
Backend data is coming from validation http server

## To view online
http://norwaydict.com/reactdocvalid
  Click on any link in the page 
  (it will for now mask as norwaydict main site hrefs, but it works as expected)
  

```bash
npm start
This will run the client at localhost:3000
 Check the page in desired Browser

 Best viewed in Firefox, Chrome

 # Table libraries
 CSS  Semantic UI for headers, messages like Loading, Error no data
      Bootstrap 4 for table component and override component
	  
	Plot
   Uses redux pattern.
   Consists of components: list 
   And actions with reducers
   
     Libraries: 
	  react-bootstrap
	  react-bootstrap-table 2 for table 
	  axios - http client
      react-redux - redux helpers
	  node-sass - sass
	  sass-loader
	  semantic-ui-css - similar to boostrap
	  sweet-alert - component to show beautiful alert dialogs
   
     Scheme:  
	   Contents
	    pages - pages of application
	    actions - redux signals that help call other components
	    components - required for pages components
		types - enums, lists, constants
	    reducers - redux building blocks of handling state change with business logic
	    utils - utility classes like date parser, object handler
		validate - service for validation using client that get validation status from server
		App.js - main page declaration and volume toggle
	    store.js - redux store
	    index.js - starting point whole application
	    setupTests - setuo enzyme adapter
		tests are spread among folders 
		
		App ->  document-list (handles movies (popular) list using react-bootstrap-table 2)) 
		        it uses component server-pagination that handles pagination and pagination will
			    request any other page from  server	
                also some utility classes are used like data parser to format date.
				
				By pressing Validate you also add documents to history of processed documents.
				You switch between Full list and History list by pressing Full / Files History buttons.
				
				You also can adjust width, so in mobile app looks good.
				To Validate All files in current page you need to press Validate All button.
				  
		        Currently application validate all feature runs in semi-queue method, where validateDocument
			      fires sequencely after [n] time.
				  

  Enjoy the app and do call if you have some feedback. 
  Thanks for the task!
  



