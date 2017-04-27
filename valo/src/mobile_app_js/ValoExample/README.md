Requirements
------------

* Node.js
* [Ionic](https://ionicframework.com/)
* Andoid SDK or iOS SDK

Quick Start
-----------

If you have Node.js installed, run `npm install -g cordova ionic` to install Cordova and Ionic if these haven't been installed yet.

To build and test:

* Run `npm install` to download dependencies
* Run `ionic serve` to start a local developmen server
* Open up a browser, then point it to `http://<IP Address>:8100` - note that some browsers may have some limitations (such as Chrome not allowing Geolocation when using http)

To test in a mobile device using Ionic View:

* Create an Ionic account through their [webpage](https://ionicframework.com/)
* Edit `ionic.config.json` by deleting the value for `app_id` - this will allow generation of a new unique app id in the next step:
<pre><code>{
  "name": "ValoExample",
  "app_id": "",
  "v2": true,
  "typescript": true
}</code></pre>

* Run `ionic upload` - take note of the generated app id
* Download the [Ionic View](http://view.ionic.io/) app
* Run and log into Ionic View; if you used the same account for uploading, your application may already be set up for viewing. To share your app with other users, ask them to load the app id generated.
