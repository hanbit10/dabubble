import { Component, Input } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
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
export class ProfileEditPictureComponent {
  @Input() src = '';

  avatarFile: File | null = null;
  avatars: Array<string> = [
    '/assets/img/profile/man1.svg',
    '/assets/img/profile/man2.svg',
    '/assets/img/profile/man3.svg',
    '/assets/img/profile/man4.svg',
    '/assets/img/profile/woman1.svg',
    '/assets/img/profile/woman2.svg',
  ];

  /**
   * Initializes a new instance of the class. 
   * Sets the source of the profile image to the current one.
   * 
   * @param profileService - The service responsible for managing user profiles.
   * @param userService - The service responsible for managing user data.
   * @param storage - The service responsible for handling Firestorage operations.
   */
  constructor(public profileService: ProfileService, public userService: UserService, private storage: StorageService) {
    if (this.userService.mainUser.profileImage) {
      this.src = this.userService.mainUser.profileImage;
    }
  }

  /**
   * Updates the `src` property with the specified path, allowing the user to choose a new avatar image.
   * 
   * @param {string} path - The path to the avatar image to be set.
   */
  chooseAvatar(path: string) {
    this.src = path;
  }

  /**
   * Handles the selection of an avatar file from an input event. It uploads it to the storage 
   * and updates the avatar source URL.
   * 
   * @param {Event} event - The event triggered by the file input, containing the selected file.
   */
  async onSelect(event: any) {
    this.avatarFile = event.target.files[0];

    if (this.avatarFile) {
      await this.storage.uploadFile(this.avatarFile, 'avatars');
    }

    if (this.storage.downloadURL) {
      this.src = this.storage.downloadURL;
    }
  }

  /**
   * Extracts the file name of the old image and deletes it from storage. 
   * Updates the user's profile image URL with the new image and saves the changes.
   */
  safeUserPic() {
    let oldImageUrl = this.userService.mainUser.profileImage;
    if (oldImageUrl) {
      let fileName = this.storage.extractFileNameFromUrl(oldImageUrl);
      if (fileName) {
        this.storage.deleteAvatar(fileName);
      }
    }
    this.userService.mainUser.profileImage = this.src;
    this.userService.updateUser(this.userService.mainUser, this.userService.mainUser.uid);
    this.profileService.editProfilePicIsOpen = false;
  }

  /**
   * Closes the section to edit the profile picture.
   * If a new picture was already uploaded - it gets deleted.
   */
  closeEdit() {
    if (this.avatarFile) {
      this.storage.deleteAvatar(this.avatarFile.name);
    }
    this.profileService.editProfilePicIsOpen = false;
  }
}
