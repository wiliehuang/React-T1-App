import {get} from "jquery";
import ServerActions from "./actions/ServerActions";

let API= {
  fetchLinks() {
    console.log("test API fetch1");
    get("/data/links").done( (resp) => {
      ServerActions.receiveLinks(resp);
    });
  }
};

export default API;
