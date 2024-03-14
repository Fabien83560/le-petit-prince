import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgIf, NgFor, NgForOf, DatePipe } from '@angular/common';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonModal, IonItem, IonLabel, IonInput, IonCheckbox,
         IonButton, IonIcon, IonText, IonButtons, IonList, IonAlert } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, personSharp, personOutline, lockClosed, lockClosedSharp, lockClosedOutline, star } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, IonHeader, IonToolbar, IonTitle, IonContent, IonModal,
            IonItem, IonLabel, IonInput, IonCheckbox, IonButton, IonIcon, IonText, IonButtons, IonList,
            NgFor, NgForOf, DatePipe, IonAlert],
})

export class Tab3Page implements OnInit {
  userConnected: boolean = false;
  tutorialModal: boolean = false;

  isModalOpen: boolean = false;
  favoriteArticles: any;
  currentArticle: any;

  loginError: boolean = false;
  loginErrorMessage: string = '';
  rememberLogin: boolean = false;

  loginData = {
    username: '',
    password: ''
  };

  constructor(private alertController: AlertController) {
    addIcons({ person, personSharp, personOutline, lockClosed, lockClosedSharp, lockClosedOutline, star });
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

    this.refreshData();
    this.refreshFavorite();
  }

  ionViewDidEnter() {
    this.refreshData();
    this.refreshFavorite();
  }

  async tryConnexion() {
    const url = `https://sebastien-thon.fr/prince/index.php?connexion&login=${encodeURIComponent(this.loginData.username)}&mdp=${encodeURIComponent(this.loginData.password)}`;

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
        this.saveConnectedUser();
        this.fetchAllInformations();
      } else if (data.erreur) {
        this.loginError = true;
        this.loginErrorMessage = "Votre identifiant ou mot de passe est incorrect";
        this.presentAlert();
      }
    } catch (error) {
      this.loginError = true;
      this.loginErrorMessage = "Une erreur est survenue lors de la connexion";
      this.presentAlert();
    }
  }

  async presentAlert() {
    if (this.loginErrorMessage !== '') {
      const alert = await this.alertController.create({
        header: 'Erreur de connexion',
        message: this.loginErrorMessage,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  

  async rememberMe() {
    this.rememberLogin = !this.rememberLogin;
    await Preferences.set({
      key: 'rememberLogin',
      value: JSON.stringify(this.rememberLogin),
    });
  }

  async saveConnectedUser() {
    await Preferences.set({
      key: 'usernameConnected',
      value: JSON.stringify(this.loginData.username),
    });
    await Preferences.set({
      key: 'passwordConnected',
      value: JSON.stringify(this.loginData.password),
    });
  }

  async refreshData() {
    const dataResponse = await Preferences.get({ key: 'data' });
    if (dataResponse.value) {
      const data = JSON.parse(dataResponse.value);
      this.favoriteArticles = data.articles;
    }
  }

  async refreshFavorite() {
    const result = await Preferences.get({ key: 'favoris' });
    let favorites = result.value ? JSON.parse(result.value) : [];
    this.favoriteArticles.forEach((article:any) => {
      article.isFavorite = favorites.includes(article.id);
    });
  }

  fetchAllInformations() {
    fetch(`https://sebastien-thon.fr/prince/index.php?login=${this.loginData.username}&mdp=${this.loginData.password}`).then(async response => {
      if (response.ok) {
        const data = await response.json();
        await Preferences.set({
          key: 'data',
          value: JSON.stringify(data),
        })
      }
    }).catch(e => {
      console.log(e);
    })
  }

  canDismissModal = () => {
    return !this.userConnected;
  };

  setOpenTutorial(isOpen: boolean) {
    this.tutorialModal = isOpen;
  }

  setOpen(isOpen: boolean, article: any) {
    this.isModalOpen = isOpen;
    this.currentArticle = article;
  }

  getFavoriteArticles() {
    return this.favoriteArticles.filter((article: any) => article.isFavorite);
  }

  countFavorites() {
    if (!this.favoriteArticles) {
      return 0;
    }
    const favorites = this.favoriteArticles.filter((article: any) => article.isFavorite);
    return favorites.length;
  }
  
}
