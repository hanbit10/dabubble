import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from '../../models/users';
import { ProfileService } from '../../services/profile.service';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-profile-edit-picture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-edit-picture.component.html',
  styleUrl: './profile-edit-picture.component.scss'
})
export class ProfileEditPictureComponent{
  @Input()src = '';

  avatarFile: File | null = null;
  avatars: Array<string> = [
    '/assets/img/profile/man1.svg',
    '/assets/img/profile/man2.svg',
    '/assets/img/profile/man3.svg',
    '/assets/img/profile/man4.svg',
    '/assets/img/profile/woman1.svg',
    '/assets/img/profile/woman2.svg',
  ];

  constructor(public profileService: ProfileService, public userService: UserService, public logService: LoginCreateAccountService, private dataBase: UserService,
    private storage: StorageService){
      if (this.userService.mainUser.profileImage) {
        this.src = this.userService.mainUser.profileImage;
      }
    }

  chooseAvatar(path: string) {
    this.src = path;
  }

  async onSelect(event: any) {
    this.avatarFile = event.target.files[0];
    if (this.avatarFile instanceof File) {
      await this.storage.uploadFile(this.avatarFile, 'avatars');
    }
    if (this.storage.downloadURL) {
      this.src = this.storage.downloadURL; 
    }
  }

  safeUserPic(){
    let oldAvatar: any = this.userService.mainUser.profileImage;
    console.log(oldAvatar);
    
      this.storage.deleteAvatar(oldAvatar); 
    
    this.userService.mainUser.profileImage = this.src;
    console.log(this.src);
    
    this.userService.updateUser(this.userService.mainUser, this.userService.mainUser.uid);
    this.profileService.editProfilePicIsOpen = false;
  }

  closeEdit(){
    if (this.avatarFile) {
      console.log(this.avatarFile.name);
      
      this.storage.deleteAvatar(this.avatarFile.name);
    }
    this.profileService.editProfilePicIsOpen = false;
  }
}
