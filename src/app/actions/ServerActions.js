import AppDispatcher from "../dispatcher/AppDispatcher";
import {ActionTypes} from "../constants/Constants";

let ServerActions = {
  receiveLinks(links) {
    console.log("in server action");
    AppDispatcher.dispatch({
      actionType: ActionTypes.RECEIVE_LINKS,
      links
    });
  }
};

export default ServerActions;
