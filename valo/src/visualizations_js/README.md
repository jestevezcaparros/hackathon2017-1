# Visualization

...


## 1. A quick introduction

This project collects geolocation points from Valo which are emitted from the mobile [app](https://github.com/ITRS-Group/hackathon2017/tree/master/valo/src/mobile_app_js/ValoExample) and then renders them on an interactive real time map. Using this experimental app will allow you to visualize and track attendees as they move across "La Termica" zone.

![](https://github.com/ITRS-Group/hackathon2017/blob/ref/viz/valo/src/visualizations_js/docs/assets/preview.gif)


### That's too cool: how can I run it on my laptop?!

---
**TODO**
Instructions:
* env config (e.g. npm, node, twitter API etc)
* git clone

---

Before you start, just make sure your local setup includes [node](https://nodejs.org/en/) (version >=6) and your favorite IDE/editor. That should be enough, so easy!


- Clone this Github repository: `git clone https://github.com/ITRS-Group/hackathon2017.git`
- Install local dependencies and run the project launcher script: `cd hackathon2017 && npm run launch:viz`

After running last command, your default browser should opens up displaying the map. Otherwise, something might have failed on steps above. Please talk to an organizer for help.
### Need some data to show?

Instructions:

* simulators list, command, description etc

### Replay?

TODO
> ?replay

## 2. Let's get technical

A list of terms:

* **DAO**:   
A DAO (**Data Access Object**) is an object that provides an abstract interface to some type of database or other persistence mechanism. In our case, we identify as a DAO all those JS modules whose first task is to retrieve data from Valo streams.

* **VO**:  
A VO (**Value Object**) is a small object that represents a simple entity. In our case, we identify as a Value Object all those entities (classes or objects) that represent a piece of our data (e.g. a point in the map, a tweet).


### Frontend overview

This is a simple diagram that describes the visualization frontend architecture:

![MacDown logo](https://github.com/ITRS-Group/hackathon2017/blob/ref/viz/valo/src/visualizations_js/docs/assets/frontend_architecture.gif)

In general, we will want to implement some kind of visualization, and we will need some data from Valo in order to do it. We defined a standard flow, for the sake of simplicity, so that it will be easier for you to start playing with the code:

1. the main JS file will ask for the data to a specific DAO
2. The DAO will run some type of Valo Query ([Valo queries documentation](https://valo.io/docs/current/Valo/reference/queries/query_links.htm))
3. Valo will send some data back to the frontend code
4. That row data will be transformend into a valid VO
5. which will be passed to a UI Component (e.g. a line chart) in order to be visualised

In our webpage example, you have seen three different kinds of visualization:

* Attenders (position and happiness): the little footsteps and smiles
* IOT boards temperature: the thermometers
* Twitter stream: the overlay with the last **#jotb** tweet

Let's take a closer look the last one, the **Tweets visualization**.

### An example: Tweets visualization

Once the enviroment has been configured, our Valo instance will have a specific *stream* to which tweets will be posted in real time by our twitter collector process (TODO link to simulator instructions etc).

Following the flow we described in the previous chapter, we have a specific **DAO**, a specific **VO** and a specific **UI Component** for this use case:

* `visualization_js/`
	* `src/`
		* `dao/`
			* `twitter_dao.js`:  
			here we define Valo queries for twitter stream, and expose the methods to run them used by other components (the DAO API basically): this way, we know that **all the Valo data retrival logic related to the Tweets visualization is contained in this file**.
		* `vo/`
			* `tweet.js`:  
			here we define the `Tweet` class, and the factory method `createTweet(valoPayload)` that transforms a Valo twitter stream item into a Tweet class instance. This way we know that in our visualization **we only deal with Tweet class instances**, and that any **data received from the Valo twitter stream will go through this file before being used in our code**.  

	   * `components/`
			* `tweet_box.js`:  
			this is the UI component in charge of visualising our tweets, that in this case is basically an overlay that shows the last received tweet. We defined it as an **ES6 module** with a single method, `show(tweett)`, but depending on the visualization the **API** may as complex as needed, still **remaining incapsulated in this module**.

Let's see the three files implementation a bit more in details.
#### - Data retrival (DAO): `twitter_dao.js`

> Check VALO JS SDK paragraph


#### - Entities (VO): `tweet.js`

In this file we define a simple class that represents a single Tweet:

```
class Tweet {
   constructor(fields) {
   		this.text = fields.text;
     	this.followers_count = fields.followers_count;
     	this.profile_image_url_https = fields.profile_image_url_https;
     	// ...    
   }
 }
```

What's this for? We are basically defining an **interface**, as this is the object that our Tweet visualization implementation should be able to manipulate.

We also define a simple factory function:

```
export function createTweet( valoPayload ){

	// convert raw data into a Tweet instance
   return new Tweet( valoPayload );
}
```

This specific example is not really meaningful, but the idea is that we use this utility with the raw data received from Valo, in order to transform it in a consistent and standard object we can deal with in the rest of our code.

The interesting bit is that it's a hook to perform other interesting stuff, depending on the specific data and visualization:

1. *payload validation*: we may want to have default values for a Tweet, or create new fields depending on others
2. *payload manipulation*: we may want to convert a datetime field taking into account the user locale, or convert a numerical value into a 0% to 100% one
3. *logging*: we may want to log the data we receive
4. ...

We also separate the logical operation of creating a new Tweet object from the implementation itself: we are using the `new ClassName()` way, but if we needed to switch to another paradigm (e.g. object literals), we can do it without affecting the consumers of the `createTweet(...)` function: this is the only way we should be able to get new Tweet object (e.g. we can add another factory function that return a new empty Tweet, if needed).

#### - Visualization (UI Component): `tweet_box.js`

This is the scaffolding for a general visualization (but it's not the only one, that's totally up to you!):


```
// with this specific implementation, the idea is that when we create a new visualization
// we pass the DOM element container to the visualization itself, in order to specify where
// we want it to appear
export default function(domElement) {

	// create DOM
	const wrapper = document.createElement('div');

	// ... wrapper.append( /* other required DOM elements */ )

	// append to the container
	domElement.appendChild(wrapper);

	// your API here
	return {

    init( args ) { /* ... */ },

    draw( data ) { /* ... */ }

    // ...

  };

}
```

In the `tweet.js` file, for instance, this is the returned API:

```
return {

	// update the visualization with the current tweet data
    show(tweet) {

      // this elements have been created in the initialization phase
      // and added to the "domElement"
      divHeader.textContent = `${tweet.name} (${tweet.followers_count})`;
      spanCategory.textContent = tweet.screen_name;
      divDescription.textContent = tweet.text;
      img.src = tweet.profile_image_url_https;

    }

};
```

In this specific case, apart from creating the DOM in the first place, we don't need nothing more,
as we always show one single UI Tweet component, and we update it with the last received Tweet.

#### - Let's put the pieces together: `index.js`

This is where all these pieces come together (it's a bit modified version of the original file, for the sake of simplicity):


```
// import the DAO, VO and UI Component files
import * as TweetsDAO from './dao/...';
import * as TweetVO.createTweet from './vo/tweet';
import tweetBox from './components/tweet_box'

// ...

// create the only tweet UI component we will be using
// specifying where we want it to show up in the DOM
const tweetBoxComponent = tweetBox( document.querySelector('.tweet-container') );

// ...

// start reading tweets
TweetsDAO.readTweets((err, valoPayload) => {

	// convert raw data into a Tweet object
	const latestTweet = TweetVO.createTweet( valoPayload );

   // show tweet in the UI
   tweetBoxComponent.show( latestTweet );

})
```			



### Development workflow

> commands
> which libs are we using? (SEMANTIC, valo_sdk_js, jquery, html5 etc)
> quick guidelines: new viz? here. new query? there. etc

Fantastic!, you've got to the nice part. Issue the next command npm run make:viz on your terminal and run to your favorite IDE or editor.

### Valo JS SDK

This is an important bit, we should say something about it

## 3. Need help?

 Que campos ponemos? Hacker es de ejemplo

Alvaro Santamaria   | Danilo Rossi     | Zuri Pabon       | Andres Ramirez   |
--------------------|------------------|------------------|------------------|
Hacker 				| Hacker           | Hacker           | Hacker           |
@twitter_usr        | @danilorossi_me  | @twitter_usr     | @twitter_usr     |

### Useful links?

e.g. semantic ui, d3, valo docs

* Valo documentation: [https://valo.io/docs](https://valo.io/docs "Valo documentation - https://valo.io/docs")  
* SemanticUI: [https://semantic-ui.com/](https://semantic-ui.com/ "SemanticUI - https://semantic-ui.com/")
* Babel - ES6: [https://babeljs.io/learn-es2015/](https://babeljs.io/learn-es2015/ "BabelJS - https://babeljs.io/learn-es2015/")
