import { FC, useEffect, useState, useCallback } from "react"
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from "react-native"
import { Text } from "../components"
import { AppStackScreenProps } from "../navigators"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import WeatherCard from "../components/WeatherCard"

interface FavoritesScreenProps extends AppStackScreenProps<"Favorites"> {}

export const FavoritesScreen: FC<FavoritesScreenProps> = function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem("favorites")
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    }
    loadFavorites()
  }, [])

  const fetchWeather = async (city: string) => {
    setLoading(true)
    try {
      const response = await fetch(`http://192.168.18.226:3000/weatherData?city=${city}`)
      const data = await response.json()

      if (data.length > 0) {
        setWeather(data[0])
        setModalVisible(true) // Show modal when data is loaded
      } else {
        setWeather(null)
      }
    } catch (error) {
      console.error("Error fetching weather:", error)
      setWeather(null)
    }
    setLoading(false)
  }

  const handleCityPress = (city: string) => {
    setSelectedCity(city)
    fetchWeather(city)
  }

  const renderFavoriteItem = useCallback(
    ({ item }) => (
      <TouchableOpacity style={styles.favoriteItem} onPress={() => handleCityPress(item)}>
        <Text style={styles.favoriteText}>{item}</Text>
        <Ionicons name="heart" size={20} color="red" style={styles.heartIcon} />
      </TouchableOpacity>
    ),
    [],
  )

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      {/* Favorites List */}
      {favorites.length > 0 ? (
        <FlatList
          data={[...new Set(favorites)]} // Removes duplicate cities
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={renderFavoriteItem}
        />
      ) : (
        <Text style={styles.emptyMessage}>No favorite cities added yet.</Text>
      )}

      {/* Weather Details Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={30} color="black" />
            </TouchableOpacity>

            {loading ? (
              <ActivityIndicator size="large" color="#2D728F" />
            ) : (
              weather && (
                <WeatherCard
                  city={weather.city}
                  temperature={weather.temperature}
                  weather={weather.weather}
                  unit="C"
                  windSpeed={weather.windSpeed}
                  humidity={weather.humidity}
                />
              )
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E2CAA5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  favoriteItem: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  favoriteText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  heartIcon: {
    marginRight: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    height: "55%",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
})

export default FavoritesScreen
