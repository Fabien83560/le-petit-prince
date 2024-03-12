import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgIf, NgFor, NgForOf, DatePipe } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonList, IonItem, IonLabel, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, FormsModule, ReactiveFormsModule,
            NgIf, NgFor, NgForOf, DatePipe, IonList, IonItem, IonLabel, IonRefresher, IonRefresherContent]
})
export class Tab4Page {
  dates: any[] = [];
  currentDate: any;
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
      this.dates = data.dates;
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

}
