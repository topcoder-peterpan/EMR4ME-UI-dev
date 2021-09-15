import React from 'react';
import { Modal, StyleSheet, View, Text } from 'react-native';
import { fonts, metrics, theme } from '../../constants';
import { Icon, Button } from 'react-native-elements';
import { i18n } from '../../util';

import DateTimePicker from './date-time-picker';


export default (props) => {
  const {
    modalVisible,
    headerTitle,
    onClose,
    minDate,
    maxDate,
    selectedMinDate,
    selectedMaxDate,
    setSelectedMinDate,
    setSelectedMaxDate
  } = props;
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible || false} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.filterModalTitle}>
            <Text style={styles.filterText}>{headerTitle}</Text>
            <Icon type="ionicon" name="ios-close" size={35} onPress={onClose} containerStyle={styles.closeIcon} />
          </View>
          <View style={styles.filterChecksContainer}>
            <View style={styles.filterRow}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelText}>From</Text>
              </View>
              <View style={styles.picker}>
                <DateTimePicker label={i18n.t('common.minDate')} value={selectedMinDate} setValue={setSelectedMinDate} maxDate={maxDate} minDate={minDate} />
              </View>
            </View>
            <View style={styles.filterRow}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelText}>To</Text>
              </View>
              <View style={styles.picker}>
                <DateTimePicker label={i18n.t('common.maxDate')} value={selectedMaxDate} setValue={setSelectedMaxDate} maxDate={maxDate} minDate={minDate} />
              </View>
            </View>
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
                onClose();
              }}
            />
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
    paddingTop: 10,
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
  filterRow: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between"
  },
  filterTextStyles: {
    flexWrap: 'wrap',
    fontSize: 13,
    paddingRight: 8,
    lineHeight: 18,
  },
  filterModalTitle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontFamily: fonts.MontserratBold,
    color: theme.colors.primary,
    fontSize: 20,
  },
  filterChecksContainer: {
    height: 20 * metrics.vh,
    flexDirection: 'column',
    marginTop: 10,
  },
  closeIcon: {
    position: "absolute",
    top: -5,
    right: 0,
    zIndex: 2,
    padding: 3,
  },
  labelContainer: {
    width: "12%"
  },
  picker: {
    width: "88%"
  },
  labelText: {
    fontFamily: fonts.MontserratBold,
    color: theme.colors.secondary
  }
})