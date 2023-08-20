import { ImageBackground, View, TouchableOpacity, Image } from "react-native";
import { styles } from "../AppStyles.js";
import { Ionicons } from "@expo/vector-icons";
import emoteButton from "../assets/EmoteSpecialButton.png";

export default function EmoteCollection({ handleBack, handleEmoteSelect }) {
  return (
    <View style={styles.CollectionContainer}>
      <ImageBackground
        source={require("../assets/tempEmoteBackground.png")}
        style={styles.CollectionImage}
      >
        <TouchableOpacity
          style={styles.CollectionBackButton}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back-sharp" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.CollectionEmoteButton}
          onPress={handleEmoteSelect}
        >
          <Image
            source={emoteButton}
            style={styles.CollectionEmoteButtonImage}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}
