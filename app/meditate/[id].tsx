import { View, Text, ImageBackground, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MEDITATIONS_IMAGES from "@/constants/meditation-images";
import AppGradient from "@/components/AppGradient";
import { router, useLocalSearchParams } from "expo-router";
import { Audio } from "expo-av";

import { MEDITATION_DATA, AUDIO_FILES } from "@/constants/MeditationData";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomButton from "@/components/CustomButton";
import { TimerContext } from "@/context/TimerContext";
const Meditate = () => {
  const { id } = useLocalSearchParams();

  const { duration: seccondsRemaining, setDuration } = useContext(TimerContext);

  // const [seccondsRemaining, setSecondsRemaining] = useState(10);
  const [isMeditating, setMeditating] = useState(false);
  const [audioSound, setSound] = useState<Audio.Sound>();
  const [isPlayingAudio, setPlayingAudio] = useState(false);

  useEffect(() => {
    if (seccondsRemaining === 0) {
      setMeditating(false);
      return;
    }
    let timerId: NodeJS.Timeout;
    if (isMeditating) {
      timerId = setTimeout(() => {
        setDuration(seccondsRemaining - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [seccondsRemaining, isMeditating]);

  useEffect(() => {
    return () => {
      setDuration(10);
      audioSound?.unloadAsync();
    };
  }, [audioSound]);

  const toggleMeditationSessionStatus = async () => {
    if (seccondsRemaining === 0) setDuration(10);

    setMeditating(!isMeditating);
    await toggleSound();
  };
  const toggleSound = async () => {
    const sound = audioSound ? audioSound : await initializeSound();
    const status = await sound?.getStatusAsync();
    if (status?.isLoaded && !isPlayingAudio) {
      await sound.playAsync();
      setPlayingAudio(true);
    } else {
      await sound.pauseAsync();
      setPlayingAudio(false);
    }
  };
  const initializeSound = async () => {
    const audioFileName = MEDITATION_DATA[Number(id) - 1].audio;
    const { sound } = await Audio.Sound.createAsync(AUDIO_FILES[audioFileName]);
    setSound(sound);
    return sound;
  };
  const handelAdjustDuration = () => {
    if (isMeditating) toggleMeditationSessionStatus();
    router.push("/(modal)/adjust-meditation-duration");
  };
  // Format time left
  const formattedTimeMinutes = String(
    Math.floor(seccondsRemaining / 60)
  ).padStart(2, "0");

  const formattedTimeSeconds = String(seccondsRemaining % 60).padStart(2, "0");
  return (
    <View className="flex-1">
      <ImageBackground
        source={MEDITATIONS_IMAGES[Number(id) - 1]}
        resizeMode="cover"
        className="flex-1"
      >
        <AppGradient colors={["transparent", "rgba(0,0,0,0.8)"]}>
          <Pressable
            onPress={() => router.back()}
            className="absolute top-16 left-6 z-10"
          >
            <AntDesign name="leftcircleo" size={45} color="white" />
          </Pressable>
          <View className="flex-1 justify-center">
            <View className="mx-auto bg-neutral-200 rounded-full w-44 h-44 items-center justify-center">
              <Text className="text-4xl text-blue-800 font-semibold font-rmono">
                {formattedTimeMinutes}:{formattedTimeSeconds}
              </Text>
            </View>
          </View>
          <View className="mb-5">
            <CustomButton
              onPress={handelAdjustDuration}
              title="Adjust Duration"
            />
            <CustomButton
              containerStyles="mt-4"
              onPress={toggleMeditationSessionStatus}
              title={isMeditating ? "Stop" : "Start Meditation"}
            />
          </View>
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default Meditate;
