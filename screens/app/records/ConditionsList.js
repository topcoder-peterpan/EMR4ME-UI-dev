import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getAllConditions } from "../../../store/actions/creators/user";
import PageContainer from "../common/PageContainer";
import RecordList from "./common/DatatList";
import { condition } from "./common/types";
import { showNoDataScreen } from "./common/common";

const mapStateToProps = (state) => ({
  userData: state.user.userData,
  myProviders: state.user.myProviders,
});
export default connect(mapStateToProps)((props) => {
  const [conditionsList, setConditionsList] = useState([]);
  const [isLinked, setIsLinked] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const { userData, myProviders } = props;
  const getAllData = () => {
    getAllConditions({ sessionKey: userData.sessionKey }).then((data) => {
      setLoaded(true);
      setIsLinked(myProviders ? myProviders.length > 0 : true);
      if (data.payload.success) {
        setConditionsList(data.payload.payload);
      } else setConditionsList([]);
    });
  };
  useEffect(() => {
    getAllData();
  }, []);

  const noDataScreen = showNoDataScreen(
    conditionsList,
    loaded,
    isLinked
  );

  return (
    <PageContainer>
      {noDataScreen === false ? (
        <RecordList data={conditionsList} useListItem={true} type={condition} />
      ) : (
        noDataScreen
      )}
    </PageContainer>
  );
});
