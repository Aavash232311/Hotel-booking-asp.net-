import React, { Component } from "react";
import "../Static/admin.css";
import "../Static/role.css";

class Role extends Component {
  state = {
    roles: null,
    roleName: null,
  };
  componentDidMount = () => {
    // render created user roles
    fetch("admin/user-roles", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { value } = response;
        this.setState({ roles: value });
      });
  };

  inputAssign = (ev) => {
    const {value} = ev.target;
    this.setState({[ev.target.name]: value});
  }

  createRole = () => {
    fetch(`admin/create-role?name=${this.state.roleName}`, {
        headers: {
            "Content-Type": "application/json",
          },
          method: "get"
    }).then(rsp => rsp.json()).then((reponse) => {
        const {statusCode} = reponse;
        if (statusCode === 200) {
          const {value} = reponse;
          this.setState((prv) => (
            {
              roles: [...prv.roles, value]
            }
          ), () => {
            
          })
        }
    }) 
  }
  render() {
    return (
      <div className="commonFrame">
        <div id="role-table-div">
          <input id="roles-seach" className="form-control" placeholder="search role"></input>
          <button id="role-search-button" className="btn btn-primary">search</button>
          <span className="side-label">Roles Table</span>
          <table id="role-table" className="table table-striped">
            <tbody>
              <tr>
                <th>id</th>
                <th>role name</th>
                <th>action</th>
              </tr>
              {this.state.roles
                ? this.state.roles.map((i, j) => {
                    return (
                      <React.Fragment key={j}>
                        <tr>
                          <th>{i.id}</th>
                          <th>{i.name}</th>
                          <th>
                            <button className="btn btn-outline-danger">
                              delete
                            </button>
                          </th>
                        </tr>
                      </React.Fragment>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
        <span className="side-label">Creating Custom Roles</span>
        <input autoComplete="off" onInput={this.inputAssign} name="roleName" id="roles-create" className="form-control" placeholder="create role"></input>
        <button onClick={this.createRole} className="btn btn-primary" id="role-create-button">Create</button>
      </div>
    );
  }
}

export default Role;
