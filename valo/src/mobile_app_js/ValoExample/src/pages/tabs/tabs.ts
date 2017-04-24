import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { RegistrationPage } from '../registration/registration';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1Root = HomePage;
  tab2Root = RegistrationPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
