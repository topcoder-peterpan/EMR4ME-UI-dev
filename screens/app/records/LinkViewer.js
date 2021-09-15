import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { ThemeConsumer } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import CloseIcon from '../../../components/common/close-icon';
import { useNavigation } from '@react-navigation/native';

export default (({ route }) => {

  const navigation = useNavigation();
  // if (!route.params.id)
  //   navigation.goBack()
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar backgroundColor={theme.colors.primary} barStyle="dark-content" />
          <SafeAreaView style={styles.container}>
            <CloseIcon onPress={() => {
              navigation.goBack()
            }} />
            <WebView source={{ uri: route.params.id }} />
          </SafeAreaView>
        </>
      )}
    </ThemeConsumer>
  )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
