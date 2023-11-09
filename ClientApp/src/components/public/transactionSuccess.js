import React, { Component } from "react";
import Nav from "../Nav";
import Services from "../../utils/services";

class TransactionSuccess extends Component {
  state = {};
  constructor(props) {
    super(props);
    const searchParams = new URLSearchParams(window.location.search);
    const context = {
      balanceSheetId: searchParams.get("balanceSheetId"),
      amount: searchParams.get("amt")
    };
    this.utils = new Services();
    console.log(context);
    fetch("transaction/esewa-check", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.utils.getToken(),
      },
      method: "POST",
      body: JSON.stringify(context)
    }).then((rsp) => rsp.json()).then((response) => {
        console.log(response);
    })
  }
  render() {
    return (
      <div>
        <div>
          <Nav detail={"b"} /> <br />
        </div>
        <hr style={{ visibility: "hidden", height: "90px" }} />
        <center>
          <h5>success</h5>
        </center>
        <span className="side-label">
          Dear valued customer, Thank you for choosing our website for your
          booking needs. We are pleased to inform you that your booking has been
          successfully completed. We appreciate your trust in us and we will do
          our utmost to offer you the best possible experience. Should you have
          any questions or need further assistance, please don't hesitate to
          reach out. We're here to help! Thank you once again for choosing us.
          We look forward to serving you. Best regards, The engineering Team
        </span>
      </div>
    );
  }
}

export default TransactionSuccess;
