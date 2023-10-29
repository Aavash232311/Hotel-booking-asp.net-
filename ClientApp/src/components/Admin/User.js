import React, { Component, useId } from "react";
import "../Static/user.css";

class User extends Component {
  state = {
    roles: null,
    userRoles: null,
    user: null,
    searchQuery: null,
    initialStateCopy: null,
  };
  componentDidMount = () => {
    fetch("/admin/default-user", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { value } = response;
        const requiredRenderingCredentials = {
          roles: value.allPossibleRoles,
          user: value.users,
          userRoles: value.role,
        };
        this.setState(requiredRenderingCredentials);
        this.setState({ initialStateCopy: requiredRenderingCredentials });
      });
  };

  subStringLargeId = (id) => {
    if (id.length < 10) return id;
    return id.substring(0, 5) + "...";
  };

  humanReadAbleDate = (date) => {
    const originalDate = new Date(date);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      originalDate
    );
    return formattedDate;
  };

  correspondingRole = (userId) => {
    const { roles, userRoles } = this.state;
    const roleId = userRoles.find((x) => x.userId === userId).roleId;
    return roles.find((x) => x.id === roleId).name;
  };

  insertState = (ev) => {
    const { value } = ev.target;
    if (value === "") {
      this.setState(this.state.initialStateCopy);
      this.setState({ initialStateCopy: this.state.initialStateCopy });
    }
    this.setState({ [ev.target.name]: value });
  };

  searchByUsername = () => {
    if (this.state.searchQuery === "") return;
    fetch("admin/user-search?Query=" + this.state.searchQuery, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { value } = response;
        this.setState({
          roles: value.allPossibleRoles,
          user: value.users,
          userRoles: value.role,
        });
      });
  };

  DeleteUserFromState = (userId) => {
    const { user } = this.state;
    const { userRoles } = this.state;
    const newUser = user.filter((x) => x.id !== userId);
    const newUserRole = userRoles.filter((x) => x.userId !== userId);
    this.setState({
      user: newUser,
      userRoles: newUserRole,
    });
  };

  deleteUser = (userId) => {
    let userInput = prompt("pless y to conform n to abort:");
    if (userInput === "n") return;
    if (userInput === "y") {
      fetch(`admin/user-delete?userId=${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "get",
      })
        .then((rsp) => rsp.json())
        .then((response) => {
          const { statusCode } = response;
          if (statusCode === 200) {
            alert("User successfully deleted");
            // delete from table
            this.DeleteUserFromState(userId);
          }
        });
    } else {
      return;
    }
  };

  render() {
    return (
      <div className="commonFrame">
        <div>
          <input
            id="searchUser"
            placeholder="search by name or email"
            className="form-control"
            onInput={this.insertState}
            name="searchQuery"
            autoComplete="off"
          />
          <button
            id="searchButton"
            className="btn btn-outline-primary"
            onClick={this.searchByUsername}
          >
            Search
          </button>
          <br />
          <center>
            <div id="sortFrame">
              {this.state.user != null && this.state.user.length > 0 ? (
                <div>
                  <table id="user-table" className="table table-striped">
                    <tbody>
                      <tr className="thead-dark">
                        <th>SN</th>
                        <th style={{ cursor: "pointer" }}>Id</th>
                        <th>username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Date joined</th>
                        <th>Privelage</th>
                        <th>Action</th>
                      </tr>
                      {this.state.user.map((i, j) => {
                        return (
                          <React.Fragment key={j}>
                            <tr>
                              <th>{j}</th>
                              <th id={i.id}>{this.subStringLargeId(i.id)}</th>
                              <th>{i.username}</th>
                              <th>{i.email}</th>
                              <th>{i.phone}</th>
                              <th>{i.address}</th>
                              <th>{i.city}</th>
                              <th>{this.humanReadAbleDate(i.dateJoined)}</th>
                              <th>{this.correspondingRole(i.id)}</th>
                              <th
                                onClick={() => {
                                  this.deleteUser(i.id);
                                }}
                              >
                                <button className="btn btn-outline-danger">
                                  Delete
                                </button>
                              </th>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </center>
        </div>
      </div>
    );
  }
}

export default User;
