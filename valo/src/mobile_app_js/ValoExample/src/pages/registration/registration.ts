import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';

import * as contributors from '../../../../../lib_js/valo_sdk_js/api/contributors';
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

  constructor(public navCtrl: NavController, private storage: Storage, private device: Device) {

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
        //this.createContributor(this.MOBILE_USER_CONTRIBUTOR);
        this.registerContributor();
      },
      error => {
      }
    );
  }

  async createContributor(schema) {
    try {
      await retryOnConflict(contributors.createContributorType)(
        {
          valoHost: this.userDetails.valoDetails.host,
          valoPort: this.userDetails.valoDetails.port
        },
        [this.userDetails.valoDetails.tenant, "mobile_user", this.userDetails.id],
        schema
      );
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

}
