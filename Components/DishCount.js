import { View, Image, Text } from "react-native";
import { styles } from "../AppStyles";

export default function DishCount({ imageSource, count, index }) {
  return (
    <View style={styles.dishCount}>
      <Image
        source={imageSource}
        style={[
          styles.restaurantImage,
          {
            marginTop: index * 18,
            width: 40 * (3 - index * 0.8),
            height: 40 * (3 - index * 0.8),
          },
        ]}
      />
      <Text style={styles.dishCountText}>{count}</Text>
    </View>
  );
}
