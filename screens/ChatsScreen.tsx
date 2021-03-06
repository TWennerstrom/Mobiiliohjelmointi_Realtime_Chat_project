import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { View } from '../components/Themed';
import ChatListItem from '../components/ChatListItem';
import { API, graphqlOperation, Auth } from 'aws-amplify';

import { getUser } from './queries';
import NewMessageButton from '../components/NewMessageButton';
import { onCreateMessage } from '../src/graphql/subscriptions';

export default function ChatScreen() {

  const [chatRooms, setChatRooms] = useState ([]);

  const fetchChatRooms = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();
      const userData : any = await API.graphql(
        graphqlOperation(
          getUser, {
            id: userInfo.attributes.sub,
          }
        )
      )
      setChatRooms(userData.data.getUser.chatRoomUser.items);
    } catch (e) {
      console.log(e);
    }
  } 

  useEffect( () => {
    fetchChatRooms();
  }, []);

  useEffect( () =>{    
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
  ).subscribe({
     next: (data) => {
         fetchChatRooms();
     } 
  });
  return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList 
        style={{width: '100%'}}
        data={chatRooms}
        renderItem={({item}) => <ChatListItem chatRoom={item.chatRoom} />}
        keyExtractor={(item) => item.id}
      />
      <NewMessageButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
