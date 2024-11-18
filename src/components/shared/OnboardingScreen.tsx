import React from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

interface OnboardingScreenProps {
  setOnboardingComplete: (value: boolean) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  setOnboardingComplete,
}) => {
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem("onboardingComplete", "true");
      setOnboardingComplete(true);
    } catch (error) {
      console.error("Error setting onboardingComplete:", error);
    }
  };

  return (
    <LinearGradient colors={["#ffffff", "#f0f5f0"]} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/logo.png")} // Replace with your logo
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to Our App</Text>
        <Text style={styles.subtitle}>
          Discover a modern way to stay organized and achieve your goals.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleGetStarted} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: "contain",
  },
  textContainer: {
    marginBottom: 20,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#53a39c", // Olive green
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
