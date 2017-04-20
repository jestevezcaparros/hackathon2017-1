import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})

export class RegistrationPage {

  id = "0000000000000000"
  user = {
    name: "",
    gender: "",
    type: "",
    company: "",
    country: "",
    role: ""
  }
  valoDetails = {
    host: "",
    port: "",
    tenant: "",
    collection: "",
    location: "",
    happiness: ""
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

  userDetails = ""

  constructor(public navCtrl: NavController, private storage: Storage, private device: Device) {

  }

  ionViewWillEnter() {
    this.storage.get('userDetails').then(
      data => {
        if (!data) {
          this.user = this.DEFAULT_USER;
          this.valoDetails = this.DEFAULT_VALODETAILS;
        } else {
          var obj = JSON.parse(data);
          this.id = obj.id;
          this.user = obj.user;
          this.valoDetails = obj.valoDetails;
        }
      },
      error => {
        this.user = this.DEFAULT_USER;
        this.valoDetails = this.DEFAULT_VALODETAILS;
      }
    );
  }

  saveDetails() {
    this.id = this.device.uuid ? this.device.uuid : "0000000000000000";
    this.userDetails = JSON.stringify({ id: this.id, user: this.user, valoDetails: this.valoDetails });
    this.storage.set('userDetails', this.userDetails).then(
      () => {
      },
      error => {
      }
    );
  }

}
