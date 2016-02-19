import AppDispatcher from "../dispatcher/AppDispatcher";
import {ActionTypes} from "../constants/Constants";
import {EventEmitter} from "events";

let _links = [];

class LinkStore extends EventEmitter {
    constructor(props) {
      super(props);

      AppDispatcher.register(action => {
        switch(action.actionType) {
          case ActionTypes.RECEIVE_LINKS:
            console.log("registered storelink");
            _links = action.links;
            this.emit("change");
            break;
          default:
            //comment for no default action so far
        }
      });
    }

    getAll() {
      return _links;
    }
}

export default new LinkStore();
