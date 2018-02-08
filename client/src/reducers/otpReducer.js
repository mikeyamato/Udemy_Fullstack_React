import { FETCH_OTP } from "../actions/types";

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_OTP:
      return action.payload || false;
    default:
      return state;
  }
}
