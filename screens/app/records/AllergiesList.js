import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { getAllAllergies } from "../../../store/actions/creators/user";
import { startLoading } from "../../../store/actions/creators/UI";
import PageContainer from "../common/PageContainer";
import RecordList from "./common/DatatList";
import { DataContext } from "../../../components/common/DataContext";
import { theme } from "../../../constants";
import { allergies } from "./common/types";
import { showNoDataScreen } from "./common/common";

const mapStateToProps = (state) => ({
  userData: state.user.userData,
  myProviders: state.user.myProviders,
});
export default connect(mapStateToProps)((props) => {
  const dispatch = useDispatch();
  const [allergiesList, setAllergiesList] = useState([]);
  const { userData, myProviders } = props;
  const [loaded, setLoaded] = useState(false);
  const [isLinked, setIsLinked] = useState(true);

  const getAllData = () => {
    getAllAllergies({ sessionKey: userData.sessionKey })
      .then((data) => {
        setLoaded(true);
        setIsLinked(myProviders ? myProviders.length > 0 : true);
        if (data.statusCode == 0) {
          setAllergiesList(data.payload.payload);
        } else setAllergiesList([]);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    dispatch(startLoading());
    getAllData();
  }, []);

  const dataContext = {
    opacity: 1,
    headerProp: "name",
    contentProp: "reaction_type",
    themeColor: theme.colors.primary,
  };

  const noDataScreen = showNoDataScreen(
    allergiesList,
    loaded,
    isLinked
  );

  return (
    <PageContainer>
      <DataContext.Provider value={dataContext}>
        {noDataScreen === false ? (
          <RecordList
            data={allergiesList}
            type={allergies}
          />
        ) : (
          noDataScreen
        )}
      </DataContext.Provider>
    </PageContainer>
  );
});
