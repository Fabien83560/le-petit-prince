import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonModal, IonItem, IonLabel, IonInput, IonCheckbox,
         IonButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, personSharp, personOutline, lockClosed, lockClosedSharp, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonModal, IonItem, IonLabel, IonInput, IonCheckbox,
            IonButton, IonIcon, IonText],
})

export class Tab3Page implements OnInit {
  userConnected: boolean = false;
  rememberLogin: boolean = false;
  loginData = {
    username: '',
    password: ''
  };

  constructor() {
    addIcons({ person, personSharp, personOutline, lockClosed, lockClosedSharp, lockClosedOutline });
  }

  async ngOnInit() {
    const rememberData = await Preferences.get({ key: 'rememberLogin' });
    this.rememberLogin = rememberData.value ? JSON.parse(rememberData.value) : false;

    if (this.rememberLogin) {
      const storedUsername = await Preferences.get({ key: 'rememberUsername' });
      const storedPassword = await Preferences.get({ key: 'rememberPassword' });

      this.loginData.username = storedUsername.value ? JSON.parse(storedUsername.value) : '';
      this.loginData.password = storedPassword.value ? JSON.parse(storedPassword.value) : '';
    }
  }

  async tryConnexion() {
    this.userConnected = true;
    if(this.rememberLogin) {
      await Preferences.set({
        key: 'rememberUsername',
        value: JSON.stringify(this.loginData.username),
      });
      await Preferences.set({
        key: 'rememberPassword',
        value: JSON.stringify(this.loginData.password),
      });
    }
    else {
      await Preferences.set({
        key: 'rememberUsername',
        value: JSON.stringify(""),
      });
      await Preferences.set({
        key: 'rememberPassword',
        value: JSON.stringify(""),
      });
    }
  }

  async rememberMe() {
    this.rememberLogin = !this.rememberLogin;
    await Preferences.set({
      key: 'rememberLogin',
      value: JSON.stringify(this.rememberLogin),
    });
  }
}
