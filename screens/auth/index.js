import React from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemeConsumer, Text, Button } from 'react-native-elements';
import { images, theme, fonts, metrics  } from './../../constants'
import { i18n } from '../../util';

export default props => {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
          <SafeAreaView style={styles.container}>
            <Image source={images.landing} style={styles.landingBG} />
            <View style={{ width: '70%' }}>
              <Text
                style={styles.title}>
                {i18n.t('user.landingTitle')}
              </Text>
              <Button
                title={i18n.t('user.signIn')}
                onPress={() => {
                  props.navigation.navigate('Login');
                }}
              />
              <Button
                title={i18n.t('user.createAccount')}
                buttonStyle={styles.buttonStyle}
                titleStyle={{ color: theme.colors.secondary }}
                containerStyle={{ marginBottom: 30 }}
                 onPress={() => {
                  props.navigation.navigate('SignUp');
                  //props.navigation.navigate('Terms');
                }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text>{i18n.t('user.forgotPassword')}</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('ForgotPW')}>
                  <Text
                    style={{
                      color: theme.colors.primary,
                      fontFamily: fonts.MontserratBold,
                    }}>
                    {' '+i18n.t('user.clickHere')}
                  </Text>
                </TouchableOpacity>
              </View>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  landingBG: {
    position: 'absolute',
    top: '-25%',
    height: 75 * metrics.vh
  },
  buttonStyle: {
    backgroundColor: '#FFFFFF00',
    borderWidth: 2,
    borderColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  title: {
    color: theme.colors.primary,
    textAlign: 'center',
    fontSize: 26,
    fontFamily: fonts.MontserratBold,
    marginBottom: 10,
  }
});
