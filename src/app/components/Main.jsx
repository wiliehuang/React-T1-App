import React from "react";
import API from "../API.jsx";
import LinkStore from "../stores/LinkStore";

let _getAppState = ()=> {
  return { links: LinkStore.getAll() };
};

class Main extends React.Component {

  static propTypes = {
    limit: React.PropTypes.number
  }

  static defaultProps = {
    limit: 4
  }

  state = _getAppState();

  // constructor(props){
  //   super(props);
  //   this.state = _getAppState();
  //   this.onChange = this.onChange.bind(this);
  // }
  // not needed if stage-0 is used

  componentDidMount() {
    API.fetchLinks();
    LinkStore.on("change", this.onChange);
  }
  componentWillUnmount() {
    LinkStore.removeListener("change", this.onChange);
  }
  // onChange() {
  //   console.log("view change from store")
  //   this.setState(_getAppState());
  // }
  //replaced with below for stage-0 JS
  onChange = () => {
    this.setState(_getAppState());
  }

  render() {
    let content = this.state.links.splice(0, this.props.limit).map(link => {
      return <li key={link._id}>
                <a href={link.url}>{link.title}</a>
                </li>;
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

export default Main;
