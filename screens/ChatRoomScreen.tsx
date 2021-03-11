import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { API, graphqlOperation, Auth } from 'aws-amplify';

import { messagesByChatRoom } from '../src/graphql/queries';
import { onCreateMessage } from '../src/graphql/subscriptions';
import ChatMessage from '../components/ChatMessage';
import BG from '../assets/images/BG.png';
import InputBox from "../components/InputBox";

const ChatRoomScreen = () => {

    const [messages, setMessages] = useState([]);
    const [myID, setMyID] = useState("");

    const route = useRoute();

    const fetchMessages = async () => {
        const messagesData = await API.graphql(
          graphqlOperation(
            messagesByChatRoom, {
              chatRoomID: route.params.id,
              sortDirection: "DESC",
            }
          )
        )
        setMessages(messagesData.data.messagesByChatRoom.items);
      }

    useEffect( () => {
        const fetchMessages = async () => {
            const messagesData = await API.graphql(
                graphqlOperation(
                    messagesByChatRoom, {
                        chatRoomID: route.params.id,
                        sortDirection: "DESC",
                    }
                )
            )
            setMessages(messagesData.data.messagesByChatRoom.items);
        }
        fetchMessages();
    }, [])

    useEffect(() => {
        const getMyID = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            setMyID(userInfo.attributes.sub);
        }
        getMyID();
    }, [])

    useEffect(() => {
        const subscription = API.graphql(
            graphqlOperation(onCreateMessage)
        ).subscribe({
           next: (data) => {
               const newMessage = data.value.data.onCreateMessage
               if (newMessage.chatRoomID !== route.params.id) {
                   return;
               }
               fetchMessages();
           } 
        });
        return () => subscription.unsubscribe();
    }, [])

    return (
        <ImageBackground style={{width: '100%', height: '100%'}}  source={BG}>
            <FlatList 
                data={messages}
                renderItem={({ item }) => <ChatMessage myID={myID} message={item} />}
                inverted
                keyExtractor={(item) => item.id}
            />
            <InputBox chatRoomID={route.params.id}/>
        </ImageBackground>
    )
}

export default ChatRoomScreen;