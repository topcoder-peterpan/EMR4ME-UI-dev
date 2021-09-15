import React from "react";
import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import ButtonsListView from "./ButtonsListView";
import { metrics } from "../../../../../constants";

export default (props) => {
  const {
    showBackDrop,
    setShowBackDrop,
    bottomSheet,
    closeBottomSheet,
    BottomSheetButtonsList,
  } = props;
  
  let fall = new Animated.Value(1);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const renderInner = () => (
    <View style={styles.panel}>
      <ButtonsListView buttonsList={BottomSheetButtonsList} />
    </View>
  );

  return (
    <>
      {showBackDrop && (
        <View onTouchEnd={closeBottomSheet} style={styles.backDrop}></View>
      )}
      <BottomSheet
        ref={bottomSheet}
        snapPoints={[BottomSheetButtonsList.length * 66 + 45, -300]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
        onOpenEnd={() => {
          setShowBackDrop(true);
        }}
        onCloseEnd={() => {
          setShowBackDrop(false);
        }}
      />
      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}
      ></Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  panel: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "white",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: metrics.vw * 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  backDrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000088",
  },
});
