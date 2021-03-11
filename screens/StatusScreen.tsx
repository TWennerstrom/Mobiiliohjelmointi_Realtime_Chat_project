import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';

import { getUser } from './queries';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import Colors from '../constants/Colors';

export default function StatusScreen() {

  const [status, setStatus] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect( () =>{
    const fetchStatus = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();

        const userData = await API.graphql(
          graphqlOperation(
            getUser, {
              id: userInfo.attributes.sub,
            }
          )
        )
      
      setStatus(userData.data.getUser.status);
      setAvatar(userData.data.getUser.imageUri);
      setUserName(userData.data.getUser.name);

      } catch (e) {
        console.log(e);
      }
    } 
    fetchStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hi, {userName}!</Text>
      <Image 
        style={styles.image}
        source={{uri: `${avatar}`}}
      />
      <Text style={styles.title}>{status}</Text>
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
  }
});
