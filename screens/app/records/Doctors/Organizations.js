import React from "react";
import {
  ThemeConsumer,
} from "react-native-elements";
import NoDataScreen from "../../../../components/common/NoData";
import { Organization } from "../common/types";
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
              data={data ? data.map(o => ({ ...o, id: o.organization_id, name: o.organization_name })) : []}
              useListItem
              type={Organization}
            />
          )
      )}
    </ThemeConsumer>
    : null
  )
};