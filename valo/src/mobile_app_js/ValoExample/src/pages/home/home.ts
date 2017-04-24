import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

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

  geolocationOptions = {
    maximumAge: 0,
    timeout: 10000,
    enableHighAccuracy: true
  }

  locationWatch = null

  dummyLocation = {
    coords: {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      accuracy: 0,
      speed: 0,
      heading: 0
    }
  }

  constructor(public navCtrl: NavController, private storage: Storage, private geolocation: Geolocation, public toastCtrl: ToastController) {

  }

  ionViewWillEnter() {
    this.storage.get('userDetails').then(
      data => {
        if (data) {
          this.userDetails = JSON.parse(data);
          this.setupGeolocationWatch();
        } else {
          this.navCtrl.parent.select(1);
        }
      },
      error => {
        this.navCtrl.parent.select(1);
      }
    );
  }

  ionViewWillUnload() {
    clearInterval(this.locationWatch);
  }

  setupGeolocationWatch() {
    if (!this.locationWatch) {
      this.publishLocation();
      this.locationWatch = setInterval(() => { this.publishLocation() }, 300000);
    }
  }

  sendRating(event, rating) {
    this.geolocation.getCurrentPosition(this.geolocationOptions).then(
      (resp) => {
        this.publishHappinessEvent(this.userDetails.valoDetails.happiness, resp, rating);
      }).catch((error) => {
        this.publishHappinessEvent(this.userDetails.valoDetails.happiness, this.dummyLocation, rating);
        console.log(error);
      });
  }

  publishLocation() {
    this.geolocation.getCurrentPosition(this.geolocationOptions).then(
      (resp) => {
        this.publishLocationEvent(this.userDetails.valoDetails.location, resp);
      }
    ).catch((error) => {
      this.publishLocationEvent(this.userDetails.valoDetails.location, this.dummyLocation);
      console.log(error);
    });
  }

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
        duration: 5000,
        position: 'bottom'
      }).present();
    } catch (error) {
      console.log(error);
    }
  }

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
        duration: 5000,
        position: 'bottom'
      }).present();
    } catch (error) {
      console.log(error);
    }
  }

}
