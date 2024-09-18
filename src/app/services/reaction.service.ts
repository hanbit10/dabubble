import { Injectable } from '@angular/core';
import { Reaction } from '../models/channels';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  reactions: Reaction[] = [];
  reactionEmoji: string = '';

  public editTextArea: string = 'Welche Version ist aktuell von Angular?';
  public isEmojiPickerVisible: boolean = false;
  
  reactionExists = false;

  constructor() { }


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
