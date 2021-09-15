import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { ThemeConsumer } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';
import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';

import { getDocData } from './../../../store/actions/creators/user'
import { file, metrics } from './../../../constants'
import { connect, useDispatch } from 'react-redux';
import { showAlert } from '../../../store/actions/creators/UI';
import { i18n } from '../../../util';
import CloseIcon from '../../../components/common/close-icon';
import AwesomeLoader from '../../../components/common/awesome-Loader';
import { Dimensions } from 'react-native';
const mapStateToProps = (state) => ({
  isLoading: state.UI.isLoading,
  myProviders: state.user.myProviders,
});
export default connect(mapStateToProps)(({ route, navigation, isLoading }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [doc, setDoc] = useState([
    {
      url: '',
      width: metrics.screenWidth,
      height: metrics.screenHeight,
      props: {
        resizeMode: 'contain',
      },
    },
  ]);

  useEffect(() => {
    getDocData(route.params.id).then(data => {
      setLoaded(true);
      if (data.statusCode == "0") {
        if (!data.payload.payload.type || file.allowedExtensions.includes(data.payload.payload.type.toLowerCase())) {
          setDoc([
            {
              url: `data:image/${data.payload.type};base64,${data.payload.file}`,
              width: metrics.screenWidth,
              height: metrics.screenHeight,
              props: {
                resizeMode: 'contain',
              },
            },
          ]);
          setType('img');
        } else if (data.payload && data.payload.payload && data.payload.payload.type === "application/pdf") {
          setDoc((data.payload.file));
          setType('application/pdf');
        }
        else {
          setDoc((data.payload.file));
          setType('html');
        }
      } else {
        if (navigation)
          navigation.goBack();
        dispatch(showAlert({ msg: i18n.t('error.documentCorrupted'), type: 'error', present: false, iconName: 'warning' }));
      }
    });
  }, []);

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <StatusBar backgroundColor={theme.colors.primary} barStyle="dark-content" />
          <SafeAreaView style={styles.container}>
            <CloseIcon onPress={() => {
              navigation.goBack()
            }} />
            {isLoading && !loaded ? <AwesomeLoader /> :
              type === 'application/pdf' ? (
                <>
                  <Pdf
                    source={{ uri: doc }}
                    onLoadComplete={(numberOfPages, filePath) => {
                      console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                      console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                      navigation.goBack();
                      dispatch(showAlert({ msg: i18n.t('error.documentCorrupted'), type: 'error', present: false, iconName: 'warning' }));
                    }}
                    onPressLink={(uri) => {
                      console.log(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf} />
                </>
              ) :
                type === 'html' ? (
                  <>
                    <WebView source={{ html: doc }} />
                  </>
                ) : type ? (
                  <>
                    <ImageViewer imageUrls={doc} />
                  </>
                ) : null
            }
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
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});
