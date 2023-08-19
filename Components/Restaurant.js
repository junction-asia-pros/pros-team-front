import { Image, View, Text, TouchableOpacity } from "react-native";
import { styles } from "../AppStyles";
import officeBuilding from "../assets/office-building.png";
import { Button } from "react-native";
import dishSmall from "../assets/dish-small.png";
import dishMed from "../assets/dish-med.png";
import dishBig from "../assets/dish-big.png";
import { Ionicons } from "@expo/vector-icons";

import DishCount from "./DishCount";

export default function Restaurant({ info, handlePickUp }) {
  return (
    <View style={styles.restaurant}>
      <View style={styles.restaurantTop}>
        <Image source={officeBuilding} style={styles.restaurantImage} />
        <View style={styles.restaurantInfo}>
          <Text style={styles.orderAdd2}>{info?.openAddress2}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Ionicons name="location-sharp" size={16} color="#727171" />
            <Text style={styles.orderAdd1}>{info?.openAddress1}</Text>
          </View>
        </View>
      </View>
      <View style={styles.restaurantBody}>
        <View
          style={{ flex: 0.9, justifyContent: "top", alignItems: "center" }}
        >
          <Text style={styles.restaurantName}>{info?.restaurantName}</Text>
          <Text style={styles.restaurantAddress}>
            {info?.restaurantAddress}
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <DishCount imageSource={dishSmall} count={0} index={2} />
          <DishCount imageSource={dishMed} count={0} index={1} />
          <DishCount imageSource={dishBig} count={0} index={0} />
        </View>
        <View
          style={{ flex: 1.2, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.commentText}>
            그릇이 모두 13인치 노트북 가방에 들어가요!
          </Text>
          <Text style={styles.weightText}>무게: 3kg</Text>
        </View>
      </View>
      <View style={styles.restaurantBottom}>
        <TouchableOpacity
          style={styles.restaurantBottomButton}
          onPress={handlePickUp}
        >
          <Text style={styles.restaurantButtonText}>Pick Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
