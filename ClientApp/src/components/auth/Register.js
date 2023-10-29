import React, { Component } from "react";
import "../Static/register.css";

class Register extends Component {
  state = {
    username: null,
    password: null,
    confrom_password: null,
    address: null,
    city: null,
    phone: null,
    email: null,
    err: null,
  };

  constructor(props) {
    super(props);
    this.makeReq = this.makeReq.bind(this);
  }

  updateState = (ev) => {
    let { name, value } = ev.target;
    if (name === "phone") {
      value = value.toString();
    }
    this.setState({ [name]: value });
  };

  makeReq = (ev) => {
    ev.preventDefault();
    fetch("auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => response.json())
      .then((data) => {
        const { statusCode } = data;
        if (statusCode !== 200) {
          const { value } = data;
          this.setState({ err: value });
          return;
        }
        if (statusCode === 200) {
          window.location.href = "/login-user"
        }
      })
  };

  closeAlertClick = (ev, j) => {
    let arr = [...this.state.err];
    arr = arr.filter(i => arr.indexOf(i) !== j);
    this.setState({err: arr});
  };

  render() {
    return (
      <div className="login-component">
        <center>
          <div id="register-frame">
            <br />
            {this.state.err
              ? this.state.err.map((i, j) => {
                  return (
                    <React.Fragment key={j}>
                      <div
                        className="alert alert-warning alert-dismissible fade show register-alerts"
                        role="alert"
                      >
                        <strong>Error!</strong> {i}
                        <button
                          type="button"
                          className="close"
                          data-dismiss="alert"
                          aria-label="Close"
                          onClick={(ev) => {this.closeAlertClick(ev, j)}}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                    </React.Fragment>
                  );
                })
              : null}
            <center>
              <h5>Register user</h5>
            </center>{" "}
            <br></br>
            <form onSubmit={this.makeReq}>
              <input
                onInput={this.updateState}
                autoComplete="off"
                name="username"
                className="form-control partial-input"
                placeholder="username"
                required={true}
              ></input>
              <input
                onInput={this.updateState}
                autoComplete="off"
                name="email"
                type="email"
                className="form-control partial-input"
                placeholder="email"
                required={true}
              ></input>
              <input
                onInput={this.updateState}
                autoComplete="off"
                name="city"
                className="form-control partial-input"
                placeholder="city"
                required={true}
              ></input>
              <input
                onInput={this.updateState}
                autoComplete="off"
                name="address"
                className="form-control partial-input"
                placeholder="address"
                required={true}
              ></input>
              <input
                onInput={this.updateState}
                placeholder="password"
                type="password"
                className="form-control input"
                name="password"
                required={true}
              ></input>
              <input
                onInput={this.updateState}
                placeholder="conform password"
                type="password"
                className="form-control input"
                name="confrom_password"
                required={true}
              ></input>
              <input
                onInput={this.updateState}
                placeholder="phone number"
                type="number"
                className="form-control input"
                name="phone"
                required={true}
              ></input>
              <input
                type="submit"
                value="submit"
                className="btn btn-outline-success form-control input"
              ></input>
            </form>
          </div>
        </center>
      </div>
    );
  }
}

export default Register;
