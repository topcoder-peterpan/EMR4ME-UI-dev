import React from "react";
import SplashScreen from "react-native-splash-screen";
import { ThemeProvider } from "react-native-elements";
import { useDispatch, connect, useSelector } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import {
  handleInternetConnection,
  _handleAppStateChange,
} from "../util/common";

import { AuthContext } from "./../components/auth/AuthContext";
import { signUp, login, logout } from "./../store/actions/creators/auth";
import { theme } from "./../constants";
import Screens from "./screens";
import Modal from "../components/common/modal";
import Loader from "../components/common/Loader";
import { AppState } from "react-native";
import ConfirmationModal from "../components/common/ConfirmationModal";
import HelpModal from "../components/common/HelpModal";
import { scheduleReminders } from "./app/reminders/RemindersSchedule";
import { createTables } from "./app/reminders/DataAccessLayer";

const mapStateToProps = (state) => ({
  isLoading: state.user.isLoading,
  userToken: state.user.userToken,
  isSignout: state.user.isSignout,
  msg: state.UI.msg,
  note: state.UI.note,
  title: state.UI.title,
  type: state.UI.type,
  present: state.UI.present,
  alertVisible: state.UI.alertVisible,
  iconName: state.UI.iconName,
  leftButton: state.UI.leftButton,
  rightButton: state.UI.rightButton,
  isLoadingUI: state.UI.isLoading,
  showConfirmationDialogue: state.UI.showConfirmationDialogue,
  showHelpDialogue: state.UI.showHelpDialogue,
});
export default connect(mapStateToProps)(function (props) {
  const {
    isLoadingUI,
    isLoading,
    userToken,
    msg,
    note,
    title,
    type,
    present,
    alertVisible,
    showConfirmationDialogue,
    showHelpDialogue,
    iconName,
    leftButton,
    rightButton,
  } = props;
  const dispatch = useDispatch();
  React.useEffect(() => {
    let unsubscribe = NetInfo.addEventListener(handleInternetConnection);
    NetInfo.fetch().then(handleInternetConnection);
    unsubscribe();

    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  React.useEffect(() => {
    createTables();
    scheduleReminders();
    if (!isLoading)
      setTimeout(() => {
        SplashScreen.hide();
      }, 3000);
  }, [isLoading]);

  const authContext = {
    signIn: async (data) => dispatch(login(data)),
    signOut: () => dispatch(logout()),
    signUp: async (data) => dispatch(signUp(data)),
  };
  return (
    <AuthContext.Provider value={authContext}>
      <ThemeProvider theme={theme}>
        <Screens theme={theme} {...props} />
      </ThemeProvider>
      {alertVisible && !isLoadingUI && (
        <Modal
          visible={alertVisible}
          iconName={iconName}
          type={type}
          message={msg}
          title={title}
          present={present}
        />
      )}
      {showConfirmationDialogue && (
        <ConfirmationModal
          visible={showConfirmationDialogue}
          message={msg}
          note={note}
          title={title}
          leftButton={leftButton}
          rightButton={rightButton}
        />
      )}
      {showHelpDialogue && (
        <HelpModal
          visible={showHelpDialogue}
          message={msg}
          title={title}
          leftButton={leftButton}
        />
      )}
      <Loader />
    </AuthContext.Provider>
  );
});
