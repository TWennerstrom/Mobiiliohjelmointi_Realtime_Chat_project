import { NavigationContainer, DefaultTheme, DarkTheme, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, View, Image } from 'react-native';
import { MaterialCommunityIcons, Octicons  } from '@expo/vector-icons';

import NotFoundScreen from '../screens/NotFoundScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import { RootStackParamList } from '../types';
import TabNavigator from './TabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import Colors from "../constants/Colors"

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
          backgroundColor: Colors.light.tint,
          shadowOpacity: 0,
          elevation: 0,
      }, 
      headerTintColor: Colors.light.background,
      headerTitleAlign: 'center',
      headerTitleStyle:{
        fontWeight: 'bold',
      }
    }}>
      <Stack.Screen 
        name="Root" 
        component={TabNavigator}
        options={{
          title: "Chatty",
          headerRight: () => (
            <View style={{flexDirection: 'row', width: 60, justifyContent: 'space-between', marginRight: 10}}>
              <Octicons name="search" size={22} color={'white'} />
              <MaterialCommunityIcons name="dots-vertical" size={22} color={'white'} />
            </View>
          )
        }} />
      <Stack.Screen 
        name="ChatRoom" 
        component={ChatRoomScreen} 
        options={({ route }) => ({
          title: route.params.name,
          headerRight: () => (
            // touchableopacity & add functionality
            <View>
              <MaterialCommunityIcons name="dots-vertical" size={22} color={'white'} />
            </View>
          )
            
        })}
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
