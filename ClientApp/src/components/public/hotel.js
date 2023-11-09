import React, { Component } from "react";
import Nav from "../Nav";
import Services from "../../utils/services";
import { MdLocationOn } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { getAmmities } from "../Business/RegisterHotel";
import { AiFillCheckCircle } from "react-icons/ai";
import { GoPeople } from "react-icons/go";
import * as signalR from "@microsoft/signalr";
import { BsDot } from "react-icons/bs";
import esewaLogo from "../Static/img/esewa.jpg";

class CheckOutOptions extends Component {
  constructor(props) {
    super(props);
    this.utils = new Services();
  }
  state = {
    render: false,
    merchant: null,
  };

  componentDidMount = () => {
    const { parentState } = this.props;
    this.utils.isLoggedIn().then((x) => {
      const { statusCode } = x;
      if (statusCode === 200) {
        this.setState({ render: true });
      } else {
        window.location.href = `/login-user?call=see-content?id=${this.props.content}`;
      }
    });
    fetch(`hotel/get-client-transaction?HotelId=${parentState.hotel.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.utils.getToken(),
      },
      method: "get",
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode, value } = response;
        console.log(response);
        if (statusCode === 200) {
          this.setState({ merchant: value });
        }
      });
  };
  discountAmount = (price, discount) => {
    return price - ((discount / 100) * price + price - price);
  };

  esewaAPi = () => {
    var path = "https://uat.esewa.com.np/epay/main";
    const discount =
      this.props.parentState.selectedRoom.discount === null
        ? 0
        : this.props.parentState.selectedRoom.discount;
    const price = this.discountAmount(
      this.props.parentState.selectedRoom.price,
      discount
    );

    function post(path, params) {
      var form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", path);

      for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
      }
      document.body.appendChild(form);
      form.submit();
    }
    console.log(this.state.merchant)
    // fetch("transaction/esewa-balancesheet", {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + this.utils.getToken(),
    //   },
    //   method: "POST",
    //   body: JSON.stringify({
    //     amount: price,
    //     discount: discount,
    //     pid: this.props.parentState.selectedRoom.id + " " + this.utils.userId(),
    //     metchantKey: this.state.merchant.esewa.merchantKey,
    //     room: this.props.parentState.selectedRoom.id,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((response) => {
    //     const { statusCode, value } = response;
    //     console.log(response);
    //     if (statusCode === 200) {
    //       var params = {
    //         amt: price,
    //         psc: 0,
    //         pdc: 0,
    //         txAmt: 0,
    //         tAmt: price,
    //         pid:
    //           this.props.parentState.selectedRoom.id +
    //           " " +
    //           this.utils.userId(),
    //         scd: this.state.merchant.esewa.merchantKey,
    //         su:
    //           "https://localhost:44489/success-esewa?pid=" +
    //           this.props.parentState.selectedRoom.id +
    //           "&balanceSheetId=" +
    //           value,
    //         fu: "http://merchant.com.np/page/esewa_payment_failed",
    //       };
    //       post(path, params);
    //     } else {
    //       alert("Transaction couldn't happen try refreshing");
    //     }
    //   });
  };

  render() {
    const { parentState } = this.props;
    return (
      <div id="hotel-checkout-options">
        <div className="cross-dot">
          <div
            style={{ fontSize: "18px", marginLeft: "5px" }}
            onClick={() => {
              this.props.f("checkOutOptions", false);
            }}
          >x</div>
        </div>
        {this.state.render === true ? (
          <div>
            {parentState.selectedRoom == null ? (
              <>
                {" "}
                <h4>no room selected</h4> <br />
              </>
            ) : (
              <center>
                <h6>Payment options</h6> <br />
                <span className="side-label">
                  continue with esewa:{" "}
                  <div
                    onClick={this.esewaAPi}
                    style={{ width: "200px", height: "80px" }}
                  >
                    <img
                      style={{
                        backgroundImage: `url(${esewaLogo})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                      height="100%"
                      width="100%"
                    ></img>
                  </div>
                </span>
              </center>
            )}
          </div>
        ) : (
          <>
            <h4>Unauthorized</h4> <br />
            <a href={`/login-user?call=see-content?id=${this.props.content}`}>
              login
            </a>
          </>
        )}
      </div>
    );
  }
}

class PublicHotel extends Component {
  constructor(props) {
    super(props);
    this.utils = new Services();
    this.amenities = getAmmities();
    this.amenitiesActualAndHumanReadAbleKeyPair = [];
    for (let i = 0; i < this.amenities.length; i++) {
      const curr = this.amenities[i].split("_");
      const wordArray = [];
      for (let j = 0; j < curr.length; j++) {
        const make_small = curr[j].substring(0, 1);
        const re = curr[j].replace(make_small, make_small.toLowerCase());
        wordArray.push(re);
      }
      this.amenitiesActualAndHumanReadAbleKeyPair.push({
        key: this.amenities[i],
        value: wordArray.join(" "),
      });
      this.amenities[i] = wordArray.join(" ");
    }
    // this.connection = new signalR.HubConnectionBuilder()
    //   .withUrl("/reviewSocket")
    //   .build();
    //   this.connection
    //   .start()
    //   .then(() => {
    //     console.log("CONNECTED");
    //     this.setState({ socket: true });
    //     this.connection.on("ReceiveMessage", (user, message) => {
    //       console.log(user, message);
    //     });
    //   })
    //   .catch((err) => {
    //     return console.error(err.toString());
    //   });
    this.searchParams = new URLSearchParams(window.location.search);
  }
  setParentState = (name, value) => {
    this.setState({ [name]: value });
  };
  state = {
    adult: 0,
    children: 0,
    companyName: null,
    searchBlock: false,
    selectedRoom: null,
    socket: false,
    checkOutOptions: false,
  };
  componentDidMount = () => {
    fetch(`hotel/get-room-view?ids=${this.searchParams.get("id")}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { value, statusCode } = response;
        if (statusCode === 200) {
          this.setState({ room: value });
        }
      });
    fetch(`hotel/get-hotel-view?id=${this.searchParams.get("id")}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode !== 200) return;
        const { hotel, company } = value;
        this.setState({
          companyName: value.company.name,
          hotel: hotel,
          company: company,
          people: 0,
        });
      });

    const setBlock = () => {
      if (window.innerWidth >= 1352) {
        this.setState({ searchBlock: true });
      } else {
        this.setState({ searchBlock: false });
      }
    };
    window.addEventListener("resize", () => {
      setBlock();
    });
    setBlock();
  };
  selectRoom = (model) => {
    if (this.state.socket === true) {
      console.log("sent");
      this.connection
        .invoke("SendMessage", "user", "message")
        .catch(function (err) {
          return console.error(err.toString());
        });
    }
    this.setState({ selectedRoom: model });
  };

  discountAmount = (price, discount) => {
    return price - ((discount / 100) * price + price - price);
  };

  render() {
    const SearchForm = () => {
      return (
        <div className="p-3 mb-2 bg-light text-dark" id="search-list">
          <center>
            <h5>search</h5>
          </center>{" "}
          <hr />
          <form>
            <span className="side-label">Destination</span>
            <input
              placeholder="location/place"
              className="hotel-search form-control"
              required
            ></input>
            <span className="side-label">check in date</span>
            <input
              required
              type="date"
              className="hotel-search form-control"
            ></input>
            <span className="side-label">check out date</span>
            <input
              required
              type="date"
              className="hotel-search form-control"
            ></input>
            <div className="hotel-search-div">
              <span className="search-slide-text">
                adult {this.state.adult}
              </span>
              <span className="search-slide-text">
                children {this.state.children}
              </span>
            </div>
            <br></br>
            <input type="submit" className="btn btn-primary" value="search" />
          </form>
        </div>
      );
    };
    return this.state.hotel !== undefined ? (
      <div className="frameMain">
        <Nav detail={"b"} /> <br />
        {this.state.searchBlock === true ? <SearchForm /> : null}
        <div className="right-grild">
          <span style={{ color: "black" }}>
            <h2>{this.state.companyName ? this.state.companyName : null}</h2>
            <span className="side-label">
              <div>
                <MdLocationOn />{" "}
                {this.state.hotel ? this.state.hotel.location : null}
              </div>{" "}
            </span>
            <br />
          </span>{" "}
          <br />
          <div id="image-grid">
            <div className="image-1">
              {this.state.hotel && this.state.hotel.image_1 ? (
                <>
                  <img
                    height="100%"
                    width="100%"
                    src={"/images/" + this.state.hotel.image_1}
                    alt=":("
                  ></img>
                </>
              ) : null}
            </div>
            <div className="small-iamges">
              {this.state.hotel && this.state.hotel.image_2 ? (
                <>
                  <img
                    height="100%"
                    width="100%"
                    src={"/images/" + this.state.hotel.image_2}
                    alt=":("
                  ></img>
                </>
              ) : null}
            </div>
            <div className="small-iamges">
              {this.state.hotel && this.state.hotel.image_3 ? (
                <>
                  <img
                    height="100%"
                    width="100%"
                    src={"/images/" + this.state.hotel.image_3}
                    alt=":("
                  ></img>
                </>
              ) : null}
            </div>
            <div className="image-1">
              {this.state.hotel && this.state.hotel.image_4 ? (
                <>
                  <img
                    height="100%"
                    width="100%"
                    src={"/images/" + this.state.hotel.image_4}
                    alt=":("
                  ></img>
                </>
              ) : null}
            </div>
            <div className="small-iamges">
              {this.state.hotel && this.state.hotel.image_5 ? (
                <>
                  <img
                    height="100%"
                    width="100%"
                    src={"/images/" + this.state.hotel.image_5}
                    alt=":("
                  ></img>
                </>
              ) : null}
            </div>
            <div className="small-iamges more-blured">
              {this.state.hotel && this.state.hotel.image_6 ? (
                <div id="blur-plus">
                  <AiOutlinePlus id="plus-icon" />
                  <img
                    height="100%"
                    width="100%"
                    style={{ filter: "blur(1px)" }}
                    src={"/images/" + this.state.hotel.image_6}
                    alt=":("
                  ></img>
                </div>
              ) : null}
            </div>
          </div>{" "}
          <br></br>
          {this.state.searchBlock === false ? <SearchForm /> : null} <br />
          <span className="side-label">
            <b>Description</b>
          </span>{" "}
          <br />
          <div id="description" className="side-label">
            {this.state.hotel ? this.state.hotel.description : null}
          </div>
          <div>
            <span className="side-label">
              <b>Amenities</b>
            </span>{" "}
            <br />
            <div id="gird-hotel-options">
              {this.amenities.map((i, j) => {
                const getValue = this.state.hotel;
                if (getValue === undefined) return null;
                // get key of normalized value
                for (let k in this.amenitiesActualAndHumanReadAbleKeyPair) {
                  if (
                    this.amenitiesActualAndHumanReadAbleKeyPair[k].value === i
                  ) {
                    const key =
                      this.amenitiesActualAndHumanReadAbleKeyPair[
                        k
                      ].key.toLocaleLowerCase();
                    // search in state since casling convention wont match
                    for (let l in this.state.hotel) {
                      const c1 = l.toLocaleLowerCase();
                      if (c1 === key) {
                        if (this.state.hotel[l] === false) {
                          return null;
                        }
                      }
                    }
                  }
                }
                return (
                  <React.Fragment key={j}>
                    <div>
                      <span className="side-label">
                        {i}{" "}
                        <span className="checkicon">
                          <AiFillCheckCircle />
                        </span>
                      </span>{" "}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div>
            <span className="side-label">
              <b>Room options</b>
            </span>{" "}
            {this.state.room !== undefined
              ? this.state.room.map((i, j) => {
                  return (
                    <div key={j + "e"}>
                      <br />
                      <div className="room-options p-3 mb-2 bg-light text-dark">
                        <div className="room-option-content">
                          <h6>{i.type}</h6>
                          <hr></hr>
                          <span className="side-label">
                            room size {i.roomSize} sq.ft
                          </span>{" "}
                          <span className="side-label">
                            price RS{" "}
                            {i.discount !== 0 ? (
                              <b>
                                {" "}
                                <del>{i.price}</del>{" "}
                                {this.discountAmount(i.price, i.discount)}
                              </b>
                            ) : (
                              i.price
                            )}
                          </span>
                          {i.description !== null ? (
                            <span className="side-label">{i.description}</span>
                          ) : null}
                          <button
                            onClick={() => {
                              this.selectRoom(i);
                            }}
                            className="select-room-btn"
                          >
                            select
                          </button>
                        </div>
                        <div className="room-images">
                          <img
                            height="100%"
                            width="100%"
                            src={"images/" + i.roomImage}
                          ></img>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
          {""} <br />
          <div
            id="check-out-options-hotel"
            className="p-3 mb-2 bg-light text-dark"
          >
            <h5>check in now</h5>
            <hr></hr>
            {this.state.selectedRoom !== null ? <></> : null}
            <span className="">
              Price{" "}
              {this.state.selectedRoom === null ? (
                "room not selected"
              ) : (
                <b>
                  Rs:{" "}
                  {this.discountAmount(
                    this.state.selectedRoom.price,
                    this.state.selectedRoom.discount
                  )}
                </b>
              )}
              &nbsp;
              {this.state.selectedRoom !== null &&
              this.state.selectedRoom.discount !== 0 ? (
                <>
                  {" "}
                  <b>{this.state.selectedRoom.discount} </b> % off
                </>
              ) : null}
            </span>{" "}
            <hr />
            <span>
              type:{" "}
              {this.state.selectedRoom !== null ? (
                <b>{this.state.selectedRoom.type}</b>
              ) : (
                "room not selected"
              )}
            </span>{" "}
            <hr />
            <span>
              number of bed:{" "}
              {this.state.selectedRoom !== null ? (
                <b>{this.state.selectedRoom.numberOfBed}</b>
              ) : (
                "room not selected"
              )}
            </span>{" "}
            <hr />
            {this.state.checkOutOptions === true ? (
              <CheckOutOptions
                f={this.setParentState}
                parentState={this.state}
                content={this.searchParams.get("id")}
              />
            ) : null}
            <div>
              <button
                onClick={() => {
                  this.setState({ checkOutOptions: true });
                }}
                className="button-57"
                role="button"
              >
                <span className="text">Book now</span>
                <span>Book now</span>
              </button>
            </div>
          </div>
        </div>
        <hr />
      </div>
    ) : (
      <>
        <Nav />
      </>
    );
  }
}

export default PublicHotel;
