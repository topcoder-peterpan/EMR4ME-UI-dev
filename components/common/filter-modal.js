import React, { useState } from "react";
import { Modal, StyleSheet, FlatList, View, Text } from 'react-native';
import { fonts, metrics, theme } from '../../constants';
import { Icon, CheckBox, Button } from 'react-native-elements';
import { i18n } from '../../util';

import CheckedCheckbox from '../../assets/images/checked-checkbox.svg';
import UncheckedCheckbox from '../../assets/images/unchecked-checkbox.svg';

export default (props) => {
  const { modalVisible, headerTitle, onClose, onFilter, data, filteredTypes, setFilteredTypes, errorMessage } = props;
  const [warningVisibility, setWarningVisibility] = useState(false);
  const checkWarningMsg = (wasChecked) => {
    if (!wasChecked && warningVisibility)
      setWarningVisibility(false);
  };

  const closePressHandler = () => {
    if (filteredTypes.length > 0 && filteredTypes.every(o => !o))
      setWarningVisibility(true);
    else
      onClose()
  }
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible || false} onRequestClose={closePressHandler}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.filterModalTitle}>
            <Text style={styles.filterText}>{headerTitle}</Text>
            <Icon type="ionicon" name="ios-close" size={35}
              iconStyle={styles.closeIcon}
              onPress={closePressHandler} containerStyle={styles.closeIcon} />
          </View>
          <View style={styles.filterChecksContainer}>
            <FlatList
              data={data || []}
              renderItem={({ item: type, index }) => {
                const isChecked = filteredTypes[index];
                return (<CheckBox
                  key={type}
                  title={type}
                  checkedIcon={<CheckedCheckbox width={16} style={{ alignSelf: 'flex-start' }} />}
                  uncheckedIcon={<UncheckedCheckbox width={16} style={{ alignSelf: 'flex-start' }} />}
                  checked={isChecked}
                  onPress={() => {
                    let newfilteredTypes = [...filteredTypes];
                    newfilteredTypes[index] = !filteredTypes[index];
                    setFilteredTypes(newfilteredTypes);
                    checkWarningMsg(isChecked);
                  }}
                  containerStyle={styles.filterCheckContainer}
                  textStyle={styles.filterTextStyles}
                />)
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <Button
              title={i18n.t('documents.filterNow')}
              buttonStyle={styles.filterButton}
              onPress={() => {
                if (filteredTypes.length > 0 && filteredTypes.every(o => !o))
                  setWarningVisibility(true);
                else if (filteredTypes.find(type => !!type)) {
                  if (onFilter) onFilter();
                  onClose();
                } else
                  onClose();
              }}
            />
          </View>
          <View>
            {warningVisibility ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#00000088',
  },
  modalView: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 15,
    padding: 20,
    paddingTop: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterCheckContainer: {
    padding: 0,
    marginLeft: 0,
    marginRight: '3%',
    flexBasis: '44%',
    flexWrap: 'wrap',
    overflow: 'scroll',
    backgroundColor: '#FFF',
    borderWidth: 0,
    marginVertical: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  filterTextStyles: {
    flexWrap: 'wrap',
    fontSize: 13,
    paddingRight: 8,
    lineHeight: 18,
  },
  filterModalTitle: {
    justifyContent: "center",
    alignItems: "center",
  },
  filterText: {
    fontFamily: fonts.MontserratBold,
    color: theme.colors.primary,
    fontSize: 20,
  },
  filterChecksContainer: {
    maxHeight: 20 * metrics.vh,
    flexDirection: 'column',
    marginTop: 10,
  },
  error: {
    color: 'red'
  },
  closeIcon: {
    position: "absolute",
    top: -5,
    right: 0,
    zIndex: 2,
    padding: 3,
  }
})