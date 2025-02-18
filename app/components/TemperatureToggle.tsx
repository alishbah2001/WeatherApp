import React from "react"
import { View, Text, Switch, StyleSheet } from "react-native"

const TemperatureToggle = ({ unit, setUnit }) => {
  return (
    <View style={styles.toggleContainer}>
      <Text style={styles.label}>°C</Text>
      <Switch value={unit === "F"} onValueChange={() => setUnit(unit === "C" ? "F" : "C")} />
      <Text style={styles.label}>°F</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginHorizontal: 10,
  },
})

export default TemperatureToggle
