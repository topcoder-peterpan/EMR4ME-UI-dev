import React from "react";
import { AuthContext } from "../../components/auth/AuthContext";
import { i18n } from "../../util";
import { LegalNoticeEn, LegalNoticeEs } from "../../constants/policy";
import LegacyTmeplate from "../../components/common/Legacy/LegacyTmeplate";
import { useDispatch } from "react-redux";
import { blockPage } from "../../store/actions/creators/UI";

export default (props) => {
  const dispatch = useDispatch();
  const { signUp } = React.useContext(AuthContext);

  return (
    <LegacyTmeplate
      title={i18n.t("user.endUserAgreement")}
      agreeClickHandler={() => {
        dispatch(blockPage());
        signUp(props.route.params);
      }}
      signature
    >
      {i18n.isEn() ? <LegalNoticeEn /> : <LegalNoticeEs />}
    </LegacyTmeplate>
  );
};
