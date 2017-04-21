import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import * as streams from '../../../../../lib_js/valo_sdk_js/api/streams';
import { retryOnConflict } from '../../../../../lib_js/valo_sdk_js/index';

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

  HAPPINESS_SCHEMA = {
    "schema": {
      "version": "1.0",
      "config": {},
      "topDef": {
        "type": "record",
        "properties": {
          "contributor": {
            "type": "contributor", "definition": "mobile_user"
          },
          "timestamp": {
            "type": "datetime",
            "annotations": ["urn:itrs:default-timestamp"]
          },
          "position": {
            "type": "record",
            "properties": {
              "latitude": { "type": "double" },
              "longitude": { "type": "double" },
              "altitude": { "type": "double" },
              "accuracy": { "type": "double" },
              "speed": { "type": "double" },
              "heading": { "type": "double" }
            }
          },
          "happiness": { "type": "int" }
        }
      }
    }
  }

  LOCATION_SCHEMA = {
    "schema": {
      "version": "1.0",
      "config": {},
      "topDef": {
        "type": "record",
        "properties": {
          "contributor": {
            "type": "contributor", "definition": "mobile_user"
          },
          "timestamp": {
            "type": "datetime",
            "annotations": ["urn:itrs:default-timestamp"]
          },
          "position": {
            "type": "record",
            "properties": {
              "latitude": { "type": "double" },
              "longitude": { "type": "double" },
              "altitude": { "type": "double" },
              "accuracy": { "type": "double" },
              "speed": { "type": "double" },
              "heading": { "type": "double" }
            }
          }
        }
      }
    }
  }

  REPO_CONF_SSR = {
    "name": "ssr"
  };

  locationWatch = null;

  constructor(public navCtrl: NavController, private storage: Storage, private geolocation: Geolocation, public toastCtrl: ToastController) {

  }

  ionViewWillEnter() {
    this.storage.get('userDetails').then(
      data => {
        if (data) {
          this.userDetails = JSON.parse(data);
          //this.createStream(this.HAPPINESS_SCHEMA, this.userDetails.valoDetails.happiness);
          //this.createStream(this.LOCATION_SCHEMA, this.userDetails.valoDetails.location);
          this.publishLocation();
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

  ionViewWillLeave() {
    clearInterval(this.locationWatch);
  }

  setupGeolocationWatch() {
    this.locationWatch = setInterval(() => { this.publishLocation() }, 300000);
  }

  publishLocation() {
    this.geolocation.getCurrentPosition(this.geolocationOptions).then(
      (resp) => {
        this.publishLocationEvent(this.userDetails.valoDetails.location, resp);
      }
    ).catch((error) => {
      let dummyResp = {
        coords: {
          latitude: 0,
          longitude: 0,
          altitude: 0,
          accuracy: 0,
          speed: 0,
          heading: 0
        }
      };
      this.publishLocationEvent(this.userDetails.valoDetails.location, dummyResp);
      console.log(error);
    });
  }

  async createStream(schema, stream) {
    try {
      await retryOnConflict(streams.createStream)(
        {
          valoHost: this.userDetails.valoDetails.host,
          valoPort: this.userDetails.valoDetails.port
        },
        [this.userDetails.valoDetails.tenant, this.userDetails.valoDetails.collection, stream],
        schema
      );

      await retryOnConflict(streams.setStreamRepository)(
        {
          valoHost: this.userDetails.valoDetails.host,
          valoPort: this.userDetails.valoDetails.port
        },
        [this.userDetails.valoDetails.tenant, this.userDetails.valoDetails.collection, stream],
        this.REPO_CONF_SSR
      );
    } catch (error) {
      console.log(error);
    }
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

}
