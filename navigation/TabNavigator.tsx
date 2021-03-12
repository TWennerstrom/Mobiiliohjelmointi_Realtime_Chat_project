import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import {Fontisto} from '@expo/vector-icons';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ChatsScreen from '../screens/ChatsScreen';
import StatusScreen from '../screens/StatusScreen';
import CameraScreen from '../screens/CameraScreen';
import { TopTabParamList } from '../types';

const TopTab = createMaterialTopTabNavigator<TopTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <TopTab.Navigator
      initialRouteName="Chats"
      tabBarOptions={{ 
        activeTintColor: Colors[colorScheme].background,
        style: {
          backgroundColor: Colors[colorScheme].tint,
        },
        indicatorStyle: {
          backgroundColor: Colors[colorScheme].background,
          height: 4,
        },
        labelStyle: {
          fontWeight: 'bold'
        },
        showIcon: true, 
      }}>
      <TopTab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color }) => <Fontisto name="camera" color={color} size={18} />,
          tabBarLabel: () => null
        }}
      />
      <TopTab.Screen
        name="Chats"
        component={ChatsScreen}
      />
       <TopTab.Screen
        name="Status"
        component={StatusScreen}
      />
    </TopTab.Navigator>
  );
}