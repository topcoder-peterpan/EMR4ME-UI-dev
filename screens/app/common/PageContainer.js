import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { ThemeConsumer } from "react-native-elements";
import { connect } from "react-redux";
import AwesomeLoader from "../../../components/common/awesome-Loader";
const mapStateToProps = (state) => ({
  isLoading: state.UI.isLoading,
  showCustomLoader: state.UI.showCustomLoader
})
export default connect(mapStateToProps)((props) => {
  const { children, barStyle, isLoading, showCustomLoader, hideLoader } = props;
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar
            backgroundColor={theme.colors.primary}
            barStyle={barStyle || "light-content"}
          />
          <SafeAreaView style={styles.container}>
            {isLoading && showCustomLoader && !hideLoader ? (<AwesomeLoader />) : children}
          </SafeAreaView>
        </>
      )}
    </ThemeConsumer>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
