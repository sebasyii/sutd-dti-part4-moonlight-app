import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Alert, FlatList, Pressable, Text, View, StyleSheet } from 'react-native';

import { Container } from '~/components/Container';
import theme from '~/constants/colors';
import { useSleepStore } from '~/stores/sleepStore';

type SettingsMap = {
  [key: string]: {
    data: string[];
    label: string;
  };
};

type SettingsAction = {
  [key: string]: () => void;
};

type CurrentValue = {
  [key: string]: string;
};

const SETTINGS_MAP: SettingsMap = {
  'nap-duration': {
    data: ['3', '15', '20', '25', '30'],
    label: 'minutes',
  },
  'breathing-method': {
    data: ['4-7-8', 'Box Breathing'],
    label: '',
  },
  'breathing-light-duration': {
    data: ['1', '5', '10', '15'],
    label: 'minutes',
  },
  'wake-up-light-duration': {
    data: ['1', '2', '3'],
    label: 'minutes',
  },
};

export default function SleepSessionSettings() {
  const { sleep_session_settings } = useLocalSearchParams<{ sleep_session_settings: string }>();

  const {
    napDuration,
    breathingMethod,
    breathingLightDuration,
    wakeUpLightDuration,
    setNapDuration,
    setBreathingMethod,
    setBreathingLightDuration,
    setWakeUpLightDuration,
  } = useSleepStore();

  const currentSettings = SETTINGS_MAP[sleep_session_settings];

  const updateSetting = (key: string, value: string) => {
    // Convert all to numbers
    const napDurationInt = Number(napDuration);
    const breathingLightDurationInt = Number(breathingLightDuration);
    const wakeUpLightDurationInt = Number(wakeUpLightDuration);
    const valueInt = Number(value);

    const isValid = () => {
      if (key === 'breathing-light-duration') {
        if (valueInt + wakeUpLightDurationInt > napDurationInt) {
          Alert.alert('Invalid Duration', 'Total light duration cannot exceed the nap duration.');
          return false;
        }
      }
      if (key === 'wake-up-light-duration') {
        const totalLightDuration = valueInt + breathingLightDurationInt;
        if (totalLightDuration > napDurationInt) {
          Alert.alert('Invalid Duration', 'Total light duration cannot exceed the nap duration.');
          return false;
        }
      }
      if (key === 'nap-duration') {
        if (
          breathingLightDurationInt > valueInt ||
          breathingLightDurationInt + wakeUpLightDurationInt > valueInt
        ) {
          Alert.alert(
            'Invalid Duration',
            'Nap duration must be longer than the total light duration.'
          );
          return false;
        }
      }
      return true;
    };

    if (isValid()) {
      // Update the store with the new value
      const settingActions: SettingsAction = {
        'nap-duration': () => setNapDuration(value),
        'breathing-method': () => setBreathingMethod(value),
        'breathing-light-duration': () => setBreathingLightDuration(value),
        'wake-up-light-duration': () => setWakeUpLightDuration(value),
      };
      const updateAction = settingActions[key];
      if (updateAction) {
        updateAction();
      }
    }
  };

  const getCurrentValue = () => {
    const values: CurrentValue = {
      'nap-duration': napDuration,
      'breathing-method': breathingMethod,
      'breathing-light-duration': breathingLightDuration,
      'wake-up-light-duration': wakeUpLightDuration,
    };
    return values[sleep_session_settings];
  };

  const currentValue = getCurrentValue();

  return (
    <>
      <View style={styles.container}>
        <Container>
          <FlatList
            data={currentSettings.data}
            contentContainerStyle={{ gap: 5 }}
            renderItem={({ item }) => (
              <Pressable onPress={() => updateSetting(sleep_session_settings, item)}>
                <View
                  style={[styles.itemContainer, currentValue === item && styles.pressedContainer]}>
                  <Text style={[styles.itemText, currentValue === item && styles.pressedText]}>
                    {item} {currentSettings.label}
                  </Text>
                  {currentValue === item && (
                    <MaterialCommunityIcons name="check" size={14} color="black" />
                  )}
                </View>
              </Pressable>
            )}
          />
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.cardColor,
    marginBottom: 2,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 18,
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
  text: {
    color: '#000',
  },
});
