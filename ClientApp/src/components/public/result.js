import React, { Component } from "react";
import Nav from "../Nav";
import "../Static/public/result.css";
import { CiLocationOn } from "react-icons/ci";
import { NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
class Results extends Component {
  componentDidMount = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("query") !== undefined) {
      this.getFromPages(this.state.pageSize);
    } else {
      fetch(`api/haversine?query=${searchParams.get("client")}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "get",
      })
        .then((rsp) => rsp.json())
        .then((response) => {
          const { statusCode, value } = response;
          if (statusCode !== 200) this.setState({ success: false });
          this.setState({ value: value });
        });
    }
  };
  getFromPages = async (pages) => {
    const request = await fetch(
      `api/query-based-seo?query=${this.state.query}&pageSize=${pages}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "get",
      }
    );
    const data = await request.json();
    const { value, statusCode } = data;
    if (statusCode === 200) {
      const { result } = value;
      const vector = this.state.pages;
      vector.x = 1;
      vector.y = value.pages;
      this.setState({ pages: vector });
      for (let i in result) {
        let newArr = [...this.state.locationFilter];
        if (!newArr.includes(i.location)) {
          this.setState((x) => ({
            locationFilter: [...x.locationFilter, result[i].location],
          }));
        }
      }
      this.setState({ value: result, valueCpy: result }, () => {});
    }
  };
  locationFilterClick = (ev) => {
    const { className } = ev.target;
    const elem = document.getElementsByClassName(className);
    for (let i = 0; i <= elem.length - 1; i++) {
      if (elem[i].id !== ev.target.id) {
        elem[i].checked = false;
      }
    }
    if (ev.target.id === "all") {
      this.setState({ value: this.state.valueCpy });
      return;
    }
    let dub = [...this.state.valueCpy];
    dub = dub.filter((x) => x.location === ev.target.id);
    this.setState({ value: dub });
  };

  constructor(props) {
    super(props);
    this.setParent.bind(this);
    this.searchParams = new URLSearchParams(window.location.search);
    this.state = {
      value: null,
      locationFilter: [],
      valueCpy: null,
      pages: { x: 1, y: null },
      range: 5,
      query: this.searchParams.get("query"),
      pageSize: this.searchParams.get("page"),
    };
  }

  setParent = (name, value) => {
    this.setState({ [name]: value });
  };
  render() {
    const PageBlock = (props) => {
      const temp = [];
      const range =
        this.state.pages.y > this.state.range
          ? this.state.range
          : this.state.pages.y;
      const previousRange = this.state.pages;
      const incDenc = (cd) => {
        if (cd == "-") {
          if (this.state.pages.x - 1 >= 1) {
            props.lambda("pages", {
              x: previousRange.x - 1,
              y: previousRange.y,
            });
            props.lambda("range", this.state.range - 1);
          }
        } else {
          if (this.state.pages.x + 5 <= this.state.pages.y) {
            props.lambda("pages", {
              x: previousRange.x + 1,
              y: previousRange.y,
            });
            props.lambda("range", this.state.range + 1);
          }
        }
      };
      temp[0] = (
        <li
          key="previous"
          onClick={() => {
            incDenc("-");
          }}
          className="bnt-css"
          style={{ display: this.state.pages.y > 5 ? "block" : "none" }}
        >
          <span className="btn-txt-align">
            {" "}
            <AiOutlineArrowLeft />{" "}
          </span>
        </li>
      );
      const getFromDesigredPage = (page) => {
        props.lambda("pageSize", page);
        this.getFromPages(page);
      }
      for (let i = this.state.pages.x; i <= range; i++) {
        temp.push(
          <li key={i * Math.sqrt(i, 2) + i + 2}  onClick={() => {getFromDesigredPage(i)}} className="bnt-css">
            <span style={{color: this.state.pageSize === i ? "orange": "white"}} className="btn-txt-align">{i}</span>
          </li>
        );
      }
      if (this.state.pages.y > 5) {
        temp.push(
          <li
            key="next"
            onClick={() => {
              incDenc("+");
            }}
            className="bnt-css"
          >
            <span className="btn-txt-align">
              {" "}
              <AiOutlineArrowRight />{" "}
            </span>
          </li>
        );
      }
      return (
        <div>
          <ul style={{ float: "left" }}>{temp}</ul>
        </div>
      );
    };
    return (
      <div className="frameMain" style={{ overflowX: "hidden" }}>
        <Nav detail={"b"} />
        <hr style={{ visibility: "hidden", height: "90px" }} />
        {this.state.success === false ? <>Something went wrong</> : null}
        <div className="p-3 mb-2 bg-light text-dark" id="filter">
          <center>
            <h6>Location</h6>
          </center>
          <hr />
          <div>
            <small>all</small>
            <input
              id="all"
              onClick={this.locationFilterClick}
              type="checkbox"
              defaultChecked={true}
              className="location-checkbox"
            ></input>
          </div>
          <hr />
          {this.state.locationFilter.length > 0
            ? this.state.locationFilter.map((i, j) => {
                return (
                  <React.Fragment key={j * 3 + 1}>
                    <div>
                      <small>{i}</small>
                      <input
                        id={i}
                        onClick={this.locationFilterClick}
                        type="checkbox"
                        className="location-checkbox"
                      ></input>
                    </div>
                    <hr />
                  </React.Fragment>
                );
              })
            : null}
        </div>
        <div id="hotel-grid">
          {this.state.value
            ? this.state.value.map((i, j) => {
                return (
                  <React.Fragment key={j}>
                    <NavItem>
                      <NavLink tag={Link} to={"/see-content?id=" + i.id}>
                        <div className="hotel-block room-options p-3 mb-2 bg-light text-dark">
                          <div className="theme">
                            <img
                              height="100%"
                              width="100%"
                              src={"/images/" + i.image_1}
                            ></img>
                          </div>
                          <span className="side-label">{i.name}</span> <br />
                          <span className="side-label">
                            {i.location} <CiLocationOn />
                          </span>{" "}
                          <br />
                          <div className="hotel-description">
                            {i.description}
                          </div>
                        </div>
                      </NavLink>
                    </NavItem>
                    {j === this.state.value.length - 1 ? (
                      <div
                        className="p-3 mb-2 bg-light text-dark"
                        id="next-page"
                      >
                        {this.state.pages !== null ? (
                          <PageBlock lambda={this.setParent} />
                        ) : null}
                      </div>
                    ) : null}
                  </React.Fragment>
                );
              })
            : null}
        </div>
      </div>
    );
  }
}

export default Results;
