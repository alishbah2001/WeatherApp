import { FC, useCallback, useEffect, useState } from "react"
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View, Alert } from "react-native"
import { Text } from "../components"
import { AppStackScreenProps, navigate } from "../navigators"
import WeatherCard from "../components/WeatherCard"
import TemperatureToggle from "../components/TemperatureToggle"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"

interface HomescreenProps extends AppStackScreenProps<"Home"> {}

export const Homescreen: FC<HomescreenProps> = function Homescreen(_props) {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([]) // Store favorite cities
  const [unit, setUnit] = useState("C")
  const [error, setError] = useState("")

  useEffect(() => {
    const loadSearchesAndFavorites = async () => {
      const storedSearches = await AsyncStorage.getItem("recentSearches")
      const storedFavorites = await AsyncStorage.getItem("favorites")

      if (storedSearches) {
        const searches = JSON.parse(storedSearches)
        setRecentSearches(searches)
        if (searches.length > 0) {
          setCity(searches[0])
          fetchWeather(searches[0])
        }
      }

      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    }
    loadSearchesAndFavorites()
  }, [])

  const fetchWeather = async (searchCity = city) => {
    if (!searchCity.trim()) {
      setError("Please enter a city name.")
      return
    }

    try {
      // TODO:"Replace with your own IP address"
      const response = await fetch(`http://192.168.18.226:3000/weatherData?city=${searchCity}`)
      const data = await response.json()

      if (data.length > 0) {
        setWeather(data[0])
        setError("")
        saveRecentSearch(searchCity)
        await AsyncStorage.setItem("lastSearched", JSON.stringify(data[0]))
      } else {
        setError("City not found. Please try again.")
      }
    } catch (error) {
      console.error("Error fetching weather:", error)
      setError("Failed to fetch weather. Please check your connection.")
    }
  }

  const saveRecentSearch = async (newCity: string) => {
    setRecentSearches((prevSearches) => {
      const updatedSearches = [newCity, ...prevSearches.filter((c) => c !== newCity)].slice(0, 5)
      AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
      return updatedSearches
    })
  }

  const toggleFavorite = async () => {
    let updatedFavorites
    if (favorites.includes(city)) {
      updatedFavorites = favorites.filter((fav) => fav !== city) // Remove from favorites
    } else {
      updatedFavorites = [...favorites, city] // Add to favorites
    }

    setFavorites(updatedFavorites)
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  const renderRecentSearchItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.recentSearch}
        onPress={() => {
          setCity(item)
          fetchWeather(item)
        }}
      >
        <Text>{item}</Text>
      </TouchableOpacity>
    ),
    [],
  )

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          value={city}
          onChangeText={(text) => {
            setCity(text)
            setError("")
          }}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => fetchWeather(city)}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Show Error Message if Any */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Temperature Toggle */}
      <View style={styles.toggleContainer}>
        <TemperatureToggle unit={unit} setUnit={setUnit} />
      </View>

      {/* Weather Display & Favorite Icon */}
      {weather && !error && (
        <View style={styles.weatherContainer}>
          <WeatherCard
            city={weather.city}
            temperature={weather.temperature}
            weather={weather.weather}
            unit={unit}
            windSpeed={weather.windSpeed}
            humidity={weather.humidity}
          />
          {/* Heart Icon for Favorites */}
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Ionicons
              name={favorites.includes(city) ? "heart" : "heart-outline"}
              size={30}
              color="red"
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Recent Searches & View Favorites */}
      <View style={styles.recentFavoritesContainer}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <TouchableOpacity onPress={() => navigate("Favorites")}>
          <Text style={styles.viewFavorites}>View Favorites</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentSearches}
        keyExtractor={(item) => item}
        renderItem={renderRecentSearchItem}
        getItemLayout={(data, index) => ({
          length: 50,
          offset: 50 * index,
          index,
        })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E2CAA5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
    backgroundColor: "#806443",
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  recentSearch: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 5,
  },
  recentFavoritesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  viewFavorites: {
    fontSize: 16,
    color: "#806443",
    textDecorationLine: "underline",
  },
  weatherContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favoriteButton: {
    padding: 10,
  },
})
