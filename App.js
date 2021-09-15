import React from 'react';
import { Provider } from 'react-redux';
import Application from './screens/Application';
import Store  from './store/configStore'

console.disableYellowBox = true

export default function App(props) {
  return (
    <Provider store={Store}>
      <Application {...props} />
    </Provider>
  );
}
