import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, ScrollView } from 'react-native';
import { ThemeConsumer, Text, Avatar } from 'react-native-elements';
import { images, fonts, theme } from './../../../constants';
import { connect, useDispatch } from 'react-redux';
import { i18n } from '../../../util';
import moment from 'moment';

const Profile = props => {
  const dispatch = useDispatch();
  const { userData, myProviders } = props;
  const user = userData && userData.payload ? userData.payload : {};
  
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
          <SafeAreaView style={styles.container}>
            <ScrollView style={{flex:1, backgroundColor: 'white'}} bounces={false} showsVerticalScrollIndicator={false}>
              <View style={{ alignItems: 'center', padding: 30, backgroundColor:'#1EB5FC' }}>
                <Avatar
                  source={images.avatar}
                  rounded
                  containerStyle={styles.avatarContainer}
                />
                <Text
                  style={styles.title}>

                  {i18n.t('user.welcome')}, {userData.userModel ? userData.userModel.fname : ''}.
                </Text>
              </View>
              <View style={{backgroundColor:'#1EB5FC'}}>
                
              <View
                style={styles.body}>
                <View style={{ alignItems: 'center' }}>
                  <Text
                    style={styles.bodyTitle}>
                    {i18n.t('user.personalInfo')}
                  </Text>
                  <Text
                    style={styles.name}>
                    {userData.userModel ? userData.userModel.fname : ''} {userData.userModel ? userData.userModel.lname : ''}
                  </Text>
                  <Text
                    style={styles.dob}>
                    {userData.userModel && userData.userModel.dob ? moment(userData.userModel.dob).format('D MMM yyyy') : ''}
                  </Text>
                  <Text
                    style={styles.dob}>
                    {userData.userModel && userData.userModel.dob ? 'Age (' + moment().diff(userData.userModel.dob, 'years') + ')' : ''}
                  </Text>
                </View>
                <View style={{ marginTop: 20 }}>
                  <View style={styles.row}>
                    <Text>{i18n.t('user.mail')}</Text>

                    <Text style={{ fontFamily: fonts.MontserratBold }}>{userData.userModel ? userData.userModel.email : ''}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text>{i18n.t('user.username')}</Text>

                    <Text style={{ fontFamily: fonts.MontserratBold }}>{userData.userModel ? userData.userModel.username : ''}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text>{i18n.t('user.phone')}</Text>

                    <Text style={{ fontFamily: fonts.MontserratBold }}>{userData.userModel ? userData.userModel.mobile : ''}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text>{i18n.t('user.address')}</Text>

                    <Text style={{ fontFamily: fonts.MontserratBold }}>{userData.userModel ? userData.userModel.address : ''}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text>{i18n.t('user.state')}</Text>

                    <Text style={{ fontFamily: fonts.MontserratBold }}>{userData.userModel ? userData.userModel.state : ''}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text>{i18n.t('user.city')}</Text>

                    <Text style={{ fontFamily: fonts.MontserratBold }}>{userData.userModel ? userData.userModel.city : ''}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text>{i18n.t('user.zip')}</Text>

                    <Text style={{ fontFamily: fonts.MontserratBold }}>{userData.userModel ? userData.userModel.postal_code : ''}</Text>
                  </View>
                </View>
              </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </>
      )}
    </ThemeConsumer>
  );
};

const mapStateToProps = (state) => ({
  userData: state.user.userData,
  myProviders: state.user.myProviders
})
export default connect(mapStateToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: 1,
    paddingVertical: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  avatarContainer: {
    borderWidth: 4,
    borderColor: theme.colors.success,
    elevation: 11,
    width: 95,
    height: 95,
    borderRadius: 50,
    overflow: 'hidden',
  },
  title: {
    color: '#FFF',
    fontFamily: fonts.MontserratBold,
    fontSize: 22,
    marginTop: 10,
  },
  body: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
  },
  bodyTitle: {
    color: theme.colors.secondary,
    fontSize: 17,
    fontFamily: fonts.MontserratBold,
  },
  name: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: fonts.MontserratBold,
    marginTop: 15,
  },
  dob: {
    color: '#3D3D3D',
    fontSize: 14,
    paddingTop: 10,
    fontFamily: 'Montserrat-Regular',
  }
});
