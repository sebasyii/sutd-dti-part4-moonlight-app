import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { Container } from '~/components/Container';
import theme from '~/constants/colors';
import useBleStore from '~/hooks/useBle';
import { useSleepStore } from '~/stores/sleepStore';

export default function SleepSession() {
  const { napDuration, breathingMethod, breathingLightDuration, wakeUpLightDuration } =
    useSleepStore();
  const { sendDataToDevice, stopData } = useBleStore();
  const [timeLeft, setTimeLeft] = useState(Number(napDuration) * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setTimeLeft(Number(napDuration) * 60);
      stopData();
    }

    return () => clearInterval(interval!);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = async () => {
    if (isRunning) {
      setIsRunning(false);
      setTimeLeft(Number(napDuration) * 60);
      stopData();
    } else {
      setIsRunning(true);
      sendDataToDevice({
        breathingMethod,
        napDuration: Number(napDuration),
        breathingDuration: Number(breathingLightDuration),
        wakingUpLightDuration: Number(wakeUpLightDuration),
      });
    }
  };

  const handleCancel = () => {
    setIsRunning(false);
    setTimeLeft(Number(napDuration) * 60);
    stopData();
  };

  const progress = timeLeft / (Number(napDuration) * 60);

  return (
    <>
      <View style={styles.container}>
        <Container>
          <View style={styles.timerContainer}>
            <AnimatedCircularProgress
              size={300}
              width={15}
              fill={progress * 100}
              tintColor="#0575FF"
              backgroundColor={theme.colors.cardColor}
              rotation={0}
              lineCap="round"
              style={styles.progressCircle}>
              {() => <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>}
            </AnimatedCircularProgress>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.startButton} onPress={handleStartStop}>
              <Text style={[styles.buttonText, { color: theme.colors.black }]}>
                {isRunning ? 'Stop' : 'Start'}
              </Text>
            </Pressable>
          </View>
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
  progressCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  cancelButton: {
    backgroundColor: theme.colors.cardColor,
    alignItems: 'center',
    borderRadius: 12,
    elevation: 5,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  startButton: {
    flex: 1,
    backgroundColor: theme.colors.offwhite,
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
    fontWeight: '500',
    textAlign: 'center',
  },
});
