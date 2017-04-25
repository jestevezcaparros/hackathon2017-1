import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

// Import Valo SDK libraries
// For this page, we want to push Valo events, so we import the streams components of the Valo SDK
import * as streams from '../../../../../lib_js/valo_sdk_js/api/streams';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  userDetails = {
    id: "0000000000000000",
    user: {
      name: "",
      gender: "",
      type: "",
      company: "",
      country: "",
      role: ""
    },
    valoDetails: {
      host: "",
      port: "",
      tenant: "",
      collection: "",
      location: "",
      happiness: ""
    }
  }

  // Let's just set some geolocation default options
  geolocationOptions = {
    maximumAge: 0,
    timeout: 10000,
    enableHighAccuracy: true
  }

  locationWatch = null
  initialized = false
  buttonsDisabled = false

  constructor(public navCtrl: NavController, private storage: Storage, private geolocation: Geolocation, public toastCtrl: ToastController) {

  }

  isInitialized() {
    return this.initialized;
  }

  // The first thing we do is to check if there are stored "userDetails" for this app
  // If there isn't, we want to switch to the registration page
  // If there is:
  //  - We load those details (details are stored as a String, so we parse into a JSON object)
  //  - We set up a function which will periodically send the user's current location to Valo
  ionViewWillEnter() {
    this.storage.get('userDetails').then(
      data => {
        if (data) {
          this.initialized = true;
          this.userDetails = JSON.parse(data);
          this.setupGeolocationWatch();
        }
      },
      error => {
      }
    );
  }

  ionViewWillUnload() {
    clearInterval(this.locationWatch);
  }

  showRegistrationPage() {
    this.navCtrl.parent.select(1);
  }

  // If it hasn't been done yet, we set up a function to send the current location to Valo every minute
  // Note that we also want to initially send the current location
  setupGeolocationWatch() {
    if (!this.locationWatch) {
      this.publishLocation();
      this.locationWatch = setInterval(() => { this.publishLocation() }, 60000);
    }
  }

  // We try to get the current position of the device, and if we are able to get it, we then attempt to publish to Valo
  publishLocation() {
    this.geolocation.getCurrentPosition(this.geolocationOptions).then(
      (resp) => {
        this.publishLocationEvent(this.userDetails.valoDetails.location, resp);
      }
    ).catch((error) => {
      console.log(error);
    });
  }

  // We make use of the Valo SDK to publish events to our Valo instance
  // First, we set up our Valo parameters, including the stream we want to publish into
  // Note that the data we want to publish should match the stream's schema
  async publishLocationEvent(stream, resp) {
    try {
      await streams.publishEventToStream(
        {
          valoHost: this.userDetails.valoDetails.host,
          valoPort: this.userDetails.valoDetails.port
        },
        [this.userDetails.valoDetails.tenant, this.userDetails.valoDetails.collection, stream],
        {
          contributor: this.userDetails.id,
          timestamp: new Date(),
          position: {
            latitude: resp.coords.latitude,
            longitude: resp.coords.longitude,
            altitude: resp.coords.altitude,
            accuracy: resp.coords.accuracy,
            speed: resp.coords.speed,
            heading: resp.coords.heading
          }
        }
      );
      this.toastCtrl.create({
        message: "Location sent to Valo: [" + resp.coords.latitude + "," + resp.coords.longitude + "]",
        duration: 1000,
        position: 'bottom'
      }).present();
    } catch (error) {
      console.log(error);
    }
  }

  // When a user clicks on a rating button, we call this function and process the current rating
  // We also try to get the user's current location, and if successful, we publish and event to Valo
  //  which contains the user's current location and happiness rating
  // In addition, we also want to disable the buttons momentarily to prevent users from flooding Valo
  //  with user ratings
  sendRating(event, rating) {
    this.geolocation.getCurrentPosition(this.geolocationOptions).then(
      (resp) => {
        this.publishHappinessEvent(this.userDetails.valoDetails.happiness, resp, rating);
      }).catch((error) => {
        console.log(error);
      });
    this.buttonsDisabled = true;
    setTimeout(() => { this.buttonsDisabled = false }, 10000);
  }

  // We make use of the Valo SDK to publish events to our Valo instance
  // First, we set up our Valo parameters, including the stream we want to publish into
  // Note that the data we want to publish should match the stream's schema
  async publishHappinessEvent(stream, resp, happiness) {
    try {
      await streams.publishEventToStream(
        {
          valoHost: this.userDetails.valoDetails.host,
          valoPort: this.userDetails.valoDetails.port
        },
        [this.userDetails.valoDetails.tenant, this.userDetails.valoDetails.collection, stream],
        {
          contributor: this.userDetails.id,
          timestamp: new Date(),
          position: {
            latitude: resp.coords.latitude,
            longitude: resp.coords.longitude,
            altitude: resp.coords.altitude,
            accuracy: resp.coords.accuracy,
            speed: resp.coords.speed,
            heading: resp.coords.heading
          },
          happiness: happiness
        }
      );
      this.toastCtrl.create({
        message: "Location sent to Valo: [" + resp.coords.latitude + "," + resp.coords.longitude + "]",
        duration: 1000,
        position: 'bottom'
      }).present();
    } catch (error) {
      console.log(error);
    }
  }

}
