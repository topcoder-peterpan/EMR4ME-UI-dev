import React, { useState, useRef } from "react";
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
   KeyboardAvoidingView,
   TouchableWithoutFeedback, Keyboard
} from "react-native";
import {  Button, Input, ThemeConsumer, Text } from "react-native-elements";
import { i18n } from "../../../util";
import { fonts, theme } from "../../../constants";
import BottomScrollButton from "./BottomScrollButton";
// import { showAlert } from '../store/actions/creators/UI';
import { showAlert } from '../../../store/actions/creators/UI';
import { useDispatch } from 'react-redux';
import Signature from "./Signature";

export default (props) => {
  const [fullName, setFullName] = useState('');
  const dispatch = useDispatch();

  let scrollView = useRef();
  const [scrollIconVisibility, setScrollIconVisibility] = useState(false);

  const scrollHandler = (event) => {
    const agreeBtnVisibility = isAgreeButtonVisible(event);
    if (scrollIconVisibility && agreeBtnVisibility)
      setScrollIconVisibility(false);
    else if (!scrollIconVisibility && !agreeBtnVisibility)
      setScrollIconVisibility(true);
  };

  const isAgreeButtonVisible = (event) =>
    event.nativeEvent.contentSize.height - event.nativeEvent.contentOffset.y <
    780;

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar
            backgroundColor={theme.colors.primary}
            barStyle="light-content"
          />
          <SafeAreaView style={styles.container}>   
          <View>
          {scrollIconVisibility && (
                <BottomScrollButton scrollView={scrollView} />
              )}       
               <KeyboardAvoidingView
              enabled
              keyboardVerticalOffset={100}
              behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
              <ScrollView
              contentContainerStyle={{ padding: 30 }}
                     enableOnAndroid={true}
                     enableAutomaticScroll={(Platform.OS === 'ios')} 
                     enableResetScrollToCoords={false}
                ref={scrollView}
                contentContainerStyle={{
                  paddingHorizontal: 30,
                }}
                scrollEventThrottle={16}
                onScroll={scrollHandler}
              >
                   
                {props.children}
                {props.signature ? (
                  <Signature fullName={fullName} setFullName={setFullName} />
                ):null}
                <Button
                  title={i18n.t("common.agree")}
                  containerStyle={{
                    marginTop: 30,
                  }}
                  buttonStyle={{
                    paddingHorizontal: 40,
                  }}

                  onPress={() => {
                    if (props.signature && !fullName)
                      dispatch(showAlert({ msg: i18n.t('common.signatureError'), type: 'error', present: false, iconName: 'warning' }))
                    else
                      props.agreeClickHandler();
                  }}
                />
              </ScrollView>
              </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </View> 
          </SafeAreaView>
        </>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: theme.colors.secondary,
    fontSize: 22,
    fontFamily: fonts.MontserratBold,
    textAlign: "center",
    marginTop: 20,
    alignSelf: "center",
  },
});
