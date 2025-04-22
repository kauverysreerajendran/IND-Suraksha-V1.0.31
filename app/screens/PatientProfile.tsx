import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text as RNText,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../type";
import texts from "../translation/texts";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Custom Text component to disable font scaling globally 
const Text = (props: any) => { return <RNText {...props} allowFontScaling={false} />; };


type OccupationKeys = "sedentaryworker" | "moderateworker" | "heavyworker";
type EducationKeys = "highSchool" | "bachelor" | "master" | "phd";

type PatientProfileScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "PatientProfile"
>;

interface PatientDetails {
  patient_id: string;
  is_active: boolean;
  name: string;
  age: number;
  gender: string;
  education: string;
  occupation: string;
  marital_status: string;
  smoking: boolean;
  alcoholic: boolean;
  patient_contact_number: string;
  emergency_doctor_number: string;
  qualificationSectionTitle?: string;
}

const PatientProfile: React.FC = () => {
  const navigation = useNavigation<PatientProfileScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
    null
  );
  const [isTranslatingToTamil, setIsTranslatingToTamil] = useState(true);
  const languageText = isTranslatingToTamil ? texts.english : texts.tamil;

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      const storedPhoneNumber = await AsyncStorage.getItem("phoneNumber");
      if (storedPhoneNumber) {
        setPhoneNumber(storedPhoneNumber);
        fetchPatientDetails(storedPhoneNumber);
      }
    };

    fetchPhoneNumber();
  }, []);

  const fetchPatientDetails = async (phone: string) => {
    try {
      const response = await axios.get(
        `https://indheart.pinesphere.in/patient/patient/${phone}/`
      );
      setPatientDetails(response.data);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  // Handle Translation
  const handleTranslate = useCallback(() => {
    setIsTranslatingToTamil((prev) => !prev);
    console.log(
      "Translate button pressed. Current language: ",
      isTranslatingToTamil ? "Tamil" : "English"
    );
  }, [isTranslatingToTamil]);

    const handleFeedbackSubmit = async () => {
    try {
      console.log("Submit Feedback button pressed");
      // Add your feedback submission logic here
      navigation.navigate("UserFeedbackForm"); // Adjust navigation to your feedback screen
    } catch (error: unknown) {
      console.error("Error submitting feedback:", error);
  
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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.translateContainer}>
          <TouchableOpacity
            onPress={handleTranslate}
            style={styles.translateButton}
          >
            <Icon
              name={isTranslatingToTamil ? "language" : "translate"}
              size={20}
              color="#4169E1" // Icon color
            />
            <Text style={styles.buttonTranslateText}>
              {isTranslatingToTamil ? "தமிழில் படிக்க" : "Translate to English"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.backIconContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log("Back button clicked");
              navigation.navigate("PatientDashboardPage");
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/profileCvr.png")}
              style={styles.profileImage}
            />
          </View>

          <LinearGradient
            colors={["#ffffff", "#ffffff"]}
            style={styles.profileContainer}
          >
            {patientDetails ? (
              <>
                {/* Personal Details Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>
                    {languageText.personalDetails}
                  </Text>
                </View>
                <View style={styles.detailsContainer}>
                  <View style={styles.profileDetail}>
                    <Text style={styles.boldText}>
                      {languageText.patientId}:{" "}
                    </Text>
                    <Text style={styles.valueText}>
                      {patientDetails.patient_id}
                    </Text>
                  </View>
                  <View style={styles.separator} />

                  <View style={styles.profileDetail}>
                    <Text style={styles.boldText}>{languageText.name}: </Text>
                    <Text style={styles.valueText}>{patientDetails.name}</Text>
                  </View>
                  <View style={styles.separator} />

                  <View style={styles.profileDetail}>
                    <Text style={styles.boldText}>{languageText.age}: </Text>
                    <Text style={styles.valueText}>{patientDetails.age}</Text>
                  </View>
                  <View style={styles.separator} />

                  <View style={styles.profileDetail}>
                    <Text style={styles.boldText}>{languageText.gender}: </Text>
                    <Text style={styles.valueText}>
                      {
                        languageText.genderOptions[
                          patientDetails.gender.toLowerCase() as keyof typeof languageText.genderOptions
                        ]
                      }
                    </Text>
                  </View>
                  <View style={styles.separator} />

                  <View style={styles.profileDetail}>
                    <Text style={styles.boldText}>
                      {languageText.maritalStatus}:{" "}
                    </Text>
                    <Text style={styles.valueText}>
                      {
                        languageText.maritalStatusOptions[
                          patientDetails.marital_status.toLowerCase() as keyof typeof languageText.maritalStatusOptions
                        ]
                      }
                    </Text>
                  </View>

                  <View style={styles.separator} />
                </View>

                {/* Qualifications Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>
                    {languageText.qualificationSectionTitle || "Qualifications"}
                  </Text>
                </View>

                <View style={styles.detailsContainer}>
                  {/* Occupation Detail */}
                  <View style={styles.profileDetail}>
                    <Text style={styles.boldText}>
                      {languageText.occupation || "Occupation"}:{" "}
                    </Text>
                    <Text style={styles.valueText}>
                      {(() => {
                        // Normalize the occupation key to match exactly with the translation keys
                        const occupationKey = patientDetails.occupation
                          .toLowerCase()
                          .replace(/\s+/g, "") as OccupationKeys;
                        const translatedOccupation =
                          languageText.occupationOptions[occupationKey] ||
                          patientDetails.occupation;
                        return translatedOccupation;
                      })()}
                    </Text>
                  </View>

                  <View style={styles.separator} />

                  {/* Education Detail */}
                  <View style={styles.profileDetail}>
                    <Text style={styles.boldText}>
                      {languageText.education || "Education"}:{" "}
                    </Text>
                    <Text style={styles.valueText}>
                      {(() => {
                        // Normalize the education string to match valid keys
                        const normalizedEducation = patientDetails.education
                          .toLowerCase()
                          .replace(/[^a-zA-Z]/g, ""); // This will remove spaces and punctuation

                        console.log(
                          "Normalized Education:",
                          normalizedEducation
                        );

                        // Update valid education keys to match the camel case keys in the options
                        const validEducationKeys: EducationKeys[] = [
                          "highSchool",
                          "bachelor",
                          "master",
                          "phd",
                        ];

                        // Check if the normalized key corresponds to any valid education keys
                        const educationKey =
                          validEducationKeys.find((key) =>
                            normalizedEducation.includes(
                              key.toLowerCase().replace(/[^a-zA-Z]/g, "")
                            )
                          ) || null;

                        console.log("Education Key:", educationKey);

                        // Get translated education if a valid key was found
                        const translatedEducation = educationKey
                          ? languageText.educationOptions[educationKey]
                          : patientDetails.education;

                        console.log(
                          "Translated Education:",
                          translatedEducation
                        );
                        return translatedEducation;
                      })()}
                    </Text>
                  </View>

                  <View style={styles.separator} />
                </View>

                {/* Habits Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>{languageText.habits}</Text>
                </View>
                <View style={styles.detailsContainer}>
                  <View style={styles.profileDetail}>
                    <Text style={styles.boldText}>{languageText.smoking} </Text>
                    <Text style={styles.valueText}>
                      {patientDetails.smoking
                        ? languageText.yes
                        : languageText.no}
                    </Text>
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.profileDetail}>
                    <Text style={styles.boldText}>
                      {languageText.alcoholic}:{" "}
                    </Text>
                    <Text style={styles.valueText}>
                      {patientDetails.alcoholic
                        ? languageText.yes
                        : languageText.no}
                    </Text>
                  </View>
                  <View style={styles.separator} />
                </View>

                {/* Contacts Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>
                    {languageText.contacts}
                  </Text>
                </View>
                <View style={styles.detailsContainer}>
                  <View style={styles.profileDetail}>
                    <Text style={styles.boldText}>
                      {languageText.contact}:{" "}
                    </Text>
                    <Text style={styles.valueText}>
                      {patientDetails.patient_contact_number}
                    </Text>
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.profileDetail}>
                    <Text style={styles.boldText}>
                      {languageText.emergencyDoctorContact}:{" "}
                    </Text>
                    <Text style={styles.valueText}>
                      {patientDetails.emergency_doctor_number}
                    </Text>
                  </View>
                  <View style={styles.separator} />
                </View>
              </>
            ) : (
              <Text style={styles.profileDetail}>Loading...</Text>
            )}
          </LinearGradient>

          <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.feedbackButton, styles.feedbackButton]}
    onPress={handleFeedbackSubmit}
  >
    <Text style={styles.feedbackButtonText}>Submit Feedback</Text>
  </TouchableOpacity>

  <TouchableOpacity
  style={[styles.deleteButton, styles.deleteButton]}
  onPress={() => Linking.openURL("https://sites.google.com/view/indheartsuraksha/home")}
>
  <Text style={styles.deleteButtonText}>Delete Account</Text>
</TouchableOpacity>
</View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default PatientProfile;

const styles = StyleSheet.create({

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center align the buttons horizontally
    alignItems: "center", // Center align the buttons vertically
    marginTop: 15,
    marginBottom: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  feedbackButton: {
    backgroundColor: "#3a8cb4",
    borderRadius: 30,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: "#f15252",
    borderRadius: 30,
    marginHorizontal: 5,
  },
  feedbackButtonText: {
    color: "#fffcfc",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    padding: 13,
    
  },
  deleteButtonText: {
    color: "#fffcfc",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    padding: 13,
    
  },
 
  
 
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  content: {
    paddingBottom: 20,
  },
  backIconContainer: {
    paddingTop: 10,
    marginLeft: 20,
    padding: 10,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  sectionContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
    color: "#B2BEB5",
  },
  profileImage: {
    width: 360,
    height: 200,
    borderRadius: 20,
    alignItems: "flex-start",
  },
  profileContainer: {
    padding: 25,
    marginHorizontal: 10,
    borderRadius: 40,
    elevation: 3,
    backgroundColor: "#fff",
  },

  detailsContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#dcdcdc", // Optional: background color for details
    borderRadius: 20,
  },
  profileDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
  },
  valueText: {
    fontSize: 16,
    color: "#555", // A lighter grey for the values
    fontWeight: "500",
    flex: 1, // Allow the value text to grow and fill space
    textAlign: "right", // Right-align the text
  },
  separator: {
    height: 1.5,
    backgroundColor: "#fff", // Light grey color for the line
    marginVertical: 5,
    width: "100%",
  },
  translateContainer: {
    position: "absolute",
    top: 0,
    right: 5,
    zIndex: 10,
    marginTop: 40,
  },
  translateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: 20,
    borderRadius: 15,
  },
  buttonTranslateText: {
    color: "#4169E1", // Text color
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8, // Space between icon and text
  },



 
  icon: {
    marginRight: 0,
  },
});
