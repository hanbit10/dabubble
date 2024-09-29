import { Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { MainComponent } from './page/main/main.component';
import { DirectChatComponent } from './components/direct-chat/direct-chat.component';
import { ChannelChatComponent } from './components/channel-chat/channel-chat.component';
import { NewMessageComponent } from './components/new-message/new-message.component';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';
import { ReassignPasswordCardComponent } from './components/reassign-password-card/reassign-password-card.component';
import { ThreadComponent } from './components/thread/thread.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      {
        path: 'reassignpassword/:id/:timestamp',
        component: ReassignPasswordCardComponent,
      },
    ],
  },

  {
    path: 'main/:id',
    component: MainComponent,
    children: [
      { path: 'chats/:id', component: DirectChatComponent },
      {
        path: 'chats/:id/th/:msgId',
        component: ThreadComponent,
        outlet: 'thread',
      },
      {
        path: 'channels/:id',
        component: ChannelChatComponent,
      },
      {
        path: 'channels/:id/th/:msgId',
        component: ThreadComponent,
        outlet: 'thread',
      },

      { path: 'newMessage', component: NewMessageComponent },
    ],
  },
];
