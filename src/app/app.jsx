import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/Main.jsx";
import Relay from "react-relay";


// class Hello extends React.Component {
//   render() {
//     return <h3>Hello testing ES6 JSX</h3>;
//   }
// }

class HomeRoute extends Relay.Route {
  static routeName = 'Home';
  static queries = {
    store: (Component) => Relay.QL`
      query MainQuery {
        store { ${Component.getFragment('store')} }
      }
    `
  }
}

ReactDOM.render(
  <Relay.RootContainer
    Component= {Main}
    route= {new HomeRoute()}
    />, document.getElementById('react'));

// console.log(
//   Relay.QL`
//     query Test {
//       links {
//         title
//       }
//     }
//   `
// );
