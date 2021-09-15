import { CLEAR_SIGN_UP, SIGN_IN, SIGN_OUT, RESTORE_TOKEN, GET_PROVIDERS, UPDATEUSERDATA, CLEAR_PROVIDERS, UPDATE_PROVIDERS, GET_MY_PROVIDERS, GET_PROVIDERS_STARTED, SET_REMINDER_NAVIGATED } from "../actions/creators/actions";

const initState = {
  isLoading: false,
  isSignout: false,
  userToken: null,
  userData: {},
  providers: [],
  myProviders: [],
  isSignUp: false,
  providersLoaded: false,
  reminderNavigated: false
};
export default (state = initState, action) => {
  const { type } = action;
  switch (type) {
    case RESTORE_TOKEN:
      return {
        ...state,
        userToken: action.payload.accessToken,
        isLoading: false,
        userData: action.payload
      };
    case UPDATEUSERDATA:
      return {
        ...state,
        userData: { ...action.payload }
      }
    case UPDATE_PROVIDERS:
      let newProviderIndex = state.providers.findIndex(x => x.providerId === action.id);
      if (newProviderIndex > -1) {
        state.providers[newProviderIndex].lastSynchDate = true;
      }
      return {
        ...state,
        providers: Array.from(state.providers),
        myProviders: state.myProviders.concat(action.id)
      }
    case CLEAR_PROVIDERS:
      return {
        ...state,
        providersLoaded: false,
        providers: []
      }
    case GET_PROVIDERS_STARTED:
      return {
        ...state,
      }
    case GET_PROVIDERS:
      return {
        ...state,
        providers: state.providers.concat(Array.from(action.payload && action.payload.payload && Array.isArray(action.payload.payload) && action.payload.payload.length > 0 ? action.payload.payload : [])),
        isLoading: false,
        providersLoaded: true,
      }
    case GET_MY_PROVIDERS:
      return {
        ...state,
        myProviders: action.payload ? Array.from(action.payload) : null,
        isLoading: false,
      }
    case SIGN_IN:
      return {
        ...state,
        isSignout: false,
        userToken: action.payload.payload.accessToken,
        userData: action.payload.payload,
        isSignUp: action.signup,
      };
    case CLEAR_SIGN_UP:
      return {
        ...state,
        isSignUp: false
      };

    case SIGN_OUT:
      return {
        ...state,
        isSignUp: false,
        isSignout: true,
        userToken: false,
        userData: {},
      };
    case SET_REMINDER_NAVIGATED:
      return {
        ...state,
        reminderNavigated: action.payload,
      };
    default:
      return state;
  }
};
