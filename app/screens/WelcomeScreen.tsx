import { FC } from "react"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { Text } from "@/components"
import { AppStackScreenProps, navigate } from "../navigators"
import { spacing } from "@/theme"

// const welcomeLogo = require("../../assets/images/")
const welcomeLogo = require("../../assets/images/welcomeImage.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen(_props) {
  return (
    <View style={styles.container}>
      {/* Weather Icon */}
      <Image source={welcomeLogo} style={styles.weatherIcon} />

      {/* Title & Subtitle */}
      <View style={{ marginTop: spacing.sm, alignItems: "center" }}>
        <Text style={styles.title}>City Weather Info</Text>
        <Text style={styles.subtitle}>
          Search and explore weather details for different cities.
        </Text>
      </View>
      {/* Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigate("Home")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2CAA5",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  weatherIcon: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#806443",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#806443",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
})
