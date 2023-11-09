import React, { Component } from "react";
import Hotel from "./Hotel";
import "../Static/business/room.css";
import Services from "../../utils/services";

class RoomHotel extends Component {
  constructor(props) {
    super(props);
    this.utils = new Services();
  }
  state = {
    rooms: null,
  };
  update = (e) => {
    let { name, value, type } = e.target;
    if (type === "file") {
      value = e.target.files[0];
      this.setState({ src: URL.createObjectURL(e.target.files[0]) });
    }
    const val = type === "number" ? parseInt(value) : value;
    this.setState({ [name]: val });
  };

  componentDidMount = () => {
    fetch("hotel/get-rooms", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.utils.getToken(),
      },
      method: "get",
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { value } = response;
        this.setState({ rooms: value });
      });
  };

  createRoom = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const i in this.state) {
      formData.append(i, this.state[i]);
    };
    fetch("hotel/add-rooms", {
      headers: {
        Authorization: "Bearer " + this.utils.getToken(),
      },
      method: "post",
      body: formData,
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { value, statusCode } = response;
        if (statusCode === 200) {
          this.setState(
            (prv) => ({
              rooms: [...prv.rooms, value],
            }),
            () => {
              e.target.reset();
            }
          );
          if (this.state.src !== undefined) this.setState({ src: null });
        }
      });
  };

  deleteRoom = (id) => {
    fetch("hotel/delete-room?id=" + id, {
      headers: {
        Authorization: "Bearer " + this.utils.getToken(),
      },
      method: "get",
    }).then(rsp => rsp.json()).then((response) => {
      const {statusCode, value} = response;
      if (statusCode === 200) {
        const c = this.state.rooms;
        if (c !== undefined) {
          const filter = this.state.rooms.filter(x => x.id !== value.id);
          this.setState({rooms: filter});
        }
        if (value.count === 0) {
          window.location.reload();
        }
      }
    });
  }
  render() {
    return (
      <>
        <Hotel /> <br />
        <div id="form-wrapper-div">
          <form onSubmit={this.createRoom}>
            <div className="form-group room-option-form">
              <label htmlFor="exampleInputEmail1">room type</label>
              <input
                type="text"
                className="form-control"
                aria-describedby="room type"
                placeholder="eg deluxe.."
                required
                name="type"
                onInput={this.update}
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">room size</label>
              <input
                type="number"
                className="form-control"
                placeholder="eg 140sq feet"
                name="roomSize"
                onInput={this.update}
                required
                autoComplete="off"
              />
            </div>
            <small id="emailHelp" className="form-text text-muted">
              in square feet
            </small>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">room price</label>
              <input
                type="number"
                className="form-control"
                placeholder="eg  1400 per night"
                name="price"
                onInput={this.update}
                required
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">
                discounted price (%) <b>all VAT included</b>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="eg  10"
                name="discount"
                defaultValue={0}
                onInput={this.update}
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">
                Description (Optional)
              </label>
              <textarea
                className="form-control"
                placeholder="some small features in less than 30 words"
                name="description"
                onInput={this.update}
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">
                number of beds
              </label>
              <input
                className="form-control"
                placeholder="eg 2"
                name="NumberOfBed"
                onInput={this.update}
                autoComplete="off"
              />
            </div>
            <small id="emailHelp" className="form-text text-muted">
              leave empty if no discount
            </small>{" "}
            <br />
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">room image</label>
              <input
                type="file"
                className="form-control"
                name="roomImage"
                required
                onInput={this.update}
              />
            </div>{" "}
            <br />
            {this.state.src !== undefined ? (
              <div>
                <img className="previewImage" src={this.state.src}></img>
              </div>
            ) : null}{" "}
            <br />
            <button type="submit" className="btn btn-primary">
              Add room
            </button>
          </form>{" "}
          <hr />
          {this.state.rooms !== null ? (
            <>
              <div id="selectedRoomTable">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>SN</th>
                      <th>Type</th>
                      <th>Size</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Image</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                    {this.state.rooms.map((i, j) => {
                      return (
                        <React.Fragment key={j}>
                          <tr>
                            <th>{j}</th>
                            <th>{i.type}</th>
                            <th>{i.roomSize} sq.ft</th>
                            <th>{i.price}</th>
                            <th>{i.discount === null ? "No" : i.discount}</th>
                            <th>
                              <img
                                src={"/images/" + i.roomImage}
                                height="50"
                                width="50"
                              ></img>
                            </th>
                            <th>
                              <button className="btn btn-outline-primary">
                                edit
                              </button>
                            </th>
                            <th>
                              <button onClick={() => {this.deleteRoom(i.id)}} className="btn btn-outline-danger">
                                delete
                              </button>
                            </th>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </div>
      </>
    );
  }
}

export default RoomHotel;
