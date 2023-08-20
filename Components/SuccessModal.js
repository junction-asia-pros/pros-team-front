import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "../AppStyles.js";

import cloverLeaf from "../assets/cloverLeaf.png";

export default function SuccessModal({ handleExitReward, handlePickUpCheck }) {
  return (
    <>
      <View style={styles.centeredView}>
        <View style={styles.successModelView}>
          <Text style={styles.successModalTitle}>반납 완료! 수고했어요!</Text>
          <View style={styles.successIconContainer}>
            <Image source={cloverLeaf} style={styles.successIcon} />
          </View>
          <Text style={styles.successModalDesc}>
            클로버 잎 한 장을 지급받았어요!
          </Text>
          <View style={styles.successModelButtonContainer}>
            <TouchableOpacity
              style={{
                ...styles.modalPickUpButton,
                backgroundColor: "#EBEBEB",
              }}
              onPress={handleExitReward}
            >
              <Text
                style={{ ...styles.modalPickUpButtonText, color: "#B3B3B3" }}
              >
                나가기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalPickUpButton}
              onPress={handlePickUpCheck}
            >
              <Text style={styles.modalPickUpButtonText}>확인하러 가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
