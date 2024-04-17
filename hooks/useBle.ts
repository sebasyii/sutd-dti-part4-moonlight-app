import * as ExpoDevice from 'expo-device';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { btoa } from 'react-native-quick-base64';
import { create } from 'zustand';

interface BluetoothLowEnergyApi {
  bleManager: BleManager;
  allDevices: Device[];
  connectedDevice: Device | null;
  setAllDevices: (device: Device) => void;
  disconnectFromDevice: () => void;
  connectToDevice: (device: Device) => Promise<void>;
  stopData: () => Promise<void>;
  sendDataToDevice: (data: {
    breathingMethod: string;
    napDuration: number;
    breathingDuration: number;
    wakingUpLightDuration: number;
  }) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  scanForPeripherals: () => void;
}

const requestAndroidPermissions = async () => {
  const bluetoothScanPermission = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    {
      title: 'Bluetooth Scan Permission',
      message: 'App needs access to Bluetooth scan',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }
  );

  const bluetoothConnectPermission = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    {
      title: 'Bluetooth Connect Permission',
      message: 'App needs access to Bluetooth connect',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }
  );

  const bluetoothFineLocationPermission = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Bluetooth Fine Location Permission',
      message: 'App needs access to Bluetooth fine location',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }
  );

  return (
    bluetoothScanPermission === PermissionsAndroid.RESULTS.GRANTED &&
    bluetoothConnectPermission === PermissionsAndroid.RESULTS.GRANTED &&
    bluetoothFineLocationPermission === PermissionsAndroid.RESULTS.GRANTED
  );
};

// Create Zustand store with types
const useBleStore = create<BluetoothLowEnergyApi>((set, get) => ({
  bleManager: new BleManager(),
  allDevices: [],
  connectedDevice: null,

  setAllDevices: (device) => {
    const isDuplicteDevice = (nextDevice: Device) =>
      get().allDevices.findIndex((d) => d.id === nextDevice.id) > -1;

    if (!isDuplicteDevice(device)) {
      set((state) => ({ allDevices: [...state.allDevices, device] }));
    }
  },

  disconnectFromDevice: () => {
    const { connectedDevice, bleManager } = get();
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      set({ connectedDevice: null });
    }
  },

  connectToDevice: async (device: Device) => {
    const { bleManager } = get();
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      set({ connectedDevice: deviceConnection });
      console.log('Device connected successfully');
    } catch (e) {
      console.error('FAILED TO CONNECT', e);
    }
  },

  stopData: async () => {
    const { connectedDevice, bleManager } = get();
    if (!connectedDevice) {
      console.warn('No device connected');
      return;
    }
    const base64Data = btoa('0');

    try {
      await bleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        '8c6332b8-bf32-4220-ad31-0d8c19003330',
        '3a7f4056-0b5b-40be-99ba-fbe21644bd47',
        base64Data
      );
      console.log('Data sent successfully');
    } catch (error) {
      console.error('Error sending data:', error);
    }
  },

  sendDataToDevice: async ({
    breathingMethod,
    napDuration,
    breathingDuration,
    wakingUpLightDuration,
  }) => {
    const { connectedDevice, bleManager } = get();
    if (!connectedDevice) {
      console.warn('No device connected');
      return;
    }
    const data = `${breathingMethod}-${napDuration}-${breathingDuration}-${wakingUpLightDuration}`;
    console.log('Data:', data);
    const base64Data = btoa(data);

    try {
      await bleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        '8c6332b8-bf32-4220-ad31-0d8c19003330',
        '3a7f4056-0b5b-40be-99ba-fbe21644bd47',
        base64Data
      );
      console.log('Data sent successfully');
    } catch (error) {
      console.error('Error sending data:', error);
    }
  },

  requestPermissions: async () => {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted = await requestAndroidPermissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  },

  scanForPeripherals: () => {
    const { bleManager } = get();
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }
      if (device && device.name) {
        get().setAllDevices(device);
      }
    });
    setTimeout(() => {
      bleManager.stopDeviceScan();
    }, 10000);
  },
}));

export default useBleStore;
