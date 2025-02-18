import React, { useState, useEffect, memo } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

const getWeatherStyles = (weather: string) => {
  switch (weather.toLowerCase()) {
    case "sunny":
      return { backgroundColor: "#FFD700", icon: "sunny" }
    case "cloudy":
      return { backgroundColor: "#A9A9A9", icon: "cloud" }
    case "rainy":
      return { backgroundColor: "#87CEEB", icon: "rainy" }
    default:
      return { backgroundColor: "#D3D3D3", icon: "partly-sunny" } // Default case
  }
}

const WeatherCard = ({ city, temperature, weather, unit, windSpeed, humidity }) => {
  const convertedTemp = unit === "C" ? temperature : (temperature * 9) / 5 + 32
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    loadFavoriteStatus()
  }, [city])

  const loadFavoriteStatus = async () => {
    const storedFavorites = await AsyncStorage.getItem("favorites")
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites)
      setIsFavorite(favorites.includes(city))
    }
  }

  const toggleFavorite = async () => {
    const storedFavorites = await AsyncStorage.getItem("favorites")
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : []

    if (isFavorite) {
      favorites = favorites.filter((favCity) => favCity !== city)
    } else {
      favorites.push(city)
    }

    await AsyncStorage.setItem("favorites", JSON.stringify(favorites))
    setIsFavorite(!isFavorite)
  }

  const { backgroundColor, icon } = getWeatherStyles(weather)

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={styles.city}>{city}</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="red" />
        </TouchableOpacity>
      </View>

      <Ionicons name={icon} size={50} color="white" style={styles.weatherIcon} />

      <Text style={styles.temp}>
        {convertedTemp.toFixed(1)}°{unit}
      </Text>
      <Text style={styles.weather}>{weather}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="cloudy" size={24} color="white" />
          <Text style={styles.infoText}>{windSpeed} km/h</Text>
          <Text style={styles.infoLabel}>Wind Speed</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="water" size={24} color="white" />
          <Text style={styles.infoText}>{humidity} %</Text>
          <Text style={styles.infoLabel}>Humidity</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  city: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  weatherIcon: {
    marginVertical: 10,
  },
  temp: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },
  weather: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    width: "100%",
  },
  infoItem: {
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginVertical: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
})

export default memo(WeatherCard)
