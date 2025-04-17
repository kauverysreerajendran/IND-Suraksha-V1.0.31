import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

interface PatientDetails {
  patient_id: string; // Ensure this is defined
  diet: string;
}

const PatientDailyLogScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const showPicker = () => {
    setShowDatePicker(true);
  };
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientIds, setPatientIds] = useState([]);
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
    null
  );
  const [sleepData, setSleepData] = useState<Record<string, boolean>>({});
  const [vegData, setVegData] = useState<Record<string, boolean>>({});
  const [nonvegData, setNonVegData] = useState<Record<string, boolean>>({});
  const [waterData, setWaterData] = useState<Record<string, boolean>>({});
  const [exerciseData, setExerciseData] = useState<Record<string, boolean>>({});
  const [walkData, setwalkData] = useState<Record<string, boolean>>({});
  const [yogaData, setyogaData] = useState<Record<string, boolean>>({});

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    fetchSleepDataForAllPatients(currentDate); // Fetch data on date change
    fetchNonVegDataForAllPatients(currentDate);
    fetchVegDataForAllPatients(currentDate);
  };

  // Fetch existing patient IDs from API
  useEffect(() => {
    const fetchPatientIds = async () => {
      try {
        const response = await fetch(
          "https://ind-heart-suraksha-digitalocean-11.onrender.com/api/api/get-existing-patient-ids/"
        );
        const data = await response.json();
        setPatientIds(data.patient_ids);
      } catch (error) {
        console.error("Error fetching patient IDs:", error);
      }
    };

    fetchPatientIds();
  }, []);

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId); // Store the selected patient ID
    setModalVisible(false); // Close the modal
  };

  const handlePatientIdSelect = (id: string) => {
    setSelectedPatientId(id);
    setModalVisible(false);
  };

  const clearFilter = () => {
    setSelectedPatientId("");
    setDate(new Date());
  };
  
  

  const fetchSleepDataForAllPatients = async (selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as yyyy-mm-dd
      const newSleepData: Record<string, boolean> = {};

      await Promise.all(
        patientIds.map(async (patientId) => {
          try {
            const response = await axios.get(
              `https://ind-heart-suraksha-digitalocean-11.onrender.com/patient/patient/${patientId}/all-sleep-data/${formattedDate}/`
            );
            newSleepData[patientId] = response.data.exists;
          } catch (error) {
            newSleepData[patientId] = false; // Default to false if there's an error
          }
        })
      );

      setSleepData(newSleepData);
    } catch (error) {
      console.error("Error fetching sleep data:", error);
    }
  };

  const fetchVegDataForAllPatients = async (selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as yyyy-mm-dd
      const newVegData: Record<string, boolean> = {};

      await Promise.all(
        patientIds.map(async (patientId) => {
          try {
            const response = await axios.get(
              `https://ind-heart-suraksha-digitalocean-11.onrender.com/patient/patient/${patientId}/all-vegdiet-data/${formattedDate}/`
            );
            newVegData[patientId] = response.data.exists;
          } catch (error) {
            newVegData[patientId] = false; // Default to false if there's an error
          }
        })
      );

      setVegData(newVegData);
    } catch (error) {
      console.error("Error fetching sleep data:", error);
    }
  };

  const fetchNonVegDataForAllPatients = async (selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as yyyy-mm-dd
      const newNonVegData: Record<string, boolean> = {};

      await Promise.all(
        patientIds.map(async (patientId) => {
          try {
            const response = await axios.get(
              `https://ind-heart-suraksha-digitalocean-11.onrender.com/patient/patient/${patientId}/all-nonvegdiet-data/${formattedDate}/`
            );
            newNonVegData[patientId] = response.data.exists;
          } catch (error) {
            newNonVegData[patientId] = false; // Default to false if there's an error
          }
        })
      );

      setNonVegData(newNonVegData);
    } catch (error) {
      console.error("Error fetching sleep data:", error);
    }
  };

  const filteredData = patientIds
    .filter((patientId) => {
      // Only include patients with the selected ID
      return selectedPatientId ? patientId === selectedPatientId : true;
    })
    .map((patientId) => ({
      patientId: patientId,
      hasSleepData: sleepData[patientId] || false,
      hasVegData: vegData[patientId] || false,
      hasNonVegData: nonvegData[patientId] || false,
      hasWaterData: waterData[patientId] || false,
      hasExerciseData: exerciseData[patientId] || false,
      hasWalkData: walkData[patientId] || false,
      hasYogaData: yogaData[patientId] || false,
    }));

  const fetchWaterDataForAllPatients = async (selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as yyyy-mm-dd
      const newwaterData: Record<string, boolean> = {};

      await Promise.all(
        patientIds.map(async (patientId) => {
          try {
            const response = await axios.get(
              `https://ind-heart-suraksha-digitalocean-11.onrender.com/patient/patient/${patientId}/water-data/?date=${formattedDate}`
            );
            newwaterData[patientId] = response.data.exists;
          } catch (error) {
            newwaterData[patientId] = false; // Default to false if there's an error
          }
        })
      );

      setWaterData(newwaterData);
    } catch (error) {
      console.error("Error fetching sleep data:", error);
    }
  };

  useEffect(() => {
    fetchWaterDataForAllPatients(date); // Fetch data when the component mounts
  }, [patientIds]);

  const fetchExerciseDataForAllPatients = async (selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as yyyy-mm-dd
      const newexerciseData: Record<string, boolean> = {};

      await Promise.all(
        patientIds.map(async (patientId) => {
          try {
            const response = await axios.get(
              `https://ind-heart-suraksha-digitalocean-11.onrender.com/patient/patient/${patientId}/daily-exercise-data/?date=${formattedDate}`
            );
            newexerciseData[patientId] = response.data.exists;
          } catch (error) {
            newexerciseData[patientId] = false; // Default to false if there's an error
          }
        })
      );

      setExerciseData(newexerciseData);
    } catch (error) {
      console.error("Error fetching sleep data:", error);
    }
  };

  useEffect(() => {
    fetchExerciseDataForAllPatients(date); // Fetch data when the component mounts
  }, [patientIds]);

  const fetchWalkingDataForAllPatients = async (selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as yyyy-mm-dd
      const newwalkingData: Record<string, boolean> = {};

      await Promise.all(
        patientIds.map(async (patientId) => {
          try {
            const response = await axios.get(
              `https://ind-heart-suraksha-digitalocean-11.onrender.com/patient/patient/${patientId}/daily-exercise-data/?date=${formattedDate}`
            );
            newwalkingData[patientId] = response.data.exists;
          } catch (error) {
            newwalkingData[patientId] = false; // Default to false if there's an error
          }
        })
      );

      setwalkData(newwalkingData);
    } catch (error) {
      console.error("Error fetching sleep data:", error);
    }
  };

  useEffect(() => {
    fetchWalkingDataForAllPatients(date); // Fetch data when the component mounts
  }, [patientIds]);

  const fetchYogaDataForAllPatients = async (selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as yyyy-mm-dd
      const newyogaData: Record<string, boolean> = {};

      await Promise.all(
        patientIds.map(async (patientId) => {
          try {
            const response = await axios.get(
              `https://ind-heart-suraksha-digitalocean-11.onrender.com/patient/patient/${patientId}/yoga-data/?date=${formattedDate}`
            );
            newyogaData[patientId] = response.data.exists;
          } catch (error) {
            newyogaData[patientId] = false; // Default to false if there's an error
          }
        })
      );

      setyogaData(newyogaData);
    } catch (error) {
      console.error("Error fetching sleep data:", error);
    }
  };

  useEffect(() => {
    fetchYogaDataForAllPatients(date); // Fetch data when the component mounts
  }, [patientIds]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("AdminDashboardPage")}
        >
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Patient Daily Log</Text>

        <TouchableOpacity onPress={clearFilter} style={styles.clearButton}>
  <Text style={styles.clearButtonText}>Clear</Text>
</TouchableOpacity>


        <TouchableOpacity style={styles.downloadButton}>
          <Image
            source={require("../../assets/images/excel.png")}
            style={styles.excelImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.input}
        >
          <Text>
            {selectedPatientId ? selectedPatientId : "Select Patient ID"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={showPicker} style={styles.dateInput}>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display={Platform.OS === "ios" ? "inline" : "calendar"}
          onChange={onDateChange}
        />
      )}

      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            onPress={() => setModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
              <Text style={styles.modalTitle}>Select Patient ID</Text>
              <ScrollView style={styles.scrollView}>
                {patientIds.map((patientId) => (
                  <TouchableOpacity
                    key={patientId}
                    style={styles.modalItem}
                    onPress={() => handlePatientSelect(patientId)}
                  >
                    <Text>{patientId}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

        {/* Scrollable Table */}
<ScrollView
  horizontal
  style={{ flexGrow: 1 }}
  showsHorizontalScrollIndicator={true}
  showsVerticalScrollIndicator={true}
>
  <ScrollView
    style={styles.tableContainer}
    contentContainerStyle={{ flexGrow: 1 }}
    showsHorizontalScrollIndicator={true}
    showsVerticalScrollIndicator={true}
  >
    <View style={styles.table}>
    <View style={styles.tableHeader}>
              {[
                "Patient ID",
                "Sleep",
                "Food (Veg)",
                "Food (NV)",
                "Water",
                ,
                "Exercise",
                "Medication",
                "Walk",
                "Yoga",
              ].map((header) => (
                <Text key={header} style={styles.tableHeaderText}>
                  {header}
                </Text>
              ))}
            </View>
      {filteredData.map((row, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableRowText}>{row.patientId}</Text>

          {/* Each Image will be wrapped in a View for better alignment */}
          <View style={styles.imageContainer}>
            <Image
              source={
                row.hasSleepData
                  ? require("../../assets/images/check.png")
                  : require("../../assets/images/cross.png")
              }
              style={styles.statusImage}
            />
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={
                row.hasVegData
                  ? require("../../assets/images/check.png")
                  : require("../../assets/images/cross.png")
              }
              style={styles.statusImage}
            />
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={
                row.hasNonVegData
                  ? require("../../assets/images/check.png")
                  : require("../../assets/images/cross.png")
              }
              style={styles.statusImage}
            />
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={
                row.hasWaterData
                  ? require("../../assets/images/check.png")
                  : require("../../assets/images/cross.png")
              }
              style={styles.statusImage}
            />
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={
                row.hasExerciseData
                  ? require("../../assets/images/check.png")
                  : require("../../assets/images/cross.png")
              }
              style={styles.statusImage}
            />
          </View>
         

          <View style={styles.imageContainer}>
            <Image
              source={
                row.hasWalkData
                  ? require("../../assets/images/check.png")
                  : require("../../assets/images/cross.png")
              }
              style={styles.statusImage}
            />
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={
                row.hasYogaData
                  ? require("../../assets/images/check.png")
                  : require("../../assets/images/cross.png")
              }
              style={styles.statusImage}
            />
          </View>
        </View>
      ))}
    </View>
  </ScrollView>
</ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  downloadButton: {
    marginLeft: "auto",
    marginRight: 5,
  },
  excelImage: {
    width: 24,
    height: 24,
  },
  dateInput: {
    height: 40,
    borderColor: "#c5c5c5",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    flex: 1,
  },
  input: {
    height: 40,
    flex: 1,
    borderColor: "#c5c5c5",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: "center", // Centers the text vertically
    alignItems: "center", // Centers the text horizontally
  },
  tableContainer: {
    marginTop: 15,
    flexGrow: 1,
    width: '100%',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: "#c5c5c5",
    borderRadius: 30,

    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableHeaderText: {
    flex: 1,
    padding: 5,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginHorizontal: -5,
  },
  tableRowText: {
    fontSize: 14,
    color: "#000",
    flex: 1,
    padding: 5,
    justifyContent: "center", // Center the content vertically
    alignItems: "center",
    marginHorizontal: 5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center', // Center the images vertically
    alignItems: 'center', // Center the images horizontally
  },

  statusImage: {
    width: 20, // Adjust the width of the images
    height: 20, // Adjust the height of the images
    resizeMode: "contain",
    marginHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 15,
  },
  dateText: {
    textAlign: "center",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "70%",
    maxHeight: 300, // Set a maximum height
    backgroundColor: "white",
    borderRadius: 50,
    padding: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  patientItem: {
    padding: 10,
  },
  patientText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  scrollView: {
    maxHeight: 150, // Adjust as needed
  },
  modalItem: {
    padding: 10,
  },
  clearButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f46666',
    borderRadius: 50,
    marginLeft: 100,
    alignSelf: 'center',
  },
  
  clearButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  
});

export default PatientDailyLogScreen;