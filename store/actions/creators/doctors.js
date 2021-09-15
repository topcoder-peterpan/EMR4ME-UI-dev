import { Platform, PermissionsAndroid } from "react-native";
import { i18n } from "../../../util";

import { showAlert } from "../../../store/actions/creators/UI";
import { selectContact } from 'react-native-select-contact';

import store from '../../configStore';
import { requestAddDoctor, requestDeleteDoctor, requestEditDoctor, requestListDoctors } from "../../../apis/doctor";

const requestAndroidPermission = async () => {
  const request = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
    title: "Contacts",
    message: "This app would like to view your contacts."
  })
    console.log("result of request permissions", request);
    if(request != 'denied' && request != 'never_ask_again') {
    return  openContacts();
    } else {
      store.dispatch(showAlert({
        msg: i18n.t("common.contactPermission"),
        type: "error",
        present: false,
        iconName: "warning",
      }))
    }
    return null;
};


const openContacts = async () => {
  return await selectContact();

  // ContactsWrapper.getContact().then((contact) => {
  //   alert('d');
  //   // this.importingContactInfo = false;
  //   console.log("Contact is: ", contact);
  //   if(contact.email == undefined && contact.phone == undefined) {
  //     alert('this contact is missing some info you can not use it');
  //   } else {
  //     alert('contact shared successfully');
  //   }
  // }).catch((error) => {
  //   // this.importingContactInfo = false;
  //   console.log("Error Code: ", error.code);
  //   console.log("Error MESSAGE: ", error.message);
  // })
}


export const getContacts = () => {
  if (Platform.OS === 'android') {
    return requestAndroidPermission();
  } else {
    return openContacts();
  }
};

export const listDoctors = () => requestListDoctors({});

export const addDoctor = data => requestAddDoctor(data);

export const editDoctor = data => requestEditDoctor(data);

export const deleteDoctor = data => requestDeleteDoctor(data);