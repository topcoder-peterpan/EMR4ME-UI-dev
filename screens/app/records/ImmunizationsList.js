import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getAllImmunizations } from "../../../store/actions/creators/user";
import PageContainer from "../common/PageContainer";
import RecordList from "./common/DatatList";
import { Immunization } from "./common/types";
import { showNoDataScreen } from "./common/common";

const mapStateToProps = (state) => ({
  userData: state.user.userData,
  myProviders: state.user.myProviders,
});
export default connect(mapStateToProps)((props) => {
  const [immunizationsList, setImmunizationsList] = useState([]);
  const [isLinked, setIsLinked] = useState(true);
  const { userData, myProviders } = props;
  const [loaded, setLoaded] = useState(false);

  const getAllData = () => {
    getAllImmunizations({ sessionKey: userData.sessionKey }).then((data) => {
      setLoaded(true);
      setIsLinked(myProviders ? myProviders.length > 0 : true);
      if (data.payload.success) {
        setImmunizationsList(data.payload.payload);
      } else setImmunizationsList([]);
    });
  };
  useEffect(() => {
    getAllData();
  }, []);

  const noDataScreen = showNoDataScreen(
    immunizationsList,
    loaded,
    isLinked
  );

  return (
    <PageContainer>
      {noDataScreen === false ? (
        <RecordList
          data={immunizationsList}
          useListItem
          type={Immunization}
        />
      ) : (
        noDataScreen
      )}
    </PageContainer>
  );
});
