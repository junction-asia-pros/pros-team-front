import { View, Image, Text } from "react-native";
import { styles } from "../AppStyles";

export default function DishCount({ imageSource, count, customTranslate }) {
  return (
    <View style={styles.dishCount}>
      <Image
        source={imageSource}
        style={[
          styles.restaurantImage,
          {
            transform: customTranslate,
          },
        ]}
      />
      <Text style={styles.dishCountText}>{count}</Text>
    </View>
  );
}
