import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Linking,
  Switch,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const DashboardScreen = () => {
  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
  });
  const [darkMode, setDarkMode] = useState(false);

  // Animated values for animations
  const headerAnimation = new Animated.Value(0);
  const cardAnimation = new Animated.Value(0);
  const buttonAnimation = new Animated.Value(0);

  const handleDownload = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };

  const handleSpotifyPlay = async () => {
    try {
      await axios.get("http://192.168.29.17:5000/spotify_play");
    } catch (error) {
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };

  useEffect(() => {
    // Animate header on component mount
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Animate cards on component mount
    Animated.timing(cardAnimation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();

    // Animate buttons on component mount
    Animated.timing(buttonAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Fetch system info
    const fetchSystemInfo = async () => {
      try {
        const response = await axios.get(
          "http://192.168.29.17:5000/system_info"
        );
        if (response.status === 200) {
          const { cpu_usage, memory_usage, disk_usage } = response.data;
          setSystemInfo({
            cpuUsage: cpu_usage,
            memoryUsage: memory_usage,
            diskUsage: disk_usage,
          });
        } else {
          Alert.alert("Error", "Failed to fetch system information.");
        }
      } catch (error) {
        Alert.alert("Error", `An error occurred: ${error.message}`);
      }
    };

    const interval = setInterval(fetchSystemInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = async (endpoint) => {
    try {
      const response = await axios.post(
        `http://192.168.29.17:5000/${endpoint}`
      );
      if (response.status === 200) {
        Alert.alert(
          "Success",
          `${endpoint.replace("_", " ")} action successful.`
        );
      } else {
        Alert.alert(
          "Error",
          `Failed to perform ${endpoint.replace("_", " ")}. Please try again.`
        );
      }
    } catch (error) {
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };

  const handleHomeAuto = async () => {
    try {
      await axios.post("http://192.168.29.17:5000/home_auto");
    } catch (error) {
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };

  const adjustVolume = async (direction) => {
    try {
      if (direction === "up" || direction === "down") {
        // Handle volume up and volume down actions
        const response = await axios.post(
          `http://192.168.29.17:5000/adjust_volume/${direction}`
        );
        if (response.status === 200) {
          Alert.alert(
            "Success",
            `${direction.replace("_", " ")} action successful.`
          );
        } else {
          Alert.alert(
            "Error",
            `Failed to perform ${direction.replace(
              "_",
              " "
            )}. Please try again.`
          );
        }
      }
    } catch (error) {
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  // Interpolated animated styles for header
  const headerStyle = {
    opacity: headerAnimation,
    transform: [
      {
        translateY: headerAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 0],
        }),
      },
    ],
  };

  // Interpolated animated styles for cards
  const cardStyle = {
    opacity: cardAnimation,
    transform: [
      {
        translateY: cardAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  // Interpolated animated styles for buttons
  const buttonStyle = {
    opacity: buttonAnimation,
    transform: [
      {
        translateY: buttonAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        darkMode && styles.containerDark,
      ]}
    >
      <Animated.View style={[styles.headerContainer, headerStyle]}>
        <Animated.Text style={[styles.header, darkMode && styles.headerDark]}>
          PiMate.
        </Animated.Text>
        <View style={styles.volumeControl}>
          <TouchableOpacity
            style={styles.volumeButton}
            onPress={() => adjustVolume("up")}
          >
            <Ionicons
              name="add-circle-outline"
              size={48}
              color={darkMode ? "#7a5af5" : "#007bff"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.volumeButton}
            onPress={() => adjustVolume("down")}
          >
            <Ionicons
              name="remove-circle-outline"
              size={48}
              color={darkMode ? "#7a5af5" : "#007bff"}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      {/* System Usage Section */}
      <Animated.View
        style={[styles.card, cardStyle, darkMode && styles.cardDark]}
      >
        <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
          System Usage
        </Text>
        <View style={styles.usageContainer}>
          <Text style={[styles.usageLabel, darkMode && styles.usageLabelDark]}>
            CPU Usage
          </Text>
          <View style={[styles.progressBarContainer]}>
            <View
              style={[
                styles.progressBar,
                darkMode && styles.progressBardark,
                { width: `${systemInfo.cpuUsage}%` },
              ]}
            />
          </View>
          <Text
            style={[
              styles.usagePercentage,
              darkMode && styles.usagePercentageDark,
            ]}
          >
            {systemInfo.cpuUsage}%
          </Text>
        </View>
        <View style={styles.usageContainer}>
          <Text style={[styles.usageLabel, darkMode && styles.usageLabelDark]}>
            Memory Usage
          </Text>
          <View style={[styles.progressBarContainer]}>
            <View
              style={[
                styles.progressBar,
                darkMode && styles.progressBardark,
                { width: `${systemInfo.memoryUsage}%` },
              ]}
            />
          </View>
          <Text
            style={[
              styles.usagePercentage,
              darkMode && styles.usagePercentageDark,
            ]}
          >
            {systemInfo.memoryUsage}%
          </Text>
        </View>
        <View style={styles.usageContainer}>
          <Text style={[styles.usageLabel, darkMode && styles.usageLabelDark]}>
            Disk Usage
          </Text>
          <View style={[styles.progressBarContainer]}>
            <View
              style={[
                styles.progressBar,
                darkMode && styles.progressBardark,
                { width: `${systemInfo.diskUsage}%` },
              ]}
            />
          </View>
          <Text
            style={[
              styles.usagePercentage,
              darkMode && styles.usagePercentageDark,
            ]}
          >
            {systemInfo.diskUsage}%
          </Text>
        </View>
      </Animated.View>

      {/* Actions Section */}
      <Animated.View
        style={[styles.card, cardStyle, darkMode && styles.cardDark]}
      >
        <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
          Actions
        </Text>
        <View style={styles.buttonContainer}>
          {/* Buttons for actions */}
          {[
            { name: "make_note", icon: "create-outline", label: "Take Note" },
            { name: "send_sms", icon: "chatbox-outline", label: "Send SMS" },
            {
              name: "show_news",
              icon: "newspaper-outline",
              label: "Read News",
            },
            {
              name: "give_alpha",
              icon: "help-outline",
              label: "Ask Assistant",
            },
            {
              name: "give_translation",
              icon: "globe-outline",
              label: "Translate",
            },
            {
              name: "fetch_camera",
              icon: "camera-outline",
              label: "View Camera",
            },
          ].map((action, index) => (
            <Animated.View
              key={index}
              style={[styles.iconContainer, buttonStyle]}
            >
              <TouchableOpacity
                style={styles.circularIcon}
                onPress={() => handleButtonClick(action.name)}
              >
                <Ionicons
                  name={action.icon}
                  size={36}
                  color={darkMode ? "#ba9ffb" : "#007bff"}
                />
              </TouchableOpacity>
              <Text
                style={[styles.iconLabel, darkMode && styles.iconLabelDark]}
              >
                {action.label}
              </Text>
            </Animated.View>
          ))}
          {/* Spotify button */}
          <Animated.View style={[styles.iconContainer, buttonStyle]}>
            <TouchableOpacity
              style={styles.circularIcon}
              onPress={handleSpotifyPlay}
            >
              <Ionicons
                name="musical-notes-outline"
                size={36}
                color={darkMode ? "#ba9ffb" : "#007bff"}
              />
            </TouchableOpacity>
            <Text style={[styles.iconLabel, darkMode && styles.iconLabelDark]}>
              Spotify
            </Text>
          </Animated.View>
          {/* Home Automation button */}
          <Animated.View style={[styles.iconContainer, buttonStyle]}>
            <TouchableOpacity
              style={styles.circularIcon}
              onPress={handleHomeAuto}
            >
              <Ionicons
                name="home-outline"
                size={36}
                color={darkMode ? "#ba9ffb" : "#007bff"}
              />
            </TouchableOpacity>
            <Text style={[styles.iconLabel, darkMode && styles.iconLabelDark]}>
              Home Automation
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
      {/* Downloads Section */}
      <Animated.View
        style={[styles.card, cardStyle, darkMode && styles.cardDark]}
      >
        <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
          Download
        </Text>
        <View style={styles.buttonContainer}>
          <Animated.View style={[styles.iconContainer, buttonStyle]}>
            <TouchableOpacity
              style={styles.circularIcon}
              onPress={() => handleDownload("https://www.dropbox.com")}
            >
              <Ionicons
                name="download-outline"
                size={36}
                color={darkMode ? "#ba9ffb" : "#007bff"}
              />
            </TouchableOpacity>
            <Text style={[styles.iconLabel, darkMode && styles.iconLabelDark]}>
              Dropbox
            </Text>
          </Animated.View>
          <Animated.View style={[styles.iconContainer, buttonStyle]}>
            <TouchableOpacity
              style={styles.circularIcon}
              onPress={() => handleDownload("https://github.com")}
            >
              <Ionicons
                name="logo-github"
                size={36}
                color={darkMode ? "#ba9ffb" : "#007bff"}
              />
            </TouchableOpacity>
            <Text style={[styles.iconLabel, darkMode && styles.iconLabelDark]}>
              GitHub
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
      {/* Dark Mode Switch */}
      <Animated.View style={[styles.darkModeSwitch, buttonStyle]}>
        <Text style={styles.darkModeText}>Mode</Text>
        <Switch
          trackColor={{ false: "#8b8b8b", true: "#8b8b8b" }}
          thumbColor={darkMode ? "#ba9ffb" : "#007bff"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDarkMode}
          value={darkMode}
        />
      </Animated.View>
      <Text style={[styles.footerText, darkMode && styles.footerTextDark]}>
        Made with the power of Raspberry Pi🍓 and designed by React ⚛
      </Text>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#D4E2D4",
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: "center",
  },
  containerDark: {
    backgroundColor: "#121212", // Adjust opacity as needed
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 60,
    fontWeight: "bold",
    textAlign: "left",
    color: "#666",
  },
  headerDark: {
    color: "rgb(210, 228, 222)",
  },
  volumeControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  volumeButton: {
    marginLeft: 10,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 8,
    padding: 15,
    elevation: 5, // Adding 3d drop shadow effect
  },
  cardDark: {
    backgroundColor: "#282828", // Adjust opacity as needed
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#007bff",
  },
  cardTitleDark: {
    color: "#fff",
  },
  usageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  usageLabel: {
    flex: 1,
    color: "#666",
  },
  usageLabelDark: {
    color: "#fff",
  },
  progressBarContainer: {
    flex: 3,
    height: 10,
    backgroundColor: "#8b8b8b",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  progressBardark: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7a5af5",
  },
  usagePercentage: {
    flex: 1,
    textAlign: "right",
    color: "#666",
  },
  usagePercentageDark: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  circularIcon: {
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    width: "48%",
    marginBottom: 10,
  },
  iconLabel: {
    textAlign: "center",
    color: "#666",
  },
  iconLabelDark: {
    color: "#fff",
  },
  footerText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  footerTextDark: {
    color: "#D3D3D3",
  },
  darkModeSwitch: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  darkModeText: {
    marginRight: 5,
    color: "#666",
  },
});

export default DashboardScreen;
