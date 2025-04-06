import React from 'react';
import { StyleSheet, View } from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/types';
import {BluetoothScanner} from '../components/BluetoothScanner';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanDevices'>;

export const ScanDevicesScreen: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <BluetoothScanner />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
