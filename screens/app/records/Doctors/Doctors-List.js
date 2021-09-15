import React, { useState, useCallback, useEffect } from "react";
import {
  ThemeConsumer,
} from "react-native-elements";
import { listDoctors } from "../../../../store/actions/creators/doctors";
import NoDataScreen from "../../../../components/common/NoData";

import { Doctor } from "../common/types";
import RecordList from "../common/DatatList";

export default ({ data, loaded }) => {

  // const setDocs = useCallback(() => {

  // }, [])
  return (loaded ?
    <ThemeConsumer>
      {({ theme }) => (
        data.length === 0 ? <NoDataScreen noData /> :
          (
            <RecordList
              data={data ? data.map(o => ({ ...o, name: o.fname + ' ' + o.lname })) : []}
              useListItem
              type={Doctor}
            />
          )
      )}
    </ThemeConsumer>
    : null
  )
};