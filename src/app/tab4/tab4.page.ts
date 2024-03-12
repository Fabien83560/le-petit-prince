import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, FormsModule, ReactiveFormsModule]
})
export class Tab4Page {

  loginData = {
    username: '',
    password: ''
  };

  constructor() {
    this.loadInformation();
  }

  async loadInformation() {
    const username = await Preferences.get({ key: 'usernameConnected' });
    const password = await Preferences.get({ key: 'passwordConnected' });

    this.loginData.username = username.value ? JSON.parse(username.value) : '';
    this.loginData.password = password.value ? JSON.parse(password.value) : '';
  }
}
