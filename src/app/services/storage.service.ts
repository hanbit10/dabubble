import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LoginCreateAccountService } from './login-create-account.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  downloadURL: string = '';  
  storage = getStorage();
  storageRef = ref(this.storage);  

  constructor(private logService: LoginCreateAccountService) {}

  uploadFile(file: File, directory: string) {    
    uploadBytes(ref(this.storageRef, `${directory}/${file.name}`), file)
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

  handleURL(directory: string) {
    if (directory === 'avatars') {
      this.logService.profile.profileImage = this.downloadURL;
      console.log(this.logService.profile);
    } else {
      // hier die URL für die anderen Dateien irgendwo speichern
    }
  }
}
