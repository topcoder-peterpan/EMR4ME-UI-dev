import React from "react";
import CircleSharedLinks from "./CircleSharedLinks";
import DoctorSharedLinks from "./DoctorSharedLinks";

export default (props) => {
  const { route } = props;
  const tabIndex = route.params && route.params.tabIndex;
  const isDocLink = route.params && route.params.docID && tabIndex !== 1;

  return isDocLink ? (
    <DoctorSharedLinks {...props} />
  ) : (
    <CircleSharedLinks {...props} />
  );
};
