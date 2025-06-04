import React, { useRef, useEffect } from "react";
import {
  View,
  Text as RNText,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import texts from "../translation/texts";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../type";
import { SafeAreaProvider } from "react-native-safe-area-context";
// Custom Text component to disable font scaling globally
const Text = (props: any) => {
  return <RNText {...props} allowFontScaling={false} />;
};

const SupportPage = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // State for language toggle
  const [isTranslatingToTamil, setIsTranslatingToTamil] = useState(false);

  // Select appropriate text based on language
  const languageText = isTranslatingToTamil ? texts.tamil : texts.english;

  const language: "english" | "tamil" = isTranslatingToTamil
    ? "tamil"
    : "english";

  const handleTranslate = () => {
    setIsTranslatingToTamil(!isTranslatingToTamil);
    console.log("Translate button pressed");
  };

  // Animation references
  const coverImageOpacity = useRef(new Animated.Value(0)).current;
  const infoContainerSlide = useRef(new Animated.Value(50)).current;

  // Slide-in animation for info containers
  useEffect(() => {
    Animated.timing(coverImageOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(infoContainerSlide, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Function to open dialer with phone number
    const dialCall = (phoneNumber: string) => {
    try {
      Linking.openURL(`tel:${phoneNumber}`);
    } catch (error: unknown) {
      console.error("Error opening dialer:", error);
  
      if (error instanceof Error) {
        const isNetworkError =
          error.message.includes("Network request failed") ||
          error.message.includes("TypeError: Network") ||
          error.message.includes("fetch");
  
        if (isNetworkError) {
          console.error("Network Failed - Please Check Your Internet Connection");
        }
      }
    }
  };

  const handleBackPress = () => {
    navigation.navigate("Insights");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <ScrollView style={styles.container}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#020202" />
          </TouchableOpacity>
          {/* Translation */}
          <TouchableOpacity
            onPress={handleTranslate}
            style={styles.translateButton}
          >
            <Icon
              name={isTranslatingToTamil ? "language" : "translate"}
              size={20}
              color="#4169E1"
            />
            <Text style={styles.translateButtonText}>
              {isTranslatingToTamil ? "Translate to English" : "தமிழில் படிக்க"}
            </Text>
          </TouchableOpacity>

          {/* Cover Image with Fade-In Animation */}
          <Animated.Image
            source={require("../../assets/images/s.png")}
            style={[styles.coverImage, { opacity: coverImageOpacity }]}
          />

          {/* Main Content */}
                    
                    <View style={styles.content}>
            <Text style={styles.pageTitle}>App – Concept & Content</Text>
          
            <View style={styles.infoContainer}>
              <Text style={styles.mainName}>
                1. Dr.S.Madhavi M.Sc., Ph.D (N)
              </Text>
              <Text style={styles.roleText}>
                Professor cum Principal
              </Text>
              <Text style={styles.orgText}>
                KMCH College of Nursing
              </Text>
              <Text style={styles.mainName}>
                2. Ms.J.V.Jeevitha, M.Sc (N) & Ms. Priyadharshni. V ., M.Sc (N)
              </Text>
              <Text style={styles.roleText}>
                Assistant Professors
              </Text>
              <Text style={styles.orgText}>
                KMCH College of Nursing
              </Text>
              <Text style={styles.orgText}>
                Coimbatore
              </Text>
            </View>
          
            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>
                Under the guidance of
              </Text>
              <Text style={styles.mainName}>
                Dr.J.Balakumaran., MBBS, MD (Internal medicine), DM (Cardiology)
              </Text>
              <Text style={styles.roleText}>
                Consultant Interventional Cardiologist, KMCH & 
              </Text>
              
              <Text style={styles.sectionTitle}>
                The KMCH Consultant Cardiologist team
              </Text>
              <Text style={styles.teamList}>
                1. Dr. Thomas Alexander, MD., DM., FACC., FICC., FCSI{"\n"}
                2. Dr. Suresh Kumar Ramasamy,{"\n"}
                   MBBS., MD (General Medicine)., DM (Cardiology){"\n"}
                3. Dr. Saravanan D M T,{"\n"}
                   MBBS., MRCP (UK){"\n"}
                4. Dr. Mohan M,{"\n"}
                   MBBS., MD (Internal Medicine)., DM (Cardiology)
              </Text>
            </View>
          
            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>
                Project Sponsors:
              </Text>
              <Text style={styles.sponsorList}>
                1. The Tamil Nadu Dr. M.G.R. Medical University, Chennai.{"\n"}
                2. The Dr NGP Research & Educational Trust.
              </Text>
            </View>
          </View>
          
          
          
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    marginTop: 60,
    marginBottom: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  translateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android Shadow
    elevation: 5,
    position: "absolute", // Add absolute positioning
    top: 5, // Align to the top
    right: 20, // Align to the right
  },
  translateButtonText: {
    color: "#4169E1",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3a3a3a",
    textAlign: "center",
    marginBottom: 20,
    marginTop: -35,
  },
  coverImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 0,
    marginTop: -10,
  },
  content: {
    paddingHorizontal: 20,
  },
  infoContainer: {
    backgroundColor: "#ebebeb",
    padding: 20,
    borderRadius: 20,
    marginBottom: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  infoContainer3: {
    backgroundColor: "#ebebeb",
    padding: 20,
    borderRadius: 20,
    marginBottom: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  infoContainer4: {
    backgroundColor: "#ebebeb",
    padding: 20,
    borderRadius: 20,
    marginBottom: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  containerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3a3a3a",
  },
  containerSubText: {
    fontSize: 14,
    color: "#495057",
    marginTop: 4,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  phoneText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ea6830",
    marginLeft: 5,
  },
  phoneGif: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  backButton: {
    marginLeft: 20,
    marginTop: 5,
    backgroundColor: "#d7d7d7",
    padding: 7,
    width: "10%",
    alignItems: "center",
    borderRadius: 50,
  },
  
                   
          mainName: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#0d47a1", // Deeper blue for main names
            marginBottom: 8,  // More space between lines
            letterSpacing: 0.2,
          },
          roleText: {
            fontSize: 15,
            color: "#ea6830", // Orange for roles
            fontWeight: "600",
            marginBottom: 8,  // More space between lines
            letterSpacing: 0.1,
          },
          orgText: {
            fontSize: 14,
            color: "#00897b", // Teal for organization/location
            marginBottom: 8,  // More space between lines
            letterSpacing: 0.1,
          },
          sectionTitle: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#6a1b9a", // Purple for section titles
            marginBottom: 10,
            marginTop: 10,
            letterSpacing: 0.2,
          },
          andText: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#3a3a3a",
            textAlign: "center",
            marginVertical: 8, // More space
          },
          teamList: {
            fontSize: 14,
            color: "#37474f", // Dark gray for team list
            marginTop: 8,
            marginLeft: 8,
            marginBottom: 8,
            lineHeight: 22,
          },
          sponsorList: {
            fontSize: 14,
            color: "#00695c", // Green for sponsors
            marginTop: 8,
            marginLeft: 8,
            marginBottom: 8,
            lineHeight: 22,
          },
          
          
});

export default SupportPage;
