import React from "react";
import { useSelector } from "react-redux";
import NoDataScreen from "../../../../components/common/NoData";
import { Doctor, Organization, RecordsHome } from "./types";

export const showNoDataScreen = (
  data,
  loaded,
  isLinked,
  filteredResultsTypes,
  isComingSoon
) => {
  const isLoading = useSelector((state) => state.UI.isLoading);

  const linkedWithNoData = isLinked && (!data || !data.length);

  const checkHasNoData = () => {
    return (
      (!isLinked || linkedWithNoData) &&
      (!filteredResultsTypes || !filteredResultsTypes.length)
    );
  };

  if (!loaded) return null;
  else if (!isLoading) {
    if (checkHasNoData())
      return <NoDataScreen notLinked={!isLinked} noData={linkedWithNoData} isComingSoon={isComingSoon} />;
    else if (data && data.length) return false;
  } else return null;
};

export const checkIfAnyRecordsSelected = (sharedRecords, type) => {
  for (const property in sharedRecords) {
    if (
      property !== "selectMode" &&
      property !== "editRecord" &&
      (property !== Doctor || type === Doctor) &&
      (property !== Organization || type === Organization) &&
      property !== RecordsHome &&
      sharedRecords[property].length &&
      (!type || property === type)
    )
      return true;
  }
  return false;
};

export const sortListDescendingByDate = (list, dateProp) => {
  return list.sort(
    (a, b) =>
      new Date(...b[dateProp].split("/").reverse()) -
      new Date(...a[dateProp].split("/").reverse())
  );
};

