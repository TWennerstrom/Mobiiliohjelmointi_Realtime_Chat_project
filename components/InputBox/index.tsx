import React, { useEffect, useState } from 'react';
import { TextInput, View, TouchableOpacity} from 'react-native';
import styles from './style';

import { MaterialCommunityIcons, FontAwesome5, Entypo, Fontisto, MaterialIcons } from '@expo/vector-icons';
import { API, Auth, graphqlOperation } from 'aws-amplify';

import { createMessage, updateChatRoom } from '../../src/graphql/mutations';

const InputBox = (props) => {

    const { chatRoomID } = props;

    const [message, setMessage] = useState('');
    const [myUserID, setMyUserID] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            setMyUserID(userInfo.attributes.sub);
        }
        fetchUser();
    }, [])

    const onMicrophonePress = () => {
        console.warn ('Microphone')
    }

    const updateChatRoomLastMessage = async (messageID: String) => {
        try {
            await API.graphql(
                graphqlOperation(
                    updateChatRoom, {
                        input: {
                            id: chatRoomID,
                            lastMessageID: messageID,
                        }
                    }
                )
            )
        } catch (e) {
            console.log(e);
        }
    }

    const onSendPress = async () => {
        try {
            const newMessageData = await API.graphql(
                graphqlOperation(
                    createMessage, {
                        input: {
                            content: message,
                            userID: myUserID,
                            chatRoomID
                        }
                    }
                )
            )
            await updateChatRoomLastMessage(newMessageData.data.createMessage.id);
        }catch (e) {
            console.log(e);
        }


        setMessage('');

    }

    const onPress = () => {
        if (!message) {
            onMicrophonePress();
        } else {
            onSendPress();
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <FontAwesome5 name="laugh-beam" size={24} color="grey" />
                <TextInput 
                    placeholder={"Type a message"}
                    style={styles.textInput}
                    multiline
                    value={message}
                    onChangeText={setMessage}
                />
                <Entypo name="attachment" size={24} color="grey" style={styles.icon}/>
                {!message && <Fontisto name="camera" size={24} color="grey" style={styles.icon}/>}
            </View>
            <TouchableOpacity onPress={onPress}>
            <View style={styles.buttonContainer}>
                {!message
                    ? <MaterialCommunityIcons name="microphone" size={24} color="white" />
                    : <MaterialIcons name="send" size={28} color="white" />
                }
            </View>
            </TouchableOpacity>
        </View>
    )
}

export default InputBox;