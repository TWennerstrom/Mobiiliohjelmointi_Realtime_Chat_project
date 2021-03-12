export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  ChatRoom: undefined;
  Contacts: undefined;
  Camera: undefined;
};

export type TopTabParamList = {
  Camera: undefined;
  Chats: undefined;
  Status: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type User = {
  id: String;
  name: String;
  imageUri: String;
  status: String;
}

export type Message = {
  id: String;
  content: String;
  createdAt: string;
  user: User;
}

export type ChatRoom = {
  id: String;
  lastMessage: Message;
  chatRoomUsers: User[];
}