import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  where,
} from '@angular/fire/firestore';
import { UserProfile } from '../models/users';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  firestore: Firestore = inject(Firestore);

  private usersSubject = new BehaviorSubject<UserProfile[]>([]);
  private userByIdSubject = new BehaviorSubject<UserProfile>({} as UserProfile);
  allUsersOnSnapshot: UserProfile[] = [];

  users: UserProfile[] = [];
  mainUser: UserProfile = {} as UserProfile;
  userById: any = {} as UserProfile;
  unsubUsers;
  private usersSubscription!: Subscription;

  constructor() {
    this.unsubUsers = this.subUsersList();
  }

  async addUser(obj: {}) {
    const docRef = collection(this.firestore, 'users');
    const querySnapshot = await addDoc(docRef, obj);
    await setDoc(querySnapshot, { ...obj, uid: querySnapshot.id });
  }

  async getAllUsers() {
    let allUsers: UserProfile[] = [];
    const docRef = collection(this.firestore, 'users');
    const querySnapshot = await getDocs(docRef);
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as UserProfile;
      allUsers.push(userData);
    });
    return allUsers;
  }

  async getAllUsersOnSnapshot() {
    const docRef = collection(this.firestore, 'users');
    const querySnapshot = onSnapshot(docRef, (querySnapshot) => {
      this.allUsersOnSnapshot = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserProfile;
        this.allUsersOnSnapshot.push(userData);
      });
    });
  }

  /**
   * Updates the specified user document in Firestore.
   *
   * @param {object} user - The user object that should be updated
   * @param {string} userId - The Id of the user that should be updated
   */
  async updateUser(user: {}, userId: string) {
    const userRef = doc(collection(this.firestore, 'users'), userId);
    await updateDoc(userRef, user);
  }

  /**
   * Returns an observable stream of the users.
   */
  get users$() {
    return this.usersSubject.asObservable();
  }

  /**
   * Returns an observable stream of the user data by ID.
   */
  get userById$() {
    return this.userByIdSubject.asObservable();
  }

  /**
   * Subscribes to real-time updates for a user by their ID from Firestore.
   *
   * @param userId - The ID of the user to subscribe to.
   * @returns - A function to unsubscribe from the Firestore snapshot listener.
   */
  subUserById(userId: string) {
    const docRef = doc(this.firestore, 'users', userId);
    return onSnapshot(docRef, (doc) => {
      this.userById = doc.data();
      this.userByIdSubject.next(this.userById);
    });
  }

  /**
   * Subscribes to the Firestore 'users' collection and updates the local user list.
   *
   * @returns - A function to unsubscribe from the Firestore snapshot listener.
   */
  subUsersList() {
    const docRef = collection(this.firestore, 'users');
    return onSnapshot(docRef, (list) => {
      this.users = [];
      list.forEach((user) => {
        this.users.push(this.setUserObject(user.data()));
      });
      this.usersSubject.next(this.users);
    });
  }

  /**
   * Maps the provided object to a `UserProfile`.
   *
   * @param obj - The user object to be mapped to a `UserProfile`. It should contain the necessary user fields.
   * @returns {UserProfile} - A `UserProfile` object with the mapped properties.
   */
  setUserObject(obj: any): UserProfile {
    return {
      address: {
        city: obj.address.city,
        street: obj.address.street,
      },
      email: obj.email,
      name: obj.name,
      active: obj.active,
      password: obj.password,
      profileImage: obj.profileImage,
      uid: obj.uid,
    };
  }

  /**
   * Filters the list of users to find a user by their ID.
   *
   * @param userId - the Id of the user that should be filltered
   * @returns {UserProfile} - The user object of the found user
   */
  filterUserById(userId: string) {
    let foundUser: UserProfile = {} as UserProfile;
    let filteredUser = this.users.find((user) => {
      return user.uid === userId;
    });
    if (filteredUser) {
      foundUser = filteredUser;
    }

    return foundUser;
  }

  /**
   * Subscribes to the user stream and sets the main user based on the provided user ID.
   *
   * @param mainUserId - the Id of the user that is currently logged in
   */
  getMainUser(mainUserId: string) {
    this.usersSubscription = this.users$.subscribe((users) => {
      this.users = users;
      this.mainUser = this.filterUserById(mainUserId);
    });
  }

  /**
   * Searches through the list of users to find a user based on its Id and returns the name of the found user.
   *
   * @param {any} reactionUserId - the Id of the user which name should be returned
   * @returns {string} - name of the user or `undefined` if the user is not found
   */
  getUserNameById(reactionUserId: any) {
    let reactionUser = this.filterUserById(reactionUserId);
    return reactionUser.name;
  }

  getUsers(users: UserProfile[]) {
    const allUsers: UserProfile[] = [];
    users.forEach((user) => {
      if (user && user.uid) {
        allUsers.push(user);
      }
    });
    return allUsers;
  }

  async getUserByEmail(email: string) {
    const ref = collection(this.firestore, 'users');
    const q = query(ref, where('email', '==', email));
    const querySnapshot = getDocs(q);
    let userData = {} as UserProfile;
    (await querySnapshot).forEach((doc) => {
      userData = doc.data() as UserProfile;
    });
    return userData;
  }
}
