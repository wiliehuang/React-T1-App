import React from "react";
import Relay from "react-relay";
// import API from "../API.jsx";
// import LinkStore from "../stores/LinkStore";
import Link from "./Link.jsx";

let _getAppState = ()=> {
  return { links: LinkStore.getAll() };
};

class Main extends React.Component {

  // initial prop limit
  // static propTypes = {
  //   limit: React.PropTypes.number
  // }
  //
  // static defaultProps = {
  //   limit: 4
  // }

  //state = _getAppState();

  // constructor(props){
  //   super(props);
  //   this.state = _getAppState();
  //   this.onChange = this.onChange.bind(this);
  // }
  // not needed if stage-0 is used

  // componentDidMount() {
  //   API.fetchLinks();
  //   LinkStore.on("change", this.onChange);
  // }
  // componentWillUnmount() {
  //   LinkStore.removeListener("change", this.onChange);
  // }
  // onChange() {
  //   console.log("view change from store")
  //   this.setState(_getAppState());
  // }
  //replaced with below for stage-0 JS
  // onChange = () => {
  //   this.setState(_getAppState());
  // }

  render() {
    let content = this.props.store.linkConnection.edges.map(edge => {
      return <Link key={edge.node.id} link={edge.node} />;
    });

    return (
      <div>
        <h3>Links</h3>
        <ul>
          {content}
        </ul>
      </div>
    );
  }
}

Main = Relay.createContainer(Main, {
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        linkConnection(first: 2) {
          edges {
            node {
              id,
              ${Link.getFragment('link')}
            }
          }
        }
      }
    `
  }
});

export default Main;
