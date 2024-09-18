export interface Channel {
  name: string;
  description: string;
  uid: string;
  usersIds: string[];
}

export interface Reaction{
  emojiNative: string;
  count: number;
  reacted: boolean;
}