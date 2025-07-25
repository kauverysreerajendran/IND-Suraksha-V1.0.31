import {
  View,
  Text as RNText,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Button,
  Linking,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../type";
import { SafeAreaProvider } from "react-native-safe-area-context";
import texts from "../translation/texts";

// Custom Text component to disable font scaling globally
const Text = (props: any) => {
  return <RNText {...props} allowFontScaling={false} />;
};

export default function Insights() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // Toggle between Tamil and English based on the button click
  const [isTranslatingToTamil, setIsTranslatingToTamil] = useState(false);

  // Toggle between Tamil and English based on the button click
  const languageText = isTranslatingToTamil ? texts.tamil : texts.english;
  const [currentPage, setCurrentPage] = useState(0);
  const contentPerPage = 1; // Number of sections per page


const [expanded, setExpanded] = useState(false);
const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

const mutedRainbowColors = [
  '#e4c6c0', '#b7d6e7', '#e0c8da', '#ade5d7',
  '#e2c7bc', '#dec2c9', '#ccdcc8', '#e5e8c0',
  '#cceae4', '#bfdea3', '#e2d4ed', '#cfc4bb', '#d2e7f8'
];

// 2. Add this function to your component (before the return statement)
const getCardIcon = (index: number) => {
  const icons = [
    require('../../assets/images/heartAttack.png'),
    require('../../assets/images/heartAttackFactors.png'),
    require('../../assets/images/patientCard.png'),
    require('../../assets/images/heart.png'),
    require('../../assets/images/precaution.png'),
    require('../../assets/images/lifeStyles.png'),
    require('../../assets/images/walk.png'),
    require('../../assets/images/dietCard.png'),
    require('../../assets/images/myFoodCard.png'),
    require('../../assets/images/healthy.png'),
    require('../../assets/images/PeacefulMan.png'),
    require('../../assets/images/no.png'),

  ];
  return icons[index % icons.length];
};


  const pages = [
    {
      title: languageText.whatHeartAttack,
      content: languageText.heartAttackContent,
      image: require("../../assets/images/modal1.png"),
    },
    {
      title: languageText.heartAttackFactors,
      content: `${languageText.factorOne}\n${languageText.factorTwo}\n${languageText.factorThree}\n${languageText.factorFour}\n${languageText.factorFive}\n${languageText.factorSix}\n${languageText.factorSeven}\n${languageText.factorEight}\n${languageText.factorNine}\n${languageText.factorTen}`,
      image: require("../../assets/images/a.jpeg"), // Optional
    },
    {
      title: languageText.cholestrolQuestion,
      content: `${languageText.cholestrolSub}\n\n• ${languageText.cholestrolTypeOne}: ${languageText.cholestrolOne}\n• ${languageText.cholestrolTypeTwo}: ${languageText.cholestrolTwo}`,
      image: null,
    },
    {
      title: languageText.treatmentTitle,
      content: `1. ${languageText.medicines}\n  • ${languageText.medicineOne}\n  • ${languageText.medicineTwo}\n  • ${languageText.medicineThree}\n  • ${languageText.medicineFour}\n  • ${languageText.medicineFive}\n\n2. ${languageText.pciTitle}\n  • ${languageText.pciOne}\n\n3. ${languageText.heartsurgeryTitle}\n  • ${languageText.heartSurgeryOne}`,
      image: null,
    },
    {
      title: languageText.phsTitle,
      content: `${languageText.phsOne}\n${languageText.phsTwo}\n${languageText.phsThree}\n${languageText.phsFour}\n${languageText.phsFive}\n${languageText.phsSix}\n${languageText.phsSeven}\n${languageText.phsEight}`,
      image: null,
    },
    {
      title: languageText.lifeStyleTitle,
      content: `${languageText.lifeStyleOne}\n${languageText.lifeStyleTwo}\n${languageText.lifeStyleThree}\n${languageText.lifeStyleFour}\n${languageText.lifeStyleFive}\n${languageText.lifeStyleSix}\n${languageText.lifeStyleSeven}`,
      image: null,
    },
        {
      title: languageText.walkingExerciseTitle,
      content: languageText.walkingExerciseContent,
      image: require("../../assets/images/InsightsExercise.jpg"),
    },
    {
      title: languageText.dietary,
      content: `• ${languageText.diateryChangeOne}\n• ${languageText.diateryChangeTwo}\n• ${languageText.diateryChangeThree}\n• ${languageText.diateryChangeFour}\n• ${languageText.diateryChangeFive}`,
      image: require("../../assets/images/DietaryChangesImage.jpg"),
    },
    {
      title: languageText.myFood,
      content: `1. ${languageText.wholeGrains}: ${languageText.wgOne}\n2. ${languageText.protein}: ${languageText.wgTwo}\n3. ${languageText.vegetables}: ${languageText.vegOne}\n4. ${languageText.fruits}: ${languageText.fruitsOne}\n5. ${languageText.oil}: ${languageText.oilOne}\n6. ${languageText.diary}: ${languageText.dwOne}`,
      image: require("../../assets/images/DietaryPlateOne.png"),
    },
    {
      title: languageText.healthyMindset,
      content: `• ${languageText.hmOne}\n• ${languageText.hmTwo}\n• ${languageText.hmThree}\n• ${languageText.hmFour}`,
      image: require("../../assets/images/yogaBoth.png"),
    },
    {
      title: languageText.restandsleep,
      content: `• ${languageText.rasOne}\n• ${languageText.rasTwo}\n• ${languageText.rasThree}\n• ${languageText.rasFour}\n ${languageText.rasFive}`,
      image: require("../../assets/images/noTv.png"),
    },
    {
      title: languageText.avoidaandsTitle,
      content: `• ${languageText.avoidandsOne}\n• ${languageText.avoidandsTwo}\n• ${languageText.avoidandsThree}\n• ${languageText.avoidandsFour}`,
      image: require("../../assets/images/noSmokeImg.jpg"),
    },
    {
      title: languageText.complications,
      content: `• ${languageText.complicationContent}\n• ${languageText.avoidandsTwo}\n• ${languageText.avoidandsThree}\n• ${languageText.avoidandsFour}`,
      
    },
  ];

  // Handle Translation
  const handleTranslate = () => {
    setIsTranslatingToTamil(!isTranslatingToTamil);
    console.log("Translate button pressed");
  };

  const handleBackPress = () => {
    navigation.navigate("PatientDashboardPage");
  };

  const handleDietaryPress = () => {
    navigation.navigate("DietaryChange"); // Navigate to dietaryChange.tsx
  };

  const handleMyFoodPress = () => {
    navigation.navigate("MyFoodPlate"); // Navigate to dietaryChange.tsx
  };

  const handleSupportPress = () => {
    navigation.navigate("SupportPage"); // Navigate to dietaryChange.tsx
  };

  // Function to navigate to the previous page
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to navigate to the next page
  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* Adjust StatusBar visibility */}
        <StatusBar
          barStyle="dark-content" // Set the color of status bar text
          backgroundColor="transparent" // Make the background transparent
          translucent={true} // Make status bar translucent
        />

        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>{languageText.insightsTitle}</Text>
            <View style={styles.translateContainer}>
              <TouchableOpacity
                onPress={handleTranslate}
                style={styles.translateButton}
              >
                <Icon
                  name={isTranslatingToTamil ? "language" : "translate"}
                  size={18}
                  color="#4169E1"
                />

                <Text style={styles.buttonTranslateText}>
                  {isTranslatingToTamil
                    ? "Translate to English"
                    : "தமிழில் படிக்க"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Icon Section */}
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={handleDietaryPress}
              style={styles.iconWrapper}
            >
              <View
                style={[styles.iconBackground, { backgroundColor: "#bdc9ab" }]}
              >
                {/* <Icon name="restaurant-menu" size={26} color="#d6187a" /> */}
                <Image 
  source={require('../../assets/gif/diet.gif')}
  style={styles.iconGif}
/>

              </View>
              <Text style={styles.iconLabel}>{languageText.dietary}</Text>
            </TouchableOpacity>
            {/* Update the my food icon to be clickable */}
            <TouchableOpacity
              onPress={handleMyFoodPress}
              style={styles.iconWrapper}
            >
              <View
                style={[styles.iconBackground, { backgroundColor: "#deb7b5" }]}
              >
                {/* <Icon name="fastfood" size={26} color="#f37521" /> */}
                <Image 
  source={require('../../assets/gif/myfood.gif')}
  style={styles.iconGif}
/>
              </View>
              <Text style={styles.iconLabel}>{languageText.myFood}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSupportPress}
              style={styles.iconWrapper}
            >
              <View
                style={[styles.iconBackground, { backgroundColor: "#bccad7" }]}
              >
                {/* <Icon name="info" size={26} color="#2196F3" /> */}
                <Image 
  source={require('../../assets/gif/support.gif')}
  style={styles.iconGif}
/>
              </View>
              <Text style={styles.iconLabel}>{languageText.support}</Text>
            </TouchableOpacity>
          </View>
         

  {/* New Scrollable Content */}
<ScrollView
  contentContainerStyle={styles.cardScrollContainer}
  showsVerticalScrollIndicator={false}
>

{pages.slice(0, expanded ? pages.length : 4).map((page, index) => (
  <TouchableOpacity 
    key={index}
    style={[styles.contentCard, { backgroundColor: mutedRainbowColors[index % mutedRainbowColors.length] }]}
    onPress={() => setSelectedCardIndex(selectedCardIndex === index ? null : index)}
    activeOpacity={0.9}
  >
    <View style={styles.cardHeader}>
      <Image 
        source={getCardIcon(index)}
        style={styles.cardThumbnail} 
      />
      <Text style={styles.cardTitle}>{page.title}</Text>
    </View>
    
    {selectedCardIndex === index && (
      <View style={styles.expandedCardContent}>
                               
                                {page.title === languageText.complications ? (
                  <Text style={styles.cardContent}>
                    {languageText.complicationContent.split('04224323800')[0]}
                    <Text
                      style={{ color: '#1976d2', textDecorationLine: 'underline' }}
                      onPress={() => Linking.openURL('tel:04224323800')}
                    >
                      04224323800
                    </Text>
                    {languageText.complicationContent.split('04224323800')[1]}
                  </Text>
                ) : (
                  <Text style={styles.cardContent}>{page.content}</Text>
                )}
        {page.image && (
          <Image source={page.image} style={styles.cardImage} />
        )}
      </View>
    )}
  </TouchableOpacity>
))}
  
  {pages.length > 4 && (
    <TouchableOpacity 
      style={styles.expandButton}
      onPress={() => setExpanded(!expanded)}
    >
      <Text style={styles.expandButtonText}>
        {expanded ? "View Less" : "View More"}
      </Text>
    </TouchableOpacity>
  )}
</ScrollView>

          {/* Pagination Controls */}
          

          {/* <Text style={styles.pageIndicator}>
            Page {currentPage + 1} of {pages.length}
          </Text> */}
        </View>
        <View style={styles.buttonContainer}>
          {/* Custom Button for "Next" */}
          <TouchableOpacity
            onPress={goToNextPage}
            disabled={currentPage === pages.length - 1}
            style={[
              styles.button,
              {
                backgroundColor:
                  currentPage === pages.length - 1 ? "#ccc" : "transparent", // Make the button visible
                opacity: currentPage === pages.length - 1 ? 0.5 : 1, // Add opacity for disabled state
              },
            ]}
          >

          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    marginTop: 40,
    marginBottom: -50,
  },
  iconGif: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  paginationContainer: {
    flexDirection: "row", // Ensure the buttons are aligned horizontally in a row
    justifyContent: "flex-start", // Align both buttons to the left side
    alignItems: "center",
    padding: 10,
  },

  pageIndicator: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 20,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 150, // Add some spacing between the "Previous" and "Next" buttons
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },

  buttonContainer: {
    justifyContent: "center", // Ensures the button is centered horizontally
    alignItems: "center", // Ensures the button is centered vertically
    marginTop: 20, // Provides spacing between the page indicator and the Next button
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  translateContainer: {
    position: "absolute",
    marginLeft: 180,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },

  translateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: 25,
    paddingTop: 10,
    paddingBottom: 10,
  },

  buttonTranslateText: {
    color: "#4169E1",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginLeft: 10,
    paddingRight: 5,
    
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    marginLeft: 85,
    transform: [{ translateX: -50 }],
    textAlign: "center",
  },

  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    padding: 5,
  },
  iconWrapper: {
    alignItems: "center",
    width: "20%",
  },
  iconBackground: {
    backgroundColor: "#d6226d",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "150%",
    borderTopRightRadius: 30,
  borderBottomLeftRadius: 30,
  borderTopLeftRadius: 5,
  borderBottomRightRadius: 5

  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
  mainContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    marginTop: 10,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  subContentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 0,
    color: "#333",
    padding: 10,
  },
  containerOne: {
    fontSize: 16,
    color: "#1b1b1b",
    fontWeight: "400",
    marginBottom: 30,
  },
  containerOneContent: {
    padding: 5,
    fontWeight: "400",
    fontSize: 15,
  },
  containerTwo: {
    fontSize: 18,
    color: "#000",
    fontWeight: "800",
    marginBottom: 5,
  },
  walkingTitle: {
    fontSize: 18,
    color: "#000",
    fontWeight: "800",
    marginBottom: 5,
    marginLeft: 10,
    padding: 10,
  },
  imageStyle: {
    width: "100%",
    height: 210,
    borderRadius: 10,
    resizeMode: "contain",
    marginTop: 1,
    bottom: 15,
  },
  exerciseImageStyle: {
    width: "100%",
    height: 210,
    borderRadius: 10,
    resizeMode: "contain",
    marginTop: 20,
    bottom: 15,
  },
  dietaryImageStyle: {
    width: "100%",
    height: 210,
    borderRadius: 10,
    resizeMode: "contain",
    marginTop: 20,
    bottom: 15,
  },
  foodPlateImageStyle: {
    width: "100%",
    height: 210,
    borderRadius: 10,
    resizeMode: "contain",
    marginTop: -5,
    marginBottom: -10,
    bottom: 15,
  },
  yogaImageStyle: {
    width: "100%",
    height: 210,
    borderRadius: 10,
    resizeMode: "contain",
    marginTop: -5,
    bottom: 15,
  },
  noSmokeImageStyle: {
    width: "100%",
    height: 210,
    borderRadius: 10,
    resizeMode: "contain",
    marginTop: 25,
    bottom: 15,
  },

  factorContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    marginTop: 10,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  imageStyleFactorA: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    resizeMode: "contain",
    marginTop: 1,
    bottom: 15,
  },
  imageStyleFactorB: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    resizeMode: "contain",
    marginTop: 1,
    bottom: 15,
  },
  cholesterolContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    marginTop: 10,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bulletContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
  },
  subPoint: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 5,
    fontWeight: "800",
    marginLeft: 2,
    color: "#3c3d3d",
  },
  bulletPointIndented: {
    fontSize: 16,
    marginBottom: 7,
    marginLeft: 10,
  },
  thankNote: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 20,
    textAlign: "center",
  },

  precautionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    marginTop: 10,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  lifestyleContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    marginTop: 10,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  exerciseContainer: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 30,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  tableContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableHeader: {
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  tableData: {
    color: "#555",
    flex: 1,
    marginRight: 5,
  },
  tableNote: {
    fontSize: 15,
    color: "#666",
    marginVertical: 5,
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },


// Add these styles to your StyleSheet
cardScrollContainer: {
  paddingBottom: 20,
},
contentCard: {
  borderRadius: 25,
  padding: 15,
  marginBottom: 15,
  shadowOpacity: 0.1,
  shadowRadius: 4,
  minHeight: 140,
  width: '100%',
},
cardTitle: {
  fontSize: 15,
  paddingRight: 8,
  paddingLeft: 18,
  fontWeight: 'bold',
  color: '#333',
  flexWrap: 'wrap',
  flex: 1,
  paddingHorizontal: 5,
  lineHeight: 20,
  flexShrink: 1,
  marginRight: 5,
},
expandedCardContent: {
  marginTop: 10,
  width: '100%',
},
cardContent: {
  fontSize: 16,
  color: '#1b1b1b',
  fontWeight: '400',
  marginBottom: 15,
  
},
cardImage: {
  width: '100%',
  height: 200,
  borderRadius: 10,
  resizeMode: 'contain',
  alignSelf: 'center',
},
expandButton: {
  backgroundColor: '#ba4b7f',
  padding: 12,
  
  borderRadius: 8,
  alignItems: 'center',
  alignSelf: 'center', // Add this line to center the button
  marginTop: 10,
  marginBottom: 20,
},
expandButtonText: {
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: 16,
  alignSelf: 'center', // Add this line to center the button

},

cardHeader: {
  flexDirection: 'row',
  alignItems: 'center',
},
cardThumbnail: {
  width: 120,
  height: 130,
  borderRadius: 20,
  marginRight: 0,
  resizeMode: 'contain',
},

});
