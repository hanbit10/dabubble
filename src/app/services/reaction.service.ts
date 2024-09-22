import { inject, Injectable } from '@angular/core';
import { Reaction } from '../models/message';
import { collection, doc } from "firebase/firestore";
import { Firestore, onSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  firestore: Firestore = inject(Firestore);
  reactions: Reaction[] = [];
  reactionEmoji: string = '';

  public editTextArea: string = 'Welche Version ist aktuell von Angular?';
  public isEmojiPickerVisible: boolean = false;
  
  reactionExists = false;

  private reactionSubject = new BehaviorSubject<Reaction[]>([]);

  constructor(public channelService: ChannelService) {}

  getMessagesRef(){
    return collection(this.firestore, `channels/${this.channelService.currentChannelId}/messages`);
  }

  getMessage(){
    
  }

  subUsersList() {
    const docRef = collection(this.firestore, 'users');
    return onSnapshot(docRef, (list) => {
      this.reactions = [];
      list.forEach((reaction) => {
        this.reactions.push(this.setReactionObject(reaction.data()));
      });
      this.reactionSubject.next(this.reactions);
    });
  }

  setReactionObject(obj: any): Reaction {
    return {
      emojiNative: obj.emojiNative,
      count: obj.count,
      reacted: obj.reacted
    };
  }


  public addEmoji(event: any) {
    this.editTextArea = `${this.editTextArea}${event.emoji.native}`;
    console.log(event.emoji);
    this.isEmojiPickerVisible = false;
  }

  addreaction(event:any){
    this.reactionExists = false;

    for (let i = 0; i < this.reactions.length; i++){
      let reaction = this.reactions[i];
      if (reaction.emojiNative == event.emoji.native){
        reaction.count++;
        this.reactionExists = true;
      }
    }

    if (!this.reactionExists) {
      this.reactions.push({
        'emojiNative': event.emoji.native,
        'count': 1,
        'reacted': false
      })
    }
    console.log(this.reactions);
  }

  addReactionFirebase(){

  }

  reactionPlus(reaction: Reaction){
    if(reaction.reacted){
      reaction.count--;
      reaction.reacted = false;
    }else{
      reaction.count++;
      reaction.reacted = true;
    }
  }
}
