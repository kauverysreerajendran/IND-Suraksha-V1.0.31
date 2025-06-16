import {
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type AppRoute =
  | "/"
  | "/Leadership"
  | "/Blog"
  | "/CareersPinesphere"
  | "/Contact";

const menuItems: { label: string; route: AppRoute; icon: JSX.Element }[] = [
  {
    label: "Home",
    route: "/",
    icon: <Ionicons name="home-outline" size={22} color="#183153" />,
  },
  {
    label: "Leadership",
    route: "/Leadership",
    icon: <Ionicons name="heart" size={22} color="#183153" />,
  },
  {
    label: "Blog",
    route: "/Blog",
    icon: (
      <MaterialCommunityIcons
        name="newspaper-variant-outline"
        size={22}
        color="#183153"
      />
    ),
  },
  {
    label: "Careers",
    route: "/CareersPinesphere",
    icon: <FontAwesome5 name="user-tie" size={20} color="#183153" />,
  },
  {
    label: "Contact",
    route: "/Contact",
    icon: <Ionicons name="mail-outline" size={22} color="#183153" />,
  },
];

const leaders = [
  {
    name: "SURENDIRAN",
    title: "Chief Executive Officer, Pinesphere",
    image: require("../assets/images/leaders/1.jpg"),
    quote: "“Vision is the art of seeing what is invisible to others.”",
    bg: "#fbeaea",
  },
  {
    name: "VASANTH",
    title: "Chief Technology Officer, Pinesphere",
    image: require("../assets/images/leaders/2.jpg"),
    quote: "“Innovation distinguishes between a leader and a follower.”",
    bg: "#f2f2f2",
  },
];

// Example dev team, update image paths and names as needed
const devTeam = [
  {
    name: "Vishali",
    role: "BDA",
    image: require("../assets/images/dev/1.jpg"),
  },
  {
    name: "Nandhini",
    role: "Developer",
    image: require("../assets/images/dev/2.jpg"),
  },
  {
    name: "Kiruthika",
    role: "Developer",
    image: require("../assets/images/dev/3.jpg"),
  },
  {
    name: "Kauvery",
    role: "Developer",
    image: require("../assets/images/dev/4.jpg"),
  },
];

const CIRCLE_SIZE = 90;
const CIRCLE_MARGIN = 18;
const NUM_COLUMNS = Math.floor(width / (CIRCLE_SIZE + CIRCLE_MARGIN * 2));

const Leadership = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleMenu = (route: AppRoute) => {
    router.push(route as any);
  };

  // Split devTeam into rows for grid display
  const getRows = (arr: typeof devTeam, columns: number) => {
    const rows = [];
    for (let i = 0; i < arr.length; i += columns) {
      rows.push(arr.slice(i, i + columns));
    }
    return rows;
  };

  const devTeamRows = getRows(devTeam, NUM_COLUMNS);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Banner Section */}
      <View style={styles.banner}>
        <Image
          source={require("../assets/images/banner/13.jpg")}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        {/* <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Leadership</Text>
          <Text style={styles.bannerSubtitle}>Meet our Leaders</Text>
        </View> */}
      </View>
      <ScrollView contentContainerStyle={styles.contentPanel}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Board of Directors</Text>
          {leaders.map((leader) => (
            <View
              key={leader.name}
              style={[styles.leaderCard, { backgroundColor: leader.bg }]}
            >
              <Image source={leader.image} style={styles.leaderImage} />
              <View style={styles.leaderInfo}>
                <Text style={styles.leaderName}>{leader.name}</Text>
                <Text style={styles.leaderTitle}>{leader.title}</Text>
                <Text style={styles.leaderQuote}>{leader.quote}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Development Team</Text>
          <Text style={styles.sectionText}>
            Our development team is driven by passion, innovation, and a
            commitment to excellence. Together, we turn ideas into impactful
            solutions.
          </Text>
          <View style={styles.devTeamGrid}>
            {devTeamRows.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.devTeamRow}>
                {row.map((emp) => (
                  <View key={emp.name} style={styles.devPicWrapper}>
                    <Image source={emp.image} style={styles.devPic} />
                    <View style={styles.devPicLabel}>
                      <Text style={styles.devPicName}>{emp.name}</Text>
                      <Text style={styles.devPicRole}>{emp.role}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navBtn}
            onPress={() => handleMenu(item.route)}
          >
            {item.icon}
            <Text style={styles.navText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f8fa",
  },
  banner: {
    width: "100%",
    height: 230,
    position: "relative",
    marginBottom: 10,
    backgroundColor: "#eafbee",
    justifyContent: "flex-end",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  bannerOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    alignItems: "center",
    backgroundColor: "rgba(106, 133, 145, 0.89)",
    paddingVertical: 10,
  },
  bannerTitle: {
    color: "#cee2fe",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  bannerSubtitle: {
    color: "#191919",
    fontSize: 20,
    marginTop: 2,
    fontWeight: "500",
  },
  contentPanel: {
    padding: width < 400 ? 8 : 16,
    paddingBottom: 90,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: width < 400 ? 10 : 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#183153",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 15,
    color: "#222",
    marginBottom: 4,
  },
  leaderCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#4a90e2",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  leaderImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 18,
    borderWidth: 2,
    
    backgroundColor: "#fff",
  },
  leaderInfo: {
    flex: 1,
  },
  leaderName: {
    fontWeight: "bold",
    color: "#183153",
    fontSize: 17,
    marginBottom: 2,
  },
  leaderTitle: {
    color: "#4a90e2",
    fontSize: 14,
    marginBottom: 6,
  },
  leaderQuote: {
    fontStyle: "italic",
    color: "#888",
    fontSize: 13,
  },
  devTeamGrid: {
    marginTop: 18,
    marginBottom: 8,
    alignItems: "center",
    width: "100%",
  },
  devTeamRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    width: "100%",
  },
  devPicWrapper: {
    alignItems: "center",
    marginHorizontal: CIRCLE_MARGIN,
    marginBottom: 0,
  },
  devPic: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,

    backgroundColor: "#fff",

    shadowOpacity: 0.13,
    shadowRadius: 8,
    marginBottom: 8,
  },
  devPicLabel: {
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    marginTop: 2,
   
  },
  devPicName: {
    fontWeight: "bold",
    color: "#183153",
    fontSize: 13,
    marginBottom: 0,
  },
  devPicRole: {
    color: "#4a90e2",
    fontSize: 11,
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 62,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 8,
    zIndex: 10,
    paddingBottom: 2,
  },
  navBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    justifyContent: "center",
  },
  navText: {
    color: "#183153",
    fontWeight: "bold",
    fontSize: width < 400 ? 11 : 13,
    marginTop: 2,
  },
});

export default Leadership;
