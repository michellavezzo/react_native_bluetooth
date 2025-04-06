import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  PermissionsAndroid,
  Alert,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
}

export const BluetoothScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);

  useEffect(() => {
    // Initialize BLE manager
    BleManager.start({ showAlert: false }).then(() => {
      console.log('BLE Manager initialized');
    });

    // Add event listener for discovered devices
    const discoveryListener = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    // Add event listener for scan status
    const stopListener = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      handleStopScan,
    );

    return () => {
      discoveryListener.remove();
      stopListener.remove();
      BleManager.stopScan();
    };
  }, []);

  const handleDiscoverPeripheral = (peripheral: any) => {
    console.log('Discovered peripheral:', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'Unknown Device';
    }
    setDevices(prevDevices => {
      // Check if device already exists
      const deviceExists = prevDevices.some(device => device.id === peripheral.id);
      if (deviceExists) {
        return prevDevices;
      }
      return [...prevDevices, {
        id: peripheral.id,
        name: peripheral.name,
        rssi: peripheral.rssi,
      }];
    });
  };

  const handleStopScan = () => {
    console.log('Scan stopped');
    setIsScanning(false);
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Bluetooth Low Energy requires Location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startScan = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Location permission is required for BLE');
        return;
      }

      setIsScanning(true);
      setDevices([]);

      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning started');
        })
        .catch(error => {
          console.error('Scanning failed', error);
          Alert.alert('Error', 'Failed to start scanning');
          setIsScanning(false);
        });
    } catch (error) {
      console.error('Error during scan:', error);
      setIsScanning(false);
    }
  };

  const renderDevice = ({ item }: { item: BluetoothDevice }) => (
    <View style={styles.deviceContainer}>
      <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
      <Text style={styles.deviceInfo}>ID: {item.id}</Text>
      <Text style={styles.deviceInfo}>Signal Strength: {item.rssi} dBm</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isScanning && styles.buttonDisabled]}
        onPress={isScanning ? handleStopScan : startScan}
        // disabled={isScanning}
        >
        <Text style={styles.buttonText}>
          {isScanning ? 'Stop Scan' : 'Scan for Devices'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isScanning
              ? 'Scanning for devices...'
              : 'No devices found. Tap scan to start searching.'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ff0011',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  deviceContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  deviceInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
});
