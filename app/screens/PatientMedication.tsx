import React, { useState, useEffect, useCallback } from "react";
import {
  Text as RNText,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import texts from "../translation/texts";
import CustomAlert from "../components/CustomAlert";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Custom Text component to disable font scaling globally
const Text = (props: any) => {
  return <RNText {...props} allowFontScaling={false} />;
};

type TimeOfDay = "Morning" | "Afternoon" | "Evening" | "Night";

type SelectedMedicationsState = {
  [key in TimeOfDay]: number[];
};

interface MedicationToSave {
  patient_id: string;
  date: string;
  route: string;
  dosage_type: string;
  drug_take: TimeOfDay;
  consume: string;
  drug_action: string;
  start_date: string;
  end_date: string;
  taken: boolean;
  food_timing: string;
}

type NavigationProp = StackNavigationProp<RootStackParamList, "DailyUploads">;

const PatientMedication: React.FC = () => {
  const [toggleCount, setToggleCount] = useState(0);
  const navigation = useNavigation<NavigationProp>();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeTime, setActiveTime] = useState("");
  const [selectedMedications, setSelectedMedications] =
    useState<SelectedMedicationsState>({
      Morning: [],
      Afternoon: [],
      Evening: [],
      Night: [],
    });
  const [medications, setMedications] = useState<any[]>([]);
  const [isTranslatingToTamil, setIsTranslatingToTamil] = useState(false);

  const languageText = isTranslatingToTamil ? texts.tamil : texts.english;
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertMode, setAlertMode] = useState<
    "success" | "error" | "confirm" | null
  >(null);
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false);

  // Handle Translation
  const handleTranslate = () => {
    setIsTranslatingToTamil(!isTranslatingToTamil);
  };

  useEffect(() => {
    const fetchLoggedPatientData = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem("phoneNumber");
        if (storedPhoneNumber) {
          const response = await axios.get(
            `https://indheart.pinesphere.in/patient/patient/${storedPhoneNumber}/`
          );
          const patient_id = response.data.patient_id;
          fetchMedications(patient_id);
        }
      } catch (error: unknown) {
        // handle error
      }
    };

    fetchLoggedPatientData();
    updateActiveTime();
  }, []);

  const fetchMedications = async (patient_id: string) => {
    try {
      const response = await axios.get(
        `https://indheart.pinesphere.in/api/api/medical-manager/?patient_id=${patient_id}`
      );
      setMedications(response.data);
    } catch (error: unknown) {
      // handle error
    }
  };

  // Helper function to get food timing text
  /* const getFoodTimingText = (timeOfDay: TimeOfDay, consume: string) => {
    const foodTiming = consume || "Before Food";
    return `${timeOfDay} ${foodTiming}`;
  }; */

  const getFoodTimingText = (timeOfDay: TimeOfDay, consume: string) => {
    // Only show "After Food" or "Before Food" (no session)
    return consume || "Before Food";
  };

  const handleSubmit = useCallback(async () => {
    if (!date) {
      setAlertTitle(languageText.medicationSuccessAlert);
      setAlertMessage(languageText.selectDate);
      setAlertVisible(true);
      setAlertMode("error");
      return;
    }

    try {
      const selectedMedicationsToSave: MedicationToSave[] = [];

      Object.entries(selectedMedications).forEach(([timeOfDay, indexes]) => {
        indexes.forEach((index) => {
          const medication = medications.filter(
            (med) => med.drug_take === timeOfDay
          )[index];

          if (medication) {
            const foodTiming = getFoodTimingText(
              timeOfDay as TimeOfDay,
              medication.consume
            );

            selectedMedicationsToSave.push({
              patient_id: medication.patient_id,
              date: date.toISOString().split("T")[0],
              route: medication.route,
              dosage_type: medication.dosage_type,
              drug_take: timeOfDay as TimeOfDay,
              consume: medication.consume,
              drug_action: medication.drug_action,
              start_date: medication.start_date,
              end_date: medication.end_date,
              taken: true,
              food_timing: foodTiming,
            });
          }
        });
      });

      await axios.post(
        "https://indheart.pinesphere.in/patient/medications/",
        selectedMedicationsToSave
      );

      setAlertTitle(languageText.alertSuccessTitle);
      setAlertMessage(languageText.medicationSuccessAlert);
      setAlertVisible(true);
      setAlertMode("success");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const errorMessage =
          error.response.data?.detail || languageText.alreadyExists;
        setAlertTitle(languageText.duplicateEntry);
        setAlertMessage(errorMessage);
      } else {
        setAlertTitle(languageText.alertErrorTitle);
        setAlertMessage(languageText.errorSaving);
      }
      setAlertVisible(true);
      setAlertMode("error");
    }
  }, [date, medications, selectedMedications]);

  const handleClear = useCallback(() => {
    setSelectedMedications({
      Morning: [],
      Afternoon: [],
      Evening: [],
      Night: [],
    });
    setAlertTitle(languageText.clearTitle);
    setAlertMessage(languageText.clearedMessage);
  }, []);

  const handleCancel = () => {
    setCancelAlertVisible(true);
  };

  const updateActiveTime = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setActiveTime("Morning");
    } else if (hours < 15) {
      setActiveTime("Afternoon");
    } else if (hours < 21) {
      setActiveTime("Evening");
    } else {
      setActiveTime("Night");
    }
  };

  const toggleSelection = (timeOfDay: TimeOfDay, index: number) => {
    setSelectedMedications((prevSelected) => {
      const currentSelection = prevSelected[timeOfDay] || [];
      const updatedSelection = currentSelection.includes(index)
        ? currentSelection.filter((i) => i !== index)
        : [...currentSelection, index];

      const medication = medications.filter(
        (med) => med.drug_take === timeOfDay
      )[index];

      const isSelected = !currentSelection.includes(index);
      if (isSelected && medication) {
        setToggleCount((prevCount) => prevCount + 1);
      }

      return { ...prevSelected, [timeOfDay]: updatedSelection };
    });
  };

  return (
    <SafeAreaProvider>
      <CustomAlert
        title={languageText.alertCancelTitle}
        message={languageText.alertCancelMessage}
        visible={cancelAlertVisible}
        onClose={() => setCancelAlertVisible(false)}
        mode="confirm"
        onYes={() => {
          navigation.navigate("PatientDashboardPage");
        }}
        onNo={() => setCancelAlertVisible(false)}
        okText={languageText.alertOk}
        yesText={languageText.alertYes}
        noText={languageText.alertNo}
      />

      <CustomAlert
        title={alertTitle}
        message={alertMessage}
        visible={alertVisible}
        onClose={() => {
          setAlertVisible(false);
          if (alertMode === "success") {
            navigation.navigate("DailyExercise");
          }
        }}
        onYes={() => {
          setAlertVisible(false);
          if (alertMode === "success") {
            navigation.navigate("DailyExercise");
          }
        }}
        okText={languageText.alertOk}
        yesText={languageText.alertYes}
        noText={languageText.alertNo}
      />

      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />

        {/* Professional Medical Header */}
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/gif/medication.gif")}
            style={styles.headerIcon}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>{languageText.medicationTitle}</Text>
        </View>

        <View style={styles.outerContainer}>
          <View style={styles.datePickerTranslateContainer}>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Icon name="calendar" size={22} color="#00838f" />
                <Text style={styles.datePickerText}>
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "calendar"}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    setDate(selectedDate || date);
                  }}
                />
              )}
            </View>
            <TouchableOpacity
              onPress={handleTranslate}
              style={styles.translateButton}
            >
              <Text style={styles.translateButtonText}>
                {isTranslatingToTamil
                  ? "Translate to English"
                  : "தமிழில் படிக்க"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{languageText.note}</Text>
            <Text style={styles.noteContent}>
              {languageText.medicationNote}
            </Text>
          </View>

          <ScrollView
            style={styles.container}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {(["Morning", "Afternoon", "Evening", "Night"] as TimeOfDay[]).map(
              (timeOfDay) => (
                <View key={timeOfDay} style={styles.sessionCard}>
                  {/* Session Label */}
                  <View style={styles.sessionHeaderRow}>
                    <View style={styles.sessionLabelRow}>
                      <Text style={styles.sessionLabel}>
                        {isTranslatingToTamil
                          ? texts.tamil[
                              `${
                                timeOfDay.toLowerCase() as
                                  | "morning"
                                  | "afternoon"
                                  | "evening"
                                  | "night"
                              }Medication`
                            ]
                          : texts.english[
                              `${
                                timeOfDay.toLowerCase() as
                                  | "morning"
                                  | "afternoon"
                                  | "evening"
                                  | "night"
                              }Medication`
                            ]}
                      </Text>
                    </View>
                    {/* Time Slot Display */}
                    <View style={styles.timeSlotContainer}>
                      <Text style={styles.timeSlotLabel}>
                        {(() => {
                          switch (timeOfDay) {
                            case "Morning":
                              return "6:00 AM - 11:59 AM";
                            case "Afternoon":
                              return "12:00 PM - 2:59 PM";
                            case "Evening":
                              return "3:00 PM - 8:59 PM";
                            case "Night":
                              return "9:00 PM - 5:59 AM";
                            default:
                              return "";
                          }
                        })()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.morningMedicationContainer}>
                    {medications.filter((med) => med.drug_take === timeOfDay)
                      .length === 0 ? (
                      <Text style={styles.noDataText}>
                        {languageText.noMedicationDataText}{" "}
                        {timeOfDay.toLowerCase()}.
                      </Text>
                    ) : (
                      medications
                        .filter((med) => med.drug_take === timeOfDay)
                        .map((medication, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.medicationContainer,
                              selectedMedications[timeOfDay].includes(index)
                                ? styles.medicationSelected
                                : {},
                            ]}
                            onPress={() => toggleSelection(timeOfDay, index)}
                            activeOpacity={0.85}
                          >
                            <View style={styles.medicationItemContainer}>
                              <Image
                                source={
                                  medication.dosage_type === "Syrup/ml"
                                    ? require("../../assets/images/syrup.png")
                                    : medication.dosage_type === "Tablet/mg" ||
                                      medication.dosage_type === "Capsule/mg"
                                    ? require("../../assets/images/pill.png")
                                    : require("../../assets/images/syrup.png")
                                }
                                style={styles.iconMedication}
                              />
                              <View style={styles.medicationTextContainer}>
                                <Text style={styles.medicationItem}>
                                  <Text style={styles.boldText}>
                                    {getFoodTimingText(
                                      timeOfDay,
                                      medication.consume
                                    )}
                                  </Text>
                                </Text>
                                <Text style={styles.medicationDetails}>
                                  {medication.dosage_type}
                                </Text>
                              </View>
                              {/* Taken Status */}
                              <View style={styles.takenStatusContainer}>
                                <Text
                                  style={[
                                    styles.takenStatusLabel,
                                    selectedMedications[timeOfDay].includes(
                                      index
                                    )
                                      ? styles.takenYes
                                      : styles.takenNo,
                                  ]}
                                >
                                  {selectedMedications[timeOfDay].includes(
                                    index
                                  )
                                    ? "Yes"
                                    : ""}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.morningMedicationDetailRow}>
                              <View style={styles.datesContainer}>
                                <Text style={styles.medicationDetails}>
                                  <Text style={styles.dateText}>
                                    {languageText.startDate}:{" "}
                                    {medication.start_date}
                                  </Text>
                                </Text>
                              </View>
                              <View style={styles.datesContainer}>
                                <Text style={styles.medicationDetails}>
                                  <Text style={styles.dateText}>
                                    {languageText.endDate}:{" "}
                                    {medication.end_date}
                                  </Text>
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))
                    )}
                  </View>
                  {/* <View style={styles.noteContainer}>
                    <Text style={styles.noteText}>{languageText.note}</Text>
                    <Text style={styles.noteContent}>
                      {languageText.medicationNote}
                    </Text>
                  </View> */}
                  <View style={styles.separator} />
                </View>
              )
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.footerButtonText}>{languageText.submit}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.footerButtonText}>{languageText.clear}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.footerButtonText}>{languageText.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b2ebf2",
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    elevation: 2,
  },
  headerIcon: {
    width: 55,
    height: 55,
    marginRight: 5,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00838f",
    textAlign: "center",
    letterSpacing: 0.5,
    marginLeft: 13,
  },
  outerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 0,
    marginTop: 0,
    width: "100%",
  },
  container: {
    width: "100%",
    backgroundColor: "transparent",
    paddingTop: 10,
    flex: 1,
  },
  datePickerTranslateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  datePickerContainer: {
    width: "50%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 0,
  },
  datePickerButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#b2ebf2",
  },
  datePickerText: {
    fontSize: 15,
    color: "#00838f",
    fontWeight: "500",
    textAlign: "center",
    marginLeft: 20,
  },
  translateButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "43%",
    marginLeft: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#b2ebf2",
  },
  translateButtonText: {
    color: "#00838f",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    marginHorizontal: 10,
    marginBottom: 18,
    paddingVertical: 10,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: "#b2ebf2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 6,
  },
  sessionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 4,
    marginBottom: 5,
    marginTop: 2,
  },
  sessionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sessionIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  sessionLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#00838f",
    textAlign: "left",
    marginLeft: 2,
    marginBottom: 0,
    paddingBottom: 0,
    letterSpacing: 0.2,
  },
  timeSlotContainer: {
    backgroundColor: "#ededed",
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 10,
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "#b2ebf2",
  },
  timeSlotLabel: {
    fontSize: 13,
    color: "#00838f",
    fontWeight: "600",
    textAlign: "center",
  },
  morningMedicationContainer: {
    marginBottom: -5,
    flex: 1,
    paddingHorizontal: 2,
    padding: 2,
  },
  medicationContainer: {
    marginBottom: 15,
    borderRadius: 18,
    elevation: 0,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 100,
    width: "100%",
    backgroundColor: "transparent",
  },
  medicationSelected: {
    borderColor: "#51d751",
    borderWidth: 0.5,
    elevation: 2,
    backgroundColor: "#f4fff3",
    padding: 10,
  },
  medicationItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  iconMedication: {
    width: 44,
    height: 44,
    marginRight: 10,
    backgroundColor: "#e0f7fa",
    borderRadius: 22,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#b2ebf2",
  },
  medicationTextContainer: {
    flex: 1,
    minWidth: 100,
  },
  medicationItem: {
    fontSize: 16,
    color: "#00838f",
  },
  medicationDetails: {
    fontSize: 14,
    color: "#00796B",
    fontWeight: "600",
    marginBottom: 2,
    marginTop: 2,
    marginVertical: 2,
    flexWrap: "wrap",
    textAlign: "left",
    width: "100%",
    lineHeight: 20,
  },
  morningMedicationDetailRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 54,
    marginTop: 2,
  },
  boldText: {
    fontWeight: "700",
    color: "#00838f",
  },
  takenStatusContainer: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50, // Increased width to avoid overlap
    minHeight: 28, // Add height for better spacing
    alignSelf: "center",
    padding: 10,
  },
  takenStatusLabel: {
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    textAlign: "center",
  },
  takenYes: {
    backgroundColor: "#d4f8e8",
    color: "#19ca19",
    borderColor: "#6dd66d",
    borderWidth: 0.5,
  },
  takenNo: {
    backgroundColor: "transparent",
    color: "#ccc",
  },
  noteContainer: {
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 10,
    backgroundColor: "#e0f7fa",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#b2ebf2",
  },
  noteText: {
    fontWeight: "700",
    color: "#00838f",
    marginBottom: 2,
    textAlign: "left",
    marginLeft: 2,
    fontSize: 14,
  },
  noteContent: {
    fontWeight: "400",
    marginLeft: 2,
    color: "#505050",
    marginBottom: 0,
    textAlign: "left",
    fontSize: 13,
  },
  separator: {
    height: 0.5,
    backgroundColor: "#b2ebf2",
    marginVertical: 10,
    width: "100%",
    borderRadius: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    elevation: 5,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "#b2ebf2",
    borderTopWidth: 1,
  },
  submitButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: "#00838f",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    elevation: 2,
  },
  clearButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: "#FFD700",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    elevation: 2,
  },
  cancelButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: "#FF6347",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    elevation: 2,
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  noDataText: {
    fontSize: 14,
    color: "#f76464",
    textAlign: "center",
    paddingVertical: 10,
  },
  datesContainer: {
    marginBottom: 0,
    padding: 0,
    width: "auto",
    marginRight: 10,
  },
  dateText: {
    fontWeight: "700",
    color: "#505050",
    fontSize: 13,
    flexWrap: "wrap",
    textAlign: "left",
    width: "100%",
  },
  commonNoteContainer: {
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#e0f7fa",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#b2ebf2",
  },
  commonNoteText: {
    color: "#00838f",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
});

export default PatientMedication;