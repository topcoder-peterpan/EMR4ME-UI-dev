import React from "react";
import { PolicyEN, PolicyES } from "../../constants/policy";
import { i18n } from "../../util";
import LegacyTmeplate from "../../components/common/Legacy/LegacyTmeplate";

export default (props) => {
  return (
    <LegacyTmeplate
      agreeClickHandler={() => {
        props.navigation.navigate("LegalNotice", props.route.params);
      }}
    >
      {i18n.isEn() ? <PolicyEN /> : <PolicyES />}
    </LegacyTmeplate>
  );
};
