import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  Easing,
} from "react-native";
import { styles } from "../AppStyles.js";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import clover0 from "../assets/Clover/Clover0.png";
import clover1 from "../assets/Clover/Clover1.png";
import clover2 from "../assets/Clover/Clover2.png";
import clover3 from "../assets/Clover/Clover3.png";
import clover4 from "../assets/Clover/Clover4.png";
import cloverBlur from "../assets/Clover/CloverBlur.png";

export default function EmoteDisplay({ handleBack }) {
  const [emoteCollected, setEmoteCollected] = useState(4);
  const [emoteImages, setEmoteImage] = useState([]);

  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(0)).current;
  const moveAnim1 = useRef(new Animated.ValueXY()).current;
  const moveAnim2 = useRef(new Animated.ValueXY()).current;
  const moveAnim3 = useRef(new Animated.ValueXY()).current;
  const moveAnim4 = useRef(new Animated.ValueXY()).current;
  const moveAnim5 = useRef(new Animated.ValueXY()).current;
  const moveAnim6 = useRef(new Animated.ValueXY()).current;
  const moveAnim7 = useRef(new Animated.ValueXY()).current;
  const moveAnim8 = useRef(new Animated.ValueXY()).current;
  const moveAnim9 = useRef(new Animated.ValueXY()).current;
  const moveAnim10 = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    let imgArr = [];
    imgArr.push(clover0);
    imgArr.push(clover1);
    imgArr.push(clover2);
    imgArr.push(clover3);
    imgArr.push(clover4);
    setEmoteImage(imgArr);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeOutAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(fadeInAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim1, {
          toValue: { x: 57, y: 88 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim2, {
          toValue: { x: 78, y: 11 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim3, {
          toValue: { x: 40, y: -68 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim4, {
          toValue: { x: 96, y: -66 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim5, {
          toValue: { x: -154, y: -89 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim6, {
          toValue: { x: -83, y: -79 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim7, {
          toValue: { x: -60, y: -50 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim8, {
          toValue: { x: -53, y: 0 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim9, {
          toValue: { x: -50, y: 47 },
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim10, {
          toValue: { x: -50, y: 47 },
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.EmoteContainer}>
      <View style={styles.EmoteTopBar}>
        <TouchableOpacity style={styles.EmoteBackButton} onPress={handleBack}>
          <Ionicons name="chevron-back-sharp" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.EmoteTop}>
        <Text style={styles.EmoteTitle1}>리워드 목표 달성</Text>
        <Text style={styles.EmoteTitle2}>네잎 클로버를 완성했습니다!</Text>
      </View>
      <View style={styles.EmoteBody}>
        <Animated.Image
          source={cloverBlur}
          style={{ ...styles.EmoteAnimation, opacity: fadeInAnim }}
        />
        <Animated.View
          style={{
            ...styles.EmoteAnimBall,
            transform: [
              { scale: 1.4 },
              { translateX: moveAnim1.x },
              { translateY: moveAnim1.y },
            ],
            opacity: fadeOutAnim,
            backgroundColor: "#FF4747",
          }}
        />
        <Animated.View
          style={{
            ...styles.EmoteAnimBall,
            transform: [
              { scale: 2 },
              { translateX: moveAnim2.x },
              { translateY: moveAnim2.y },
            ],
            opacity: fadeOutAnim,
            backgroundColor: "#48A7FF",
          }}
        />
        <Animated.View
          style={{
            ...styles.EmoteAnimBall,
            transform: [
              { scale: 2.2 },
              { translateX: moveAnim3.x },
              { translateY: moveAnim3.y },
            ],

            opacity: fadeOutAnim,
            backgroundColor: "#39FF4D",
          }}
        />
        <Animated.View
          style={{
            ...styles.EmoteAnimBall,
            transform: [
              { scale: 1.2 },
              { translateX: moveAnim4.x },
              { translateY: moveAnim4.y },
            ],
            opacity: fadeOutAnim,
            backgroundColor: "#FFB067",
          }}
        />
        <Animated.View
          style={{
            ...styles.EmoteAnimBall,
            transform: [
              { scale: 0.9 },
              { translateX: moveAnim5.x },
              { translateY: moveAnim5.y },
            ],
            opacity: fadeOutAnim,
            backgroundColor: "#FFE663",
          }}
        />
        <Animated.View
          style={{
            ...styles.EmoteAnimBall,
            transform: [
              { scale: 1.2 },
              { translateX: moveAnim6.x },
              { translateY: moveAnim6.y },
            ],
            opacity: fadeOutAnim,
            backgroundColor: "#FF7A7A",
          }}
        />
        <Animated.View
          style={{
            ...styles.EmoteAnimBall,
            transform: [
              { scale: 1 },
              { translateX: moveAnim7.x },
              { translateY: moveAnim7.y },
            ],
            opacity: fadeOutAnim,
            backgroundColor: "#48A7FF",
          }}
        />
        <Animated.View
          style={{
            ...styles.EmoteAnimBall,
            transform: [
              { scale: 2.4 },
              { translateX: moveAnim8.x },
              { translateY: moveAnim8.y },
            ],
            opacity: fadeOutAnim,
            backgroundColor: "#FFA979",
          }}
        />
        <Animated.View
          style={{
            ...styles.EmoteAnimBall,
            transform: [
              { scale: 2.4 },
              { translateX: moveAnim9.x },
              { translateY: moveAnim9.y },
            ],
            opacity: fadeOutAnim,
            backgroundColor: "#61E199",
          }}
        />
        <Animated.View
          style={{
            ...styles.EmoteAnimBall,
            transform: [
              { scale: 1.5 },
              { translateX: moveAnim9.x },
              { translateY: moveAnim9.y },
            ],
            opacity: fadeOutAnim,
            backgroundColor: "#D375FF",
          }}
        />
        <Animated.Image
          source={emoteImages[emoteCollected]}
          style={{ ...styles.emoteImage, opacity: fadeInAnim }}
        />
      </View>
      <View style={styles.EmoteBottom}>
        <View style={styles.EmoteMultiplier}>
          <Text style={styles.EmoteMultiplierText}>x4</Text>
        </View>
        <View style={styles.EmoteDesc}>
          <Text style={styles.EmoteDescText}>다음 다회 용기 반납에서 평소</Text>
          <Text>
            <Text style={{ ...styles.EmoteDescText, color: "#FF9B3F" }}>
              반납 금액의 4배를 제공
            </Text>
            <Text style={styles.EmoteDescText}>받을 수 있어요</Text>
          </Text>
        </View>
      </View>
      <View style={styles.EmoteFooter}>
        <TouchableOpacity style={styles.EmoteButton} onPress={handleBack}>
          <Text style={styles.modalPickUpButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
