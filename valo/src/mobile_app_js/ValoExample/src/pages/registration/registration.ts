import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';

// Import Valo SDK libraries
// In this page, we want to be able to create contributor types and streams.
// We also want to be able to add and update contributors with user information
import * as contributors from '../../../../../lib_js/valo_sdk_js/api/contributors';
import * as streams from '../../../../../lib_js/valo_sdk_js/api/streams';
import { retryOnConflict } from '../../../../../lib_js/valo_sdk_js/index';

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})

export class RegistrationPage {

  // Let's define some default application values
  // We want to be able to define the following:
  //  - mobile id
  //  - details for user
  //  - details for valo instance (host, port, tenant, collection, stream names)
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

  // Let's define here a schema for the mobile_user contributor type
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

  // Let's define here a schema storing happiness and location information
  // We'll be using this stream for capturing user ratings on the event, as well as their current location when they make the rating
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

  // Let's define here a schema storing location information
  // We'll be using this stream for capturing user locations when the app is open
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

  // Define a default repository for streams; let's just use an SSR repository
  REPO_CONF_SSR = {
    "name": "ssr"
  };

  constructor(public navCtrl: NavController, private storage: Storage, private device: Device, public toastCtrl: ToastController) {

  }

  // The first thing we do when we enter this page is to check if we have stored "userDetails" information in the app
  // If so, we retrieve them; if we don't have them, we get errors, or we get blank data, we initialize them to default values
  // Any changes to the userDetails should be reflected in the registration form
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

  // This function is called when the registration form is submitted
  // What we do here are:
  //  - Try to save the "userDetails" in the app storage - we need to store these as a String, so we stringify the object
  //  - Check if there is a defined mobile_user contributor type; if there is none, create it
  //  - Update contributor information ID for the current user
  //  - Check if there is a defined stream to capture happiness information; if there is none, create it
  //  - Check if there is a defined stream to capture location information; if there is none, create it
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

  // We first set up parameters for the Valo instance and other Valo details (including the contributor type)
  // When this is done, we check if the mobile_user contributor type is present; if it isn't call the function
  //  to create the contributor type
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

  // Call the function to create the contributor type
  async createContributorType(valoInstance, valoParams, schema) {
    try {
      await contributors.createContributorType(valoInstance, valoParams, schema);
    } catch (error) {
      console.log(error);
    }
  }

  // We first set up parameters for the Valo instance and other Valo details (including the contributor type and contributor id)
  // For the contributor id, we use the device's uuid, as previously set
  // When this is done, we make a call to the function to register the contributor instance
  // We make use of retryOnConflict, which means we retry with the correct headers if we initially fail - we want to retry
  //  since we want to overwrite any previous contributor information for the same contributor id
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

  // We first set up parameters for the Valo instance and other Valo details (including the stream name)
  // When this is done, we check if the stream is present; if it isn't call the function to create the stream
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

  // Call the function to create the Valo stream by passing the schema
  // We also set the stream repository to SSR so we can retain previous data and call historical queries later on
  async createStream(valoInstance, valoParams, schema) {
    try {
      await streams.createStream(valoInstance, valoParams, schema);
      await streams.setStreamRepository(valoInstance, valoParams, this.REPO_CONF_SSR);
    } catch (error) {
      console.log(error);
    }
  }

}
