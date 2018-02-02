import { FETCH_TOTP } from "../actions/types";

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_TOTP:
      return action.payload || false;
    default:
      return state;
  }
}
