import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonModal, IonItem, IonLabel, IonInput, IonCheckbox,
         IonButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, personSharp, personOutline, lockClosed, lockClosedSharp, lockClosedOutline } from 'ionicons/icons';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonModal, IonItem, IonLabel, IonInput, IonCheckbox,
            IonButton, IonIcon, IonText],
})
export class Tab3Page {
  userConnected: boolean = false
  loginData = {
    username: '',
    password: ''
  };

  constructor() {
    addIcons({ person, personSharp, personOutline, lockClosed, lockClosedSharp, lockClosedOutline })
  }

  async tryConnexion() {
    this.userConnected = true;
  }
}

