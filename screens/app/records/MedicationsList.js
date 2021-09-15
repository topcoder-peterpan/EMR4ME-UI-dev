import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getAllMedications } from "../../../store/actions/creators/user";
import PageContainer from "../common/PageContainer";
import RecordList from "./common/DatatList";
import { DataContext } from "../../../components/common/DataContext";
import { theme } from "../../../constants";
import { medication } from "./common/types";
import { showNoDataScreen } from "./common/common";

const mapStateToProps = (state) => ({
  userData: state.user.userData,
  myProviders: state.user.myProviders,
});
export default connect(mapStateToProps)((props) => {
  const [medicationsList, setMedicationsList] = useState([]);
  const [isLinked, setIsLinked] = useState(true);
  const { userData, myProviders } = props;
  const [loaded, setLoaded] = useState(false);

  const getAllData = () => {
    getAllMedications({ sessionKey: userData.sessionKey }).then((data) => {
      setLoaded(true);
      setIsLinked(myProviders ? myProviders.length > 0 : true);
      if (data.payload.success) {
        setMedicationsList(data.payload.payload);
      } else setMedicationsList([]);
    });
  };

  useEffect(() => {
    getAllData();
  }, []);

  const dataContext = {
    opacity: 0.85,
    headerProp: "name",
    contentProp: "instructions",
    themeColor: theme.colors.error,
  };

  const noDataScreen = showNoDataScreen(
    medicationsList,
    loaded,
    isLinked
  );

  return (
    <PageContainer>
      <DataContext.Provider value={dataContext}>
        {noDataScreen === false ? (
          <RecordList data={medicationsList} type={medication} />
        ) : (
          noDataScreen
        )}
      </DataContext.Provider>
    </PageContainer>
  );
});
