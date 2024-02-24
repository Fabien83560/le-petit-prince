import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgIf } from '@angular/common';
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
  imports: [FormsModule, ReactiveFormsModule, NgIf, IonHeader, IonToolbar, IonTitle, IonContent, IonModal, IonItem, IonLabel, IonInput, IonCheckbox,
            IonButton, IonIcon, IonText],
})

export class Tab3Page implements OnInit {
  userConnected: boolean = false;

  loginError: boolean = false;
  loginErrorMessage: string = '';
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
    const url = `http://www.sebastien-thon.fr/prince/index.php?connexion&login=${encodeURIComponent(this.loginData.username)}&mdp=${encodeURIComponent(this.loginData.password)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Réponse réseau non réussie');
      }

      const data = await response.json();
      if (data.resultat === "OK") {
        this.userConnected = true;
        this.loginError = false;
        this.loginErrorMessage = '';

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
      } else if (data.erreur) {
        this.loginError = true;
        this.loginErrorMessage = "Votre identifiant ou mot de passe est incorrect";
      }
    } catch (error) {
      this.loginError = true;
      this.loginErrorMessage = "Une erreur est survenue lors de la connexion";
    }
  }

  async rememberMe() {
    this.rememberLogin = !this.rememberLogin;
    await Preferences.set({
      key: 'rememberLogin',
      value: JSON.stringify(this.rememberLogin),
    });
  }

  canDismissModal = () => {
    return !this.userConnected;
  };
}
