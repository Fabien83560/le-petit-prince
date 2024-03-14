import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { NgIf, NgFor, NgForOf, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonList, IonItem, IonLabel, IonModal,
         IonButton, IonButtons, IonSearchbar, IonIcon, IonToggle, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, FormsModule, ReactiveFormsModule, IonList,
            IonItem, IonLabel, NgIf, NgFor, NgForOf, DatePipe, IonModal, IonButton, IonButtons, IonSearchbar,
            IonIcon, IonToggle, IonRefresher, IonRefresherContent]
})
export class Tab1Page {
  articles: any[] = [];
  filteredArticles: any[] = [];
  currentArticle: any;
  isModalOpen = false;
  searchQuery = '';

  loginData = {
    username: '',
    password: ''
  };

  constructor() {
    addIcons({star});
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
      this.articles = data.articles;
      this.filteredArticles = this.articles;
    }

    const result = await Preferences.get({ key: 'favoris' });
    let favorites = result.value ? JSON.parse(result.value) : [];
    this.filteredArticles.forEach(article => {
      article.isFavorite = favorites.includes(article.id);
    });
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

  setOpen(isOpen: boolean, article: any) {
    this.isModalOpen = isOpen;
    this.currentArticle = article;
  }

  async isFavorite(article: any) {
    const result = await Preferences.get({ key: 'favoris' });
    let tab = result.value ? JSON.parse(result.value) : [];
    return tab.includes(article.id);
  }

  async toggleFavorite(article: any) {
    if (! await this.isFavorite(article)) {
      await this.addFavorite(article);
    } else {
      await this.removeFavorite(article);
    }
  }

  async addFavorite(article: any) {
    const result = await Preferences.get({ key: 'favoris' });
    let tab = result.value ? JSON.parse(result.value) : [];
    if (!tab.includes(article.id)) {
      tab.push(article.id);
      await Preferences.set({
        key: 'favoris',
        value: JSON.stringify(tab),
      });
      article.isFavorite = true;
    }
  }

  async removeFavorite(article: any) {
    const result = await Preferences.get({ key: 'favoris' });
    let tab = result.value ? JSON.parse(result.value) : [];
    const index = tab.indexOf(article.id);
  
    if (index > -1) {
      tab.splice(index, 1);
      await Preferences.set({
        key: 'favoris',
        value: JSON.stringify(tab),
      });
      article.isFavorite = false;
    }
  }

  filterArticles() {
    const searchTerm = this.searchQuery.toLowerCase();

    if (!searchTerm) {
      this.filteredArticles = this.articles;
      return;
    }

    this.filteredArticles = this.articles
      .filter(article => 
        article.titre.toLowerCase().includes(searchTerm) || 
        article.texte.toLowerCase().includes(searchTerm))
      .sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
        const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
        return aTitleMatch === bTitleMatch ? 0 : aTitleMatch ? -1 : 1;
      });
  }

  onSearchChange(event: any) {
    this.searchQuery = event.detail.value;
    this.filterArticles();
  }
}
