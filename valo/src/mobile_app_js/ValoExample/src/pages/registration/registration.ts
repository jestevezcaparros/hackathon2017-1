import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';

import * as contributors from '../../../../../lib_js/valo_sdk_js/api/contributors';
import * as streams from '../../../../../lib_js/valo_sdk_js/api/streams';
import { retryOnConflict } from '../../../../../lib_js/valo_sdk_js/index';

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})

export class RegistrationPage {

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

  DEFAULT_ID = "0000000000000000"

  DEFAULT_USER = {
    name: "Jon Snow",
    gender: "male",
    type: "gatecrasher",
    company: "House Stark",
    country: "Winterfell",
    role: "King in the North"
  }

  DEFAULT_VALODETAILS = {
    host: "119.92.192.242",
    port: "8888",
    tenant: "demo",
    collection: "mobile",
    location: "location",
    happiness: "happiness"
  }

  MOBILE_USER_CONTRIBUTOR = {
    "schema": {
      "type": "record",
      "properties": {
        "id": {
          "type": "contributor"
        },
        "user": {
          "type": "record",
          "properties": {
            "name": { "type": "string" },
            "typeOfParticipant": { "type": "string" },
            "company": { "type": "string" },
            "role": { "type": "string" },
            "country": { "type": "string" },
            "gender": { "type": "string" }
          }
        }
      }
    }
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

  constructor(public navCtrl: NavController, private storage: Storage, private device: Device, public toastCtrl: ToastController) {

  }

  ionViewWillEnter() {
    this.storage.get('userDetails').then(
      data => {
        if (data) {
          var obj = JSON.parse(data);
          this.userDetails = {
            id: obj.id,
            user: obj.user,
            valoDetails: obj.valoDetails
          }
        } else {
          this.userDetails = {
            id: this.device.uuid ? this.device.uuid : this.DEFAULT_ID,
            user: this.DEFAULT_USER,
            valoDetails: this.DEFAULT_VALODETAILS
          }
        }
      },
      error => {
        this.userDetails = {
          id: this.device.uuid ? this.device.uuid : this.DEFAULT_ID,
          user: this.DEFAULT_USER,
          valoDetails: this.DEFAULT_VALODETAILS
        }
      }
    );
  }

  saveDetails() {
    this.storage.set('userDetails', JSON.stringify(this.userDetails)).then(
      () => {
        this.checkAndCreateContributorType(this.MOBILE_USER_CONTRIBUTOR);
        this.registerContributor();
        this.checkAndCreateStream(this.HAPPINESS_SCHEMA, this.userDetails.valoDetails.happiness);
        this.checkAndCreateStream(this.LOCATION_SCHEMA, this.userDetails.valoDetails.location);
        this.toastCtrl.create({
          message: "Details saved",
          duration: 1000,
          position: 'middle'
        }).present();
      },
      error => {
      }
    );
  }

  async checkAndCreateContributorType(schema) {
    var VALO_INSTANCE = {
      valoHost: this.userDetails.valoDetails.host,
      valoPort: this.userDetails.valoDetails.port
    };

    var VALO_PARAMS = [this.userDetails.valoDetails.tenant, "mobile_user"];

    try {
      await contributors.getContributorType(VALO_INSTANCE, VALO_PARAMS);
    } catch (error) {
      if (error.type === "VALO.NotFound") {
        this.createContributorType(VALO_INSTANCE, VALO_PARAMS, schema);
      } else {
        console.log(error);
      }
    }
  }

  async createContributorType(valoInstance, valoParams, schema) {
    try {
      await contributors.createContributorType(valoInstance, valoParams, schema);
    } catch (error) {
      console.log(error);
    }
  }


  async registerContributor() {
    try {
      await retryOnConflict(contributors.registerContributorInstance)(
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
    } catch (error) {
      console.log(error);
    }
  }

  async checkAndCreateStream(schema, stream) {
    var VALO_INSTANCE = {
      valoHost: this.userDetails.valoDetails.host,
      valoPort: this.userDetails.valoDetails.port
    };

    var VALO_PARAMS = [this.userDetails.valoDetails.tenant, this.userDetails.valoDetails.collection, stream];

    try {
      await streams.getStream(VALO_INSTANCE, VALO_PARAMS);
    } catch (error) {
      if (error.type === "VALO.NotFound") {
        this.createStream(VALO_INSTANCE, VALO_PARAMS, schema);
      } else {
        console.log(error);
      }
    }
  }

  async createStream(valoInstance, valoParams, schema) {
    try {
      await streams.createStream(valoInstance, valoParams, schema);
      await streams.setStreamRepository(valoInstance, valoParams, this.REPO_CONF_SSR);
    } catch (error) {
      console.log(error);
    }
  }

}
