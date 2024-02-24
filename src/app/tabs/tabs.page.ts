import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar, calendarSharp, calendarOutline, home, homeSharp, hammerOutline, book, bookSharp, bookOutline,
         image, imageSharp, imageOutline, call, callSharp, callOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ calendar, calendarSharp, calendarOutline, home, homeSharp, hammerOutline, book, bookSharp, bookOutline,
               image, imageSharp, imageOutline, call, callSharp, callOutline });
  }
}
