import React, { Component } from "react";
import "./Static/home.css";
import Nav from "./Nav";
import { BsFillPersonFill } from "react-icons/bs";
import { BsFillCalendarDateFill, BsCalendar2Date } from "react-icons/bs";
import { BiCurrentLocation } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { json } from "react-router-dom";
export class Home extends Component {
  static displayName = Home.name;
  constructor(props) {
    super(props);
    this.today = new Date();
    this.today.setDate(this.today.getDate() + 1);
    this.tmr = new Date();
    this.tmr.setDate(this.tmr.getDate() + 2);
    this.search = this.search.bind(this);
  }
  state = {
    adult: 1,
    room: 1,
    showBookingOption: false,
    showCheckInDate: false,
    checkin: this.today,
    checkout: this.tmr,
    invalid: false,
    invalidCheckIn: false,
    query: ""
  };
  componentDidMount = () => {
    let today = new Date();
    today.setDate(today.getDate() + 1);
    let tmr = new Date();
    tmr.setDate(tmr.getDate() + 2);
    this.setState({
      checkin: today.toISOString().slice(0, 10),
      checkout: tmr.toISOString().slice(0, 10),
    });
  };
  updateEvent = (ev) => {
    const { value, name, type } = ev.target;
    if (type === "date") {
      let checkOut = new Date(value);
      const checkIn = new Date(this.state.checkin);
      if (name === "checkout") {
        if (checkOut <= checkIn) {
          this.setState({ invalid: true }, () => {
            alert("invalid date");
          });
        } else {
          this.setState({ invalid: false });
        }
      } else if (name === "checkin") {
        const today = new Date(this.today.toISOString().slice(0, 10));
        let checkIn = checkOut;
        if (checkIn < today) {
          this.setState({invalidCheckIn: true});
            alert("INVALID CHECKIN");
        }else{
          this.setState({invalidCheckIn: false})
        }
      }
    }
    this.setState({ [name]: value });
  };

  changeCount = (name, action) => {
    if (name === "adult" && action !== "-" && this.state.adult >= 30) return;
    if (name === "adult" && action === "-" && this.state.adult - 1 < 1) return;
    if (name === "room" && action === "-" && this.state.room - 1 < 1) return;
    if (name === "room" && action !== "-" && this.state.room >= 30) return;
    this.setState({
      [name]: action === "+" ? this.state[name] + 1 : this.state[name] - 1,
    });
  };

  haversineRange() {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { coords } = pos;
      const { latitude, longitude } = coords;
      const vector = {
        latitude: latitude,
        longitude: longitude,
      };
      window.location.href = "/night-owl-me?client=" + JSON.stringify(vector);
    });
  }

  search() {
    if (this.state.invalid === false && this.state.invalidCheckIn === false) {
      window.location.href = `/night-owl-me?checkin=${this.state.checkin}&checkout=${this.state.checkout}&adult=${this.state.adult}&room=${this.state.room}&query=${this.state.query}&page=${1}`;
    }else{
      alert("INVLIAD DATE");
    }
  }

  render() {
    return (
      <div className="common-full-width-componenet">
        <div id="home-page-upper-frame">
          <Nav />
          <center>
            <div id="seacrh-content">
              <h1 id="site-title">Bespeaking Immerse In The Luxury</h1>
              <br />
              <div id="search-engene-frame">
                <div>
                  <input
                    type="text"
                    placeholder="search from location, name"
                    id="search-hotel"
                    name="query"
                    onInput={this.updateEvent}
                  ></input>
                </div>
                <div>
                  <div
                    id="roomContent"
                    onClick={(ev) => {
                      this.state.showBookingOption === true
                        ? this.setState({ showBookingOption: false })
                        : this.setState({
                            showBookingOption: true,
                            showCheckInDate: false,
                          });
                    }}
                  >
                    <BsFillPersonFill className="person-icon" />
                    <span className="person-icon-name sec">
                      adults {this.state.adult}
                    </span>
                    <span className="person-icon-name sec">
                      room {this.state.room}
                    </span>
                  </div>
                  {this.state.showBookingOption === true ? (
                    <div id="room-options-div">
                      <span className="stick-left">adult</span> <br />
                      <div className="stick-left">
                        <ul>
                          <li className="search-list">
                            <button
                              onClick={() => {
                                this.changeCount("adult", "+");
                              }}
                              className="btn btn-outline-primary"
                            >
                              +
                            </button>
                          </li>
                          <li className="search-list">
                            <span className="middle-content">
                              {this.state.adult}
                            </span>
                          </li>
                          <li className="search-list">
                            <button
                              onClick={() => {
                                this.changeCount("adult", "-");
                              }}
                              className="btn btn-outline-primary"
                            >
                              -
                            </button>
                          </li>
                        </ul>
                      </div>
                      <hr style={{ height: "50px", visibility: "hidden" }}></hr>
                      <span className="stick-left">room</span>
                      <div className="stick-left">
                        <ul>
                          <li className="search-list">
                            <button
                              onClick={() => {
                                this.changeCount("room", "+");
                              }}
                              className="btn btn-outline-primary"
                            >
                              +
                            </button>
                          </li>
                          <li className="search-list">
                            <span className="middle-content">
                              {this.state.room}
                            </span>
                          </li>
                          <li className="search-list">
                            <button
                              onClick={() => {
                                this.changeCount("room", "-");
                              }}
                              className="btn btn-outline-primary"
                            >
                              -
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div
                  id="checkInOut"
                  style={{
                    border:
                      this.state.invalid === true ? "2px solid red" : "none",
                  }}
                >
                  <div
                    onClick={() => {
                      if (this.state.showCheckInDate === true) {
                        this.setState({ showCheckInDate: false });
                      } else {
                        this.setState({
                          showCheckInDate: true,
                          showBookingOption: false,
                        });
                      }
                    }}
                  >
                    <div className="date-grid">
                      <BsFillCalendarDateFill />
                    </div>
                    <div className="date-grid sec">
                      <BsCalendar2Date />
                    </div>
                  </div>
                  {this.state.showCheckInDate === true ? (
                    <>
                      <div
                        style={{
                          border:
                            this.state.invalid === true
                              ? "2px solid red"
                              : "none",
                        }}
                        id="date-picker"
                      >
                        <span className="side-label">Check in date</span> <br />
                        <input
                          onChange={this.updateEvent}
                          name="checkin"
                          defaultValue={this.state.checkin}
                          type="date"
                          className="form-control"
                          style={{
                            border:
                              this.state.invalidCheckIn === true
                                ? "2px solid red"
                                : "none",
                          }}
                        ></input>
                        <span className="side-label">Check out date</span>{" "}
                        <br />
                        <input
                          onChange={this.updateEvent}
                          style={{
                            border:
                              this.state.invalid === true
                                ? "2px solid red"
                                : "none",
                          }}
                          name="checkout"
                          defaultValue={this.state.checkout}
                          type="date"
                          className="form-control"
                        ></input>
                      </div>
                    </>
                  ) : null}
                </div>
                <div id="near-me">
                  <BiCurrentLocation
                    onClick={this.haversineRange}
                    id="icon-near-me"
                  />
                </div>
                <div>
                  <button
                    onClick={this.search}
                    className="search-home-page-button"
                  >
                    <AiOutlineSearch />
                  </button>
                </div>
              </div>
            </div>
          </center>
        </div>
        <hr style={{ visibility: "hidden", height: "610px" }}></hr>
        <div id="mid-frame">
          <h1 id="markieting-1">Find Your Low Fare Luxuary Hotels</h1>
        </div>
      </div>
    );
  }
}
