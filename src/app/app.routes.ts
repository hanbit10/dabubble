import { Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { MainComponent } from './page/main/main.component';
import { DirectChatComponent } from './components/direct-chat/direct-chat.component';
import { ChannelChatComponent } from './components/channel-chat/channel-chat.component';
import { NewMessageComponent } from './components/new-message/new-message.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },

  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'users',
        component: DirectChatComponent,
      },
      { path: 'channels/:id', component: ChannelChatComponent },
      { path: 'newMessage', component: NewMessageComponent },
    ],
  },
];
