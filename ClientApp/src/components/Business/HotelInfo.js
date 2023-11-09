import React, { Component } from "react";
import Hotel from "./Hotel";
import Services from "../../utils/services";
import "../Static/business/info.css";
import { AiOutlineCopy } from "react-icons/ai";
import RegisterHotel from "./RegisterHotel";
import {AiOutlineLink} from "react-icons/ai"

class HotemInfo extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.utils = new Services();
    this.state = {
      hotel: null,
    };
  }
  componentDidMount = () => {
    fetch("hotel/get-hotel", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.utils.getToken(),
      },
      method: "get",
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { value } = response;
        this.setState({ hotel: value });
      });
  };

  render() {

    return (
      <div className="common-full-width-componenet">
        <div>
          <Hotel />
        </div>

        {this.state.hotel !== null ? (
          <div>
            <hr style={{ visibility: "hidden", height: "80px" }}></hr>
            <span className="side-label">admin registered info</span>
            <table className="table table-bordered info-table">
              <tbody>
                <tr>
                  <th>name</th>
                  <th>date joined</th>
                  <th>hotel rating</th>
                  <th>secret license key</th>
                  <th></th>
                  <th>link</th>
                </tr>
                <tr>
                  <th>{this.state.hotel.company.name}</th>
                  <th>{this.state.hotel.company.createdDate}</th>
                  <th>{this.state.hotel.company.rating} star</th>
                  <th>{this.state.hotel.company.companyId}</th>
                  <th>
                    <AiOutlineCopy
                      onClick={() => {
                        window.navigator.clipboard.writeText(
                          this.state.hotel.company.companyId
                        );
                        alert("copied!!");
                      }}
                      id="copy-icon"
                    />
                  </th>
                  <th>
                    <AiOutlineLink onClick={() => {window.location.href = "/see-content?id=" + this.state.hotel.hotel.id}} ></AiOutlineLink>
                  </th>
                </tr>
              </tbody>
            </table>
            <span className="side-label">hotel registered info</span>
            <div id="registerHotelFrame">
              <RegisterHotel update={true} value={this.state.hotel.hotel} />
            </div>
          </div>
        ) : (
          <>Something went wrong</>
        )}
      </div>
    );
  }
}

export default HotemInfo;
