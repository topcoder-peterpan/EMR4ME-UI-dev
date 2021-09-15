import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Image } from 'react-native-animatable';
import { images } from '../../constants';

export default ({ withoutFlickers }) => {
  const fadeInOut = useMemo(() => ({
    from: {
      transform: [ { scaleX: 0.5 }, { scaleY: 0.5 }],
      opacity: 0,
    },
    to: {
      transform: [ { scaleX: 1 }, { scaleY: 1 }],
      opacity: 1,
    },
  }), []);

    

  return (
    <View style={styles.animationContainer}>
      <Image
        source={images.icon}
        style={{ width: 80, height: 80 }}
        iterationCount="infinite"
        direction="alternate"
        animation="pulse"
        duration={1000}
        delay={300}
      />
      {!withoutFlickers?(
        <Image
        style={{ marginTop: -90, width: 100, height: 100 }}
        iterationCount="infinite"
        source={images.flicker}
        direction="alternate"
        animation={fadeInOut}
        duration={1000}
        delay={300}
      />
      ):null}
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    // paddingTop: 20,
  },
  lottie: {
    height: 160,
    width: 160,
  },
});
