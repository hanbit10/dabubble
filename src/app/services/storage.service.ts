import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { LoginCreateAccountService } from './login-create-account.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  downloadURL: string = '';  
  storage = getStorage();
  storageRef = ref(this.storage);  

  constructor(private logService: LoginCreateAccountService, private messService: MessageService) {}

  async uploadFile(file: File, directory: string) {    
    await uploadBytes(ref(this.storageRef, `${directory}/${file.name}`), file)
      .then((result: any) => {
        return getDownloadURL(result.ref);
      })
      .then((downloadURL) => {
        this.downloadURL = downloadURL;        
        this.handleURL(directory);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deleteFile(file: File) {
    deleteObject(ref(this.storage, `message_files/${file.name}`));
  }

  handleURL(directory: string) {
    if (directory === 'avatars') {
      this.logService.profile.profileImage = this.downloadURL;
      console.log(this.logService.profile);
    } else {
      this.messService.messageFileURL = this.downloadURL;      
    }
  }
}
