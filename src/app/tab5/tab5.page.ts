import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { addIcons } from 'ionicons';
import {school, schoolOutline, schoolSharp, location, locationOutline, locationSharp, call, callOutline, callSharp, mail, mailOutline, mailSharp} from 'ionicons/icons';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonList, IonItem, IonIcon, IonLabel,
         IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, FormsModule, ReactiveFormsModule,
            IonList, IonItem, IonIcon, IonLabel, IonRefresher, IonRefresherContent]
})
export class Tab5Page {
  loginData = {
    username: '',
    password: ''
  };

  constructor() {
    addIcons({school, schoolOutline, schoolSharp, location, locationOutline, locationSharp, call, callOutline, callSharp, mail, mailOutline, mailSharp});
    this.loadInformation();
  }

  async loadInformation() {
    const username = await Preferences.get({ key: 'usernameConnected' });
    const password = await Preferences.get({ key: 'passwordConnected' });

    this.loginData.username = username.value ? JSON.parse(username.value) : '';
    this.loginData.password = password.value ? JSON.parse(password.value) : '';
  }

  fetchAllInformations(event: any) {
    fetch(`https://sebastien-thon.fr/prince/index.php?login=${this.loginData.username}&mdp=${this.loginData.password}`).then(async response => {
      if (response.ok) {
        const data = await response.json();
        await Preferences.set({
          key: 'data',
          value: JSON.stringify(data),
        })
        event.target.complete()
      }
    }).catch(e => {
      console.log(e);
    })
  }

}
