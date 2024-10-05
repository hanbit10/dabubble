import { Injectable, inject } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { LoginCreateAccountService } from './login-create-account.service';
import { MessageService } from './message.service';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  downloadURL: string = '';  
  storage = getStorage();
  storageRef = ref(this.storage);  
  firestore: Firestore = inject(Firestore);

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

  deleteAvatar(file: string){
    deleteObject(ref(this.storage, `avatars/${file}`));
  }

  handleURL(directory: string) {
    if (directory === 'avatars') {
      this.logService.profile.profileImage = this.downloadURL;
      console.log(this.logService.profile);
    } else {
      this.messService.messageFileURL = this.downloadURL;      
    }
  }

  /**
   * Extracts the file name from a given URL.
   * 
   * @param {string} url - The URL from which the file name should be extracted.
   * @returns {string | null} - The extracted file name or null if the extraction fails.
   */
  extractFileNameFromUrl(url: string): string | null {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split('/');
    const lastPart = parts.pop();
    
    if (lastPart) {
      return lastPart.split('?')[0];
    }
    return null;
  }
}
