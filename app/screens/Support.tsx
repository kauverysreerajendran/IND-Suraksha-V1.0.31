import React, { useRef, useEffect, useState } from "react";
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

  const handleTranslate = () => {
    setIsTranslatingToTamil(!isTranslatingToTamil);
  };

  // Animation references
  const coverImageOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(coverImageOpacity, {
      toValue: 1,
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
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#222" />
            </TouchableOpacity>
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
          </View>

          {/* Cover Image with Fade-In Animation */}
          <Animated.Image
            source={require("../../assets/images/s7.jpg")}
            style={[styles.coverImage, { opacity: coverImageOpacity }]}
          />

          {/* Main Content */}
          <View style={styles.proContent}>
            <Text style={styles.proPageTitle}>App – Concept & Content</Text>

            <View style={styles.proCard}>
              <Text style={styles.proSectionHeader}>Development Team</Text>
              <View style={styles.proListItemRow}>
                <Icon name="person" size={20} color="#0d253f" style={styles.proIcon} />
                <View>
                  <Text style={styles.proName}>Dr. S. Madhavi, M.Sc., Ph.D (N)</Text>
                  <View style={styles.proRoleRow}>
                    <Icon name="school" size={16} color="#374151" style={styles.proIconSmall} />
                    <Text style={styles.proRole}>Professor & Principal</Text>
                  </View>
                  <View style={styles.proRoleRow}>
                    <Icon name="location-city" size={16} color="#6b7280" style={styles.proIconSmall} />
                    <Text style={styles.proOrg}>KMCH College of Nursing</Text>
                  </View>
                </View>
              </View>
              <View style={styles.proListItemRow}>
                <Icon name="people" size={20} color="#0d253f" style={styles.proIcon} />
                <View>
                  <Text style={styles.proName}>Ms. J.V. Jeevitha, M.Sc (N)</Text>
                  <Text style={styles.proName}>Ms. Priyadharshni. V, M.Sc (N)</Text>
                  <View style={styles.proRoleRow}>
                    <Icon name="school" size={16} color="#374151" style={styles.proIconSmall} />
                    <Text style={styles.proRole}>Assistant Professors</Text>
                  </View>
                  <View style={styles.proRoleRow}>
                    <Icon name="location-city" size={16} color="#6b7280" style={styles.proIconSmall} />
                    <Text style={styles.proOrg}>KMCH College of Nursing, Coimbatore</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.proCard}>
              <Text style={styles.proSectionHeader}>Guidance</Text>
              <View style={styles.proListItemRow}>
                <Icon name="local-hospital" size={20} color="#0d253f" style={styles.proIcon} />
                <View>
                  <Text style={styles.proName}>Dr. J. Balakumaran, MBBS, MD, DM (Cardiology)</Text>
                  <View style={styles.proRoleRow}>
                    <Icon name="medical-services" size={16} color="#374151" style={styles.proIconSmall} />
                    <Text style={styles.proRole}>Consultant Interventional Cardiologist, KMCH</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.proSectionSubHeader}>Consultant Cardiologist Team</Text>
              <View style={styles.proTeamList}>
                <View style={styles.proTeamRow}>
                  <Icon name="person" size={16} color="#374151" style={styles.proIconSmall} />
                  <Text style={styles.proTeamMember}>Dr. Thomas Alexander, MD, DM, FACC, FICC, FCSI</Text>
                </View>
                <View style={styles.proTeamRow}>
                  <Icon name="person" size={16} color="#374151" style={styles.proIconSmall} />
                  <Text style={styles.proTeamMember}>Dr. Suresh Kumar Ramasamy, MBBS, MD, DM</Text>
                </View>
                <View style={styles.proTeamRow}>
                  <Icon name="person" size={16} color="#374151" style={styles.proIconSmall} />
                  <Text style={styles.proTeamMember}>Dr. Saravanan D M T, MBBS, MRCP (UK)</Text>
                </View>
                <View style={styles.proTeamRow}>
                  <Icon name="person" size={16} color="#374151" style={styles.proIconSmall} />
                  <Text style={styles.proTeamMember}>Dr. Mohan M, MBBS, MD, DM</Text>
                </View>
              </View>
            </View>

            <View style={styles.proCard}>
              <Text style={styles.proSectionHeader}>Sincere Thanks to  Sponsors</Text>
              <View style={styles.proListItemRow}>
                <Icon name="star" size={20} color="#0d253f" style={styles.proIcon} />
                <View>
                  <Text style={styles.proName}>Dr. K. Narayanasamy</Text>
                  <View style={styles.proRoleRow}>
                    <Icon name="work" size={16} color="#374151" style={styles.proIconSmall} />
                    <Text style={styles.proRole}>Vice Chancellor</Text>
                  </View>
                  <View style={styles.proRoleRow}>
                    <Icon name="location-city" size={16} color="#6b7280" style={styles.proIconSmall} />
                    <Text style={styles.proOrg}>The Tamil Nadu Dr. MGR Medical University</Text>
                  </View>
                </View>
              </View>
              <View style={styles.proListItemRow}>
                <Icon name="star" size={20} color="#0d253f" style={styles.proIcon} />
                <View>
                  <Text style={styles.proName}>Dr. Thavamani D. Palaniswami</Text>
                  <View style={styles.proRoleRow}>
                    <Icon name="work" size={16} color="#374151" style={styles.proIconSmall} />
                    <Text style={styles.proRole}>Managing Trustee</Text>
                  </View>
                  <View style={styles.proRoleRow}>
                    <Icon name="location-city" size={16} color="#6b7280" style={styles.proIconSmall} />
                    <Text style={styles.proOrg}>Dr. N.G.P Research and Educational Trust</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f9fb",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f9fb",
    marginTop: 30,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: "#a2eeff",
    padding: 8,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  translateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  translateButtonText: {
    color: "#4169E1",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
  coverImage: {
    width: "92%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 16,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: "#e3e7ee",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a2233",
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e3e7ee",
  },
  mainName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0d47a1",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  roleText: {
    fontSize: 15,
    color: "#ea6830",
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  orgText: {
    fontSize: 14,
    color: "#00897b",
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#6a1b9a",
    marginBottom: 8,
    marginTop: 8,
    letterSpacing: 0.2,
  },
  teamList: {
    fontSize: 14,
    color: "#37474f",
    marginTop: 6,
    marginLeft: 8,
    marginBottom: 6,
    lineHeight: 22,
  },
  sponsorList: {
    fontSize: 14,
    color: "#00695c",
    marginTop: 6,
    marginLeft: 8,
    marginBottom: 6,
    lineHeight: 22,
  },
  proContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 18,
  },
  proPageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "System",
    letterSpacing: 0.2,
  },
  proCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 18,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  proSectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a2233",
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  proSectionSubHeader: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4b5563",
    marginTop: 10,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  proListItem: {
    marginBottom: 10,
  },
  proListItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  proIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  proIconSmall: {
    marginRight: 4,
    marginTop: 1,
  },
  proRoleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  proName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0d253f",
    marginBottom: 2,
    fontFamily: "System",
  },
  proRole: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 2,
    fontFamily: "System",
  },
  proOrg: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 2,
    fontFamily: "System",
  },
  proTeamList: {
    marginLeft: 8,
    marginTop: 2,
    gap: 2,
  },
  proTeamRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  proTeamMember: {
    fontSize: 13,
    color: "#374151",
    marginLeft: 4,
    fontFamily: "System",
  },
});

export default SupportPage;