import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import * as streams from '../../../../../lib_js/valo_sdk_js/api/streams';
import * as contributors from '../../../../../lib_js/valo_sdk_js/api/contributors';
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

  constructor(public navCtrl: NavController, private storage: Storage, private geolocation: Geolocation) {

  }

  ionViewWillEnter() {
    this.storage.get('userDetails').then(
      data => {
        if (!data) {
          this.navCtrl.parent.select(1);
        } else {
          this.userDetails = JSON.parse(data);
          this.registerContributor();
          this.setupGeolocationWatch();
        }
      },
      error => {
        this.navCtrl.parent.select(1);
      }
    );
  }

  async registerContributor() {
    const response = await retryOnConflict(contributors.registerContributorInstance)(
      {
        valoHost: this.userDetails.valoDetails.host,
        valoPort: this.userDetails.valoDetails.port
      },
      [this.userDetails.valoDetails.tenant, "mobile_user", this.userDetails.id],
      {
        id: this.userDetails.id,
        user: {
          name: this.userDetails.user.name,
          typeOfParticipant: this.userDetails.user.type,
          company: this.userDetails.user.company,
          role: this.userDetails.user.role,
          country: this.userDetails.user.country,
          gender: this.userDetails.user.gender
        }
      }
    );
    return response;
  }

  setupGeolocationWatch() {
    setInterval(
      () => {
        this.geolocation.getCurrentPosition(this.geolocationOptions).then(
          (resp) => {
            this.publishEvent(this.userDetails.valoDetails.location, resp);
          }
        ).catch((error) => {
          let resp = {
            coords: {
              latitude: 0,
              longitude: 0,
              altitude: 0,
              accuracy: 0,
              speed: 0,
              heading: 0
            }
          };
          this.publishEvent(this.userDetails.valoDetails.location, resp);
        });
      }, 30000);
  }

  async publishEvent(stream, resp) {
    try {
      const response = await streams.publishEventToStream(
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
      return response;
    } catch (e) {
    }
  }

}
