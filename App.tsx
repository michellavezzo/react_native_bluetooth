import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from './src/screens/HomeScreen';
import {ScanDevicesScreen} from './src/screens/ScanDevicesScreen';
import type {RootStackParamList} from './src/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f5f5f5',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            // options={{
            //     title: 'Home',
            // }}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ScanDevices"
            component={ScanDevicesScreen}
            options={{
              title: 'Scan Devices',
              headerBackTitle: 'Back',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
