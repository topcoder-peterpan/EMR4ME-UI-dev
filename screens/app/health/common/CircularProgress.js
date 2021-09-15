import React from 'react';
import { Image, View, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import { fonts, images } from "./../../../../constants";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default (props) => {
  const { fillPercent, children } = props;

  return (
    <View style={styles.container}>
      <Image source={images.riskHeader} style={styles.image} />
      <AnimatedCircularProgress
        size={130}
        width={7}
        fill={fillPercent}
        duration={500}
        tintColor="#CAF369"
        lineCap="round"
        rotation={-90}
        lineCap="round"
        useNativeDriver={false}
        backgroundColor="#FFF"
      >
        {(fill) => (
          <Text style={styles.text}>
            {children}
          </Text>
        )}
      </AnimatedCircularProgress>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginTop: 30,
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  text: {
    color: "#FFF",
    fontFamily: fonts.MontserratBold,
    fontSize: 18,
  },
});
