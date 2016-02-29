import React from "react";
import Relay from "react-relay";
// import API from "../API.jsx";
// import LinkStore from "../stores/LinkStore";
import Link from "./Link.jsx";
import CreateLinkMutation from "../mutations/CreateLinkMutation";

// let _getAppState = ()=> {
//   return { links: LinkStore.getAll() };
// };

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

  setLimit = (e) => {
    let newLimit = Number(e.target.value);
    this.props.relay.setVariables({limit: newLimit});
  }
  handleSubmit = (e) => {
    e.preventDefault();
    Relay.Store.update(
      new CreateLinkMutation({
        title: this.refs.newTitle.value,
        url: this.refs.newUrl.value,
        store: this.props.store
      })
    );
    this.refs.newTitle.value = "";
    this.refs.newUrl.value = "";
  }

  render() {
    let content = this.props.store.linkConnection.edges.map(edge => {
      return <Link key={edge.node.id} link={edge.node} />;
    });

    return (
      <div>
        <h3>Links</h3>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Title" ref="newTitle" />
          <input type="text" placeholder="Url" ref="newUrl" />
          <button type="submit">Add</button>
        </form>
        Showing: &nbsp;
        <select onChange={this.setLimit}
                defaultValue={this.props.relay.variables.limit}>
          <option value="10">10</option>
          <option value="3">3</option>
        </select>
        <ul>
          {content}
        </ul>
      </div>
    );
  }
}

Main = Relay.createContainer(Main, {
initialVariables: {
  limit: 300
},
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id,
        linkConnection(first: $limit) {
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
