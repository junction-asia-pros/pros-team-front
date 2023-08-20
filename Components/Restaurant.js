import { Image, View, Text, TouchableOpacity } from "react-native";
import { styles } from "../AppStyles";
import officeBuilding from "../assets/office-building.png";
import { Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import cupIcon from "../assets/CupIcon.png";
import dishIcon from "../assets/DishIcon.png";
import utensilIcon from "../assets/UtensilIcon.png";

import DishCount from "./DishCount";

export default function Restaurant({ info, handlePickUp }) {
  return (
    <View style={styles.restaurant}>
      <View style={styles.restaurantTop}>
        <Image source={officeBuilding} style={styles.restaurantImage} />
        <View style={styles.restaurantInfo}>
          <Text style={styles.orderAdd2}>{info?.orderAddress2}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Ionicons name="location-sharp" size={16} color="#727171" />
            <Text style={styles.orderAdd1}>{info?.orderAddress1}</Text>
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
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <DishCount
              imageSource={dishIcon}
              count={0}
              customTranslate={[{ scale: 0.2 }, { translateY: -255 }]}
            />
            <DishCount
              imageSource={cupIcon}
              count={0}
              customTranslate={[{ scale: 1 }, { translateY: -20 }]}
            />
            <DishCount
              imageSource={utensilIcon}
              count={0}
              customTranslate={[{ scale: 1 }]}
            />
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <DishCount
              imageSource={dishIcon}
              count={0}
              customTranslate={[{ scale: 0.25 }, { translateY: -185 }]}
            />
            <DishCount
              imageSource={dishIcon}
              count={0}
              customTranslate={[{ scale: 0.3 }, { translateY: -165 }]}
            />
            <DishCount
              imageSource={dishIcon}
              count={0}
              customTranslate={[{ scale: 0.38 }, { translateY: -135 }]}
            />
          </View>
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
