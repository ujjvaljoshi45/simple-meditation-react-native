import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Content = ({ children }: any) => {
  return <SafeAreaView className="flex-1 px-4 py-6">{children}</SafeAreaView>;
};

export default Content;
