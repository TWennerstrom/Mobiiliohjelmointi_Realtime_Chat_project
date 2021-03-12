import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity } from 'react-native';

import { getUser } from './queries';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import Colors from '../constants/Colors';
import { updateUser } from '../src/graphql/mutations';

export default function StatusScreen() {

  const [status, setStatus] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [userName, setUserName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [userID, setUserID] = useState('');

  const onConfirmPress = async () => {
    try {
      const newNameData = await API.graphql(
        graphqlOperation(
          updateUser, {
            input: {
              id: userID,
              name: newUserName,
              imageUri: avatar,
              status: status,
            }
          }
        )
      )
    } catch (e) {
      console.log(e);
    }
    setNewUserName('');
    fetchStatus();
  };

  const onChangeStatusPress = async () => {
    try {
      const newStatusData = await API.graphql(
        graphqlOperation(
          updateUser, {
            input: {
              id: userID,
              name: userName,
              imageUri: avatar,
              status: newStatus,
            }
          }
        )
      )
    } catch (e) {
      console.log(e);
    }
    setNewStatus('');
    fetchStatus();
  };

  useEffect( () =>{    
    fetchStatus();
  }, []);

    const fetchStatus = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();

        const userData : any = await API.graphql(
          graphqlOperation(
            getUser, {
              id: userInfo.attributes.sub,
            }
          )
        )
      
      setStatus(userData.data.getUser.status);
      setAvatar(userData.data.getUser.imageUri);
      setUserName(userData.data.getUser.name);
      setUserID(userData.data.getUser.id);

      } catch (e) {
        console.log(e);
      }
    } 


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hi, {userName}!</Text>
      <View style={styles.nameChange}>
        <TextInput 
          placeholder= "Change username"
          value={newUserName}
          onChangeText={setNewUserName}
        />
        <TouchableOpacity onPress={onConfirmPress}>
          <Text style={{color: Colors.light.tint}}>Confirm</Text>
        </TouchableOpacity>
      </View>
      <Image 
        style={styles.image}
        source={{uri: `${avatar}`}}
      />
      <View>
        <Text>You current status is:</Text>
        <TextInput 
          placeholder= {status}
          value={newStatus}
          onChangeText={setNewStatus}
        />
        <TouchableOpacity onPress={onChangeStatusPress}>
          <Text style={{color: Colors.light.tint}}>Change status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: Colors.light.tint,
  },
  nameChange:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 5,
  },
});
