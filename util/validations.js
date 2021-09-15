import i18n from "./i18n";

export default {
  input: (value, form, fieldName, candidate, callbk , arrayName) => {
    let formInput = null;
    if (arrayName && form[arrayName])
        formInput = form[arrayName][fieldName]
    else
        formInput = form[fieldName];
    formInput.value =  value;
    value = value && typeof (value) === 'string' ? value.trim() : value;
    formInput.touched = true;
    if (!value && formInput.validations && formInput.validations.filter(o => o.key === 'required').length === 0) {
      formInput.validations.forEach((element) => {
        element.valid = true;
      })
      formInput.errors = Array.from([]);
    }
    else
    formInput.validations.forEach((element) => {
      element.valid = element.rule(value , candidate ? form[candidate].value:undefined);
      const errorMsgExists = formInput.errors.findIndex(o => o.key == element.key) > -1;
      if (element.valid)
        errorMsgExists ? formInput.errors.splice(formInput.errors.findIndex(o => o.key == element.key), 1) : null;
      else  {
        switch (element.key) {
          case 'required':
            if (!errorMsgExists)
              formInput.errors.push({ key: element.key, value: i18n.t('error.required') })
            break;
          case 'alphaNumericEnglish':
            if (!errorMsgExists)
              formInput.errors.push({ key: element.key, value: i18n.t('error.alphaNumericEnglish') })
            break;
          case 'validPhone':
            if (!errorMsgExists)
              formInput.errors.push({ key: element.key, value: i18n.t('error.validPhone') })
            break;
          case 'validNumber':
            if (!errorMsgExists)
              formInput.errors.push({ key: element.key, value: i18n.t('error.validNumber') })
            break;
              case 'maxLength':
                if (!errorMsgExists)
                  formInput.errors.push({ key: element.key, value: i18n.t('error.maxLength') })
                break;
                case 'minLength':
                  if (!errorMsgExists)
                    formInput.errors.push({ key: element.key, value: i18n.t('error.minLength') })
                  break;
                
          case 'isEmail':
            if (!errorMsgExists)
              formInput.errors.push({key:element.key , value:i18n.t('error.isEmail')})
            break;
          case 'exactMatch':
            if (!errorMsgExists)
              formInput.errors.push({key:element.key , value:i18n.t('error.exactMatch') + candidate})
            break;
          case 'passwordRegex':
            if (!errorMsgExists)
              formInput.errors.push({key :element.key, value:i18n.t('error.alphaNumericEnglish')})
            break;
          case 'special':
            if (!errorMsgExists)
              formInput.errors.push({ key:element.key, value: i18n.t('error.special') })
            break;
          case 'digits':
            if (!errorMsgExists)
              formInput.errors.push({key:element.key , value:i18n.t('error.digits')})
            break;
          case 'uppercase':
            if (!errorMsgExists)
              formInput.errors.push({key:element.key , value:i18n.t('error.uppercase')})
            break;
          case 'lowercase':
            if (!errorMsgExists)
              formInput.errors.push({key:element.key , value:i18n.t('error.lowercase')})
            break;
          default:
            break;
        }

      }
    });
    formInput.valid = formInput.validations.every((o) => o.valid);
    if (callbk)
      callbk();
  },
  required: (value) => value,
  exactLength: (value, length) =>
    typeof value === "string" && value.length === length,
  minLength: (value, length) => typeof value === "string" && value.length >= length,
  maxLength: (value, length) => typeof value === "string" && value.length <= length,
  alphaNumericSpaceEnglish: (value) => value && /^[A-Za-z0-9 ]*$/.test(value),
  alphaNumericSpaceEnglishSpecial: (value) => value && /^[A-Za-z0-9 _@./#&+-,]*$/.test(value),
  alphaNumericSpaceEnglishDash: (value) => value && /^[A-Za-z0-9 -]*$/.test(value),
  alphaNumericEnglish: (value) => value && /^[A-Za-z0-9._-]{1,70}$/.test(value),
  alphaEnglish: (value) => value && /^[A-Za-z]*$/.test(value),
  alphaNumericWithoutNumberEnglish: (value) => value && /(^$)|^[A-Za-z ._-]*$/.test(value),
  lowercase: (value) => /[a-z]+/g.test(value),
  uppercase: (value) => /[A-Z]+/g.test(value),
  digits: (value) => /[\d]+/g.test(value),
  special: (value) => /[!@#$%^&*_]+/g.test(value),
  passwordRegex: (value) => /[A-Za-z\d!@#$%^&*_]*$/.test(value),
  validName: (value) => /^[A-Za-z \d-_\\()]*$/.test(value),
  isValidDate: (value) => value instanceof Date && !isNaN(value),
  isActualDate: (year, month, day) => {
    var d = new Date(year, month - 1, day);
    return (
      d.getFullYear() == year && d.getMonth() == month - 1 && d.getDate() == day
    );
  },
  isEmail: (value) => {
    let isEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return isEmail.test(value);
  },
  validNumber: (value) =>
    /^\d+$/i.test(value),
  match: (value, candidate) => value == candidate,
  exactMatch: (value, candidate) => value === candidate,
  validPhone: (value) => /^[+]?[0-9]{0,4}[-\s.]?[0-9]{0,1}[-\s.]?[(]?[0-9]{0,3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{3,6}$/.test(value),
  emailRE: value => /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(value)


};
