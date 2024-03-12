import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { NgIf, NgFor, NgForOf, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonList, IonItem, IonLabel, IonModal,
         IonButton, IonButtons, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, FormsModule, ReactiveFormsModule,
            NgIf, NgFor, NgForOf, DatePipe, IonList, IonItem, IonLabel, IonModal, IonButton, IonButtons,
            IonRefresher, IonRefresherContent]
})
export class Tab2Page {
  galeries: any[] = [];
  currentGalerie: any;
  isModalOpen = false;
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

    const dataResponse = await Preferences.get({ key: 'data' });
    if (dataResponse.value) {
      const data = JSON.parse(dataResponse.value);
      this.galeries = data.galeries;
    }
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

  setOpen(isOpen: boolean, galerie: any) {
    this.isModalOpen = isOpen;
    this.currentGalerie = galerie;
  }
}
