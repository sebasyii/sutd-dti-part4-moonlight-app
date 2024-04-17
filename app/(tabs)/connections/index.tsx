import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { View, Pressable, Text, FlatList, StyleSheet } from 'react-native';
import { Device } from 'react-native-ble-plx';

import { Container } from '~/components/Container';
import theme from '~/constants/colors';
import useBleStore from '~/hooks/useBle';

export default function Connections() {
  const {
    allDevices,
    connectedDevice,
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
  } = useBleStore();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((currentCountdown) => currentCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [countdown]);

  const scanForDevices = async () => {
    if (!isScanningEnabled) return; // Prevent scanning if not enabled
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
    setIsScanningEnabled(false); // Disable the button
    setCountdown(10); // Start countdown from 10 seconds
    setTimeout(() => setIsScanningEnabled(true), 10000); // Re-enable the button after 10 seconds
  };

  const getButtonLabel = () => {
    if (!isScanningEnabled) return `Available in ${countdown} secs`;
    return 'Start Scanning';
  };

  return (
    <>
      <View style={styles.container}>
        <Container>
          {connectedDevice ? (
            <View style={[styles.container, styles.connectedContainer]}>
              <Text style={styles.title}>Device Connected</Text>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Device Information</Text>
                <Text style={styles.cardContent}>Device Name: Moonlight</Text>
                <Text style={styles.cardContent}>Device ID: 123213</Text>
              </View>
              <Pressable style={styles.disconnectButton} onPress={disconnectFromDevice}>
                <Text style={styles.buttonText}>Disconnect</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Connect your Device</Text>
              <FlatList
                data={allDevices}
                ListEmptyComponent={() => <Text style={styles.subtitle}>No devices found</Text>}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 5 }}
                renderItem={({ item }) => (
                  <Pressable onPress={() => setSelectedDevice(item)}>
                    <View
                      style={[
                        styles.presetItem,
                        selectedDevice === item && styles.pressedPresetItem,
                      ]}>
                      <Text
                        style={[
                          styles.presetTitle,
                          selectedDevice === item && styles.pressedTitle,
                        ]}>
                        {item.name}
                      </Text>
                      <View style={styles.presetDetailsContainer}>
                        <Text style={styles.presetDetail}>{item.id}</Text>
                      </View>
                    </View>
                  </Pressable>
                )}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.itemContainer,
                  pressed && styles.pressedContainer,
                  !isScanningEnabled && styles.disabledContainer,
                ]}
                onPress={scanForDevices}
                disabled={!isScanningEnabled}>
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.itemText,
                      pressed && styles.pressedText,
                      !isScanningEnabled && styles.disabledButtonText,
                    ]}>
                    {getButtonLabel()}
                  </Text>
                )}
              </Pressable>
              <Pressable
                disabled={selectedDevice === null}
                onPress={() => connectToDevice(selectedDevice!)}>
                <LinearGradient
                  // Button Linear Gradient
                  start={{ x: 0.1, y: 0.9 }}
                  end={{ x: 0.9, y: 0.1 }}
                  colors={selectedDevice === null ? ['#C0C0C0', '#C0C0C0'] : ['#0575FF', '#FF64AE']}
                  style={styles.button}>
                  <Text
                    style={selectedDevice === null ? styles.disabledButtonText : styles.buttonText}>
                    Connect To Device
                  </Text>
                </LinearGradient>
              </Pressable>
            </>
          )}
        </Container>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.backgroundColor,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginVertical: 30,
  },
  subtitle: {
    color: theme.colors.white,
    fontWeight: '500',
    fontSize: 18,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.cardColor,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
  disabledContainer: {
    backgroundColor: '#DADADA',
  },
  pressedContainer: {
    backgroundColor: theme.colors.white,
  },
  pressedText: {
    color: theme.colors.black,
  },
  itemText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    borderRadius: 12,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButtonText: {
    color: '#686868',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  customPowerNapContainer: {
    marginVertical: 50,
    gap: 15,
  },

  presetsList: {
    marginTop: 20,
    gap: 10,
  },
  presetItem: {
    backgroundColor: theme.colors.cardColor,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    // shadowColor: theme.colors.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    elevation: 3,
  },
  pressedPresetItem: {
    backgroundColor: theme.colors.white,
  },
  presetTitle: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  presetDetail: {
    color: '#686a73',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  presetDetailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressedTitle: {
    color: theme.colors.black,
  },
  pressedDetailsContainer: {
    backgroundColor: theme.colors.white,
  },

  card: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.cardColor,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.white,
  },
  cardContent: {
    fontSize: 16,
    marginBottom: 5,
    color: '#686a73',
  },
  disconnectButton: {
    backgroundColor: '#ff4444',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  connectedContainer: {
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
});
