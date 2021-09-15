import moment from 'moment';
import store from '../store/configStore';
import { hideAlert, showAlert } from '../store/actions/creators/UI';
import { i18n } from '.';
import { getMyProvider } from '../store/actions/creators/user';


export const toDate = (date) => moment.utc(date).isValid() ? moment.utc(date).format('DD MMM YYYY') : date;
export const toDateText = (date) => moment.utc(date).isValid() ? moment.utc(date).format('DD MMM YYYY') : "";

export const getMinDate = (arr) => new Date(Math.min.apply(null, arr))
export const getMaxDate = (arr) => new Date(Math.max.apply(null, arr))

export const getMaxValue = (arr) => Math.max.apply(0, arr);
export const getMinValue = (arr) => Math.min.apply(0, arr);

export const mapFloat = (arr, prop, tofixed) =>{ 
    tofixed = tofixed || 2;
    return arr.map(el => {
        let value = parseFloat(el[prop].replace(/[\[\]&]+/g, '').trim());
        if(value && typeof(value)==='string')
            value = parseFloat(value).toFixed(tofixed);
        return value || 0
})
}
export const mapFloatElement = (value, toFixed) => value ? toFixed ? parseFloat(value.replace(/[\[\]&]+/g, '').trim()).toFixed(toFixed) : parseFloat(value.replace(/[\[\]&]+/g, '').trim()) : value

export const getMaxElementIndex = (arr) => {
    const maxValue = getMaxValue(arr);
    const maxIndex = arr.findIndex(value => value === maxValue)
    return maxIndex != -1 ? maxIndex : 0
}

export const inBetweenDates = (min, max, date) => {
    return moment.utc(min).isSameOrBefore(moment.utc(max),'days') && (moment.utc(date).isBetween(moment.utc(min), moment.utc(max), 'days') || moment.utc(date).isSame(moment.utc(min), 'days') || moment.utc(date).isSame(max, 'days'))
}

export const isOverlapped = (fromDate, toDate) => moment.utc(toDate).isBefore(fromDate);


export const getMinElementIndex = (arr) => {
    const maxValue = getMinValue(arr);
    const maxIndex = arr.findIndex(value => value === maxValue)
    return maxIndex != -1 ? maxIndex : 0
}


export const filterByDateRange = (min, max, prop, arr) => {
    if (arr && Array.isArray(arr) && prop && min && max)
        return arr.filter(o => {
            if (o && o[prop]) {
                const date = new Date(o[prop]);
                date.setHours(9);
                return inBetweenDates(min, max, date)
            }
            else
                return true;
        })
    return arr;
}

export const filterByValueRange = (min, max, prop, arr) => {
    if (arr && Array.isArray(arr) && prop && min && max) {
        const filteredData = arr.filter(o => {
            if (o && o[prop])
                return parseFloat(o[prop]) > min
                    && parseFloat(o[prop]) < max
            else
                return true;
        })

        return filteredData
    }
    return arr;
}


export const handleInternetConnection = (state) => {
    if (!state.isConnected)
        store.dispatch(showAlert({ msg: i18n.t('error.networkConnection'), type: 'error', present: false, iconName: 'warning' }))
    else
        store.dispatch(hideAlert())
}

export const _handleAppStateChange = (state) => state === 'active' ? store.dispatch(getMyProvider({})) : null;

export let openedWebViewConst = false;