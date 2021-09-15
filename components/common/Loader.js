import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Modal, Keyboard } from "react-native";
import { connect } from "react-redux";
import { metrics } from '../../constants';
import AwesomeLoader from './awesome-Loader';

const mapStateToProps = (state) => ({
    isLoading: state.UI.isLoading,
    block: state.UI.block,
    showCustomLoader: state.UI.showCustomLoader
})
export default connect(mapStateToProps)(({ block, isLoading }) => {
    return block && isLoading && (
        <View style={{ position: 'absolute', backgroundColor: 'black', opacity: 0.7, width: 100 * metrics.vw, height: 100 * metrics.vh, justifyContent: 'center', alignItems: 'center' }}>
            <AwesomeLoader/>
        </View>
    )
})