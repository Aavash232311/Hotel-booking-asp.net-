import React, { Component } from "react";
import Hotel from "./Hotel";
import "../Static/business/transaction.css";
import Services from "../../utils/services";

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.utils = new Services();
  }
  state = {
    MerchantKey: null,
  };

  componentDidMount = () => {
    fetch("hotel/merchant-code-esewa-get", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.utils.getToken(),
      },
    }).then(rsp => rsp.json()).then((response) => {
      const {statusCode, value} = response;
      if (statusCode === 200) {
        this.setState({MerchantKey: value.merchantKey});
      }
    })
  }

  uploadTransactionData = (ev) => {
    ev.preventDefault();
    fetch("hotel/esewa-get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.utils.getToken(),
      },
      body: JSON.stringify(this.state),
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode === 200) {
          alert("Merchant set");
        } else {
          ev.target.reset();
          alert("Something went wrong");
        }
      });
  };

  update = (ev) => {
    const {value, name} = ev.target;
    this.setState({[name]: value});
  }
  render() {
    return (
      <div
        className="common-full-width-componenet"
        style={{ backgroundColor: "white" }}
      >
        <div>
          <Hotel />
        </div>
        <hr style={{ visibility: "hidden", height: "60px" }}></hr>
        <center>
          <span className="side-label">
            Merchant transaction detail and information <b>Esewa</b>
          </span>
          <form onSubmit={this.uploadTransactionData}>
            <div className="form-group room-option-form">
              <label className="side-label">
                Esewa{" "}
                <b>
                  USE CORRECT KEY AS TRANSACTION CAN GO TO WRONG PERSON <br />{" "}
                  (We are not responsible for that case in every transaction
                  api)
                </b>
              </label>
              <input
                type="text"
                className="form-control norm-detail"
                aria-describedby="room type"
                placeholder="Merchant key"
                required
                name="MerchantKey"
                autoComplete="off"
                onInput={this.update}
                defaultValue={this.state.MerchantKey}
              />
              <label className="side-label"></label>
              <input
                type="submit"
                className="btn btn-outline-success norm-detail"
                value="submit"
              />
            </div>
          </form>
        </center>
      </div>
    );
  }
}

export default Transaction;
