import { styles } from "../AppStyles.js";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import officeBuilding from "../assets/Icons/officeBuildingIcon.png";
import officetel from "../assets/Icons/officetelIcon.png";
import house from "../assets/Icons/HouseIcon.png";
import { TouchableOpacity } from "react-native";

export default function NearPick({ info, handleFocus }) {
  return (
    <TouchableOpacity
      onPress={() => {
        handleFocus(info);
      }}
    >
      <View style={styles.nearPickStyles}>
        <Image source={officeBuilding} style={styles.nearPickImage} />
        <Text style={styles.nearPickText}>{info.openAddress2}</Text>
        <Text style={styles.nearPickDistanceText}>근처 10m</Text>
        <View style={styles.nearPickWeight}>
          <Text>
            <Text style={styles.nearPickWeightText}>무게 </Text>
            <Text style={[styles.nearPickWeightText, { fontWeight: "600" }]}>
              {info.weight} kg
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
