import React, { Component } from "react";
import "../Static/registerHotel.css";
import Services from "../../utils/services";
import {ImCross} from "react-icons/im";

export function getAmmities() {
  const amenities = [
    "Toiletries",
    "Treats_at_Turndown",
    "Spa_like_Experience",
    "Pillow_Options",
    "Free_Breakfas",
    "Free_WiFi_Access",
    "In_Room_Coffee_and_Tea_Makers",
    "Anytime_Front_Desk_Service",
    "Gym_and_Fitness_Center",
    "Swimming_Pool_and_Hot_Tub",
    "Swimming_Pool",
    "Business_Center_with_Printing_and_Fax_Services",
    "Soundproofing",
    "Safe_Box",
    "Hair_Dryer",
    "Refrigerator_Mini_Bar",
    "Clean_Towels",
    "Slippers",
    "Ironing_Services",
    "Kettle",
  ];
  return amenities;
}

class RegisterHotel extends Component {
  constructor(props) {
    super(props);
    this.utils = new Services();
    this.amenities = getAmmities();
    this.image_limit = 10;
    this.simpleState.bind(this);
    this.mapRef = React.createRef();
    this.bingKey =
      ""; // get bing key from microsoft to use this function
    this.fameRef = React.createRef();
  }
  state = {
    LicenseKey: "",
    location: "",
    checkOut: "",
    checkIn: "",
    description: "",
    err: null,
    updateSuccess: null,
    position: null,
    results: [],
    name: ""
  };

  simpleState = (name, value) => {
    this.setState({ [name]: value });
  };

  loadMap = () => {
    const map = new window.Microsoft.Maps.Map(this.mapRef.current);
    if (this.props.update === true && this.props.value.position !== "") {
      const position = JSON.parse(this.props.value.position);
      const pin = new window.Microsoft.Maps.Pushpin(position);
      map.setView({
        center: new window.Microsoft.Maps.Location(
          position.latitude,
          position.longitude
        ),
        zoom: 50,
      });
      map.entities.push(pin);
    }
    window.Microsoft.Maps.Events.addHandler(map, "click", (e) => {
      // Get the clicked location
      const point = new window.Microsoft.Maps.Point(e.getX(), e.getY());
      const loc = e.target.tryPixelToLocation(point);
      // remove every other poj
      for (let i = map.entities.getLength() - 1; i >= 0; i--) {
        const pushpin = map.entities.get(i);
        if (pushpin instanceof window.Microsoft.Maps.Pushpin) {
          map.entities.removeAt(i);
        }
      }
      // Add a pushpin at the clicked location
      const pin = new window.Microsoft.Maps.Pushpin(loc);
      map.entities.push(pin);
      // Log the latitude and longitude of the clicked location
      this.setState({ position: JSON.stringify(loc) });
    });
  };

  componentDidMount = () => {
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.bing.com/api/maps/mapcontrol?callback=loadMap&key=${this.bingKey}`;
      script.async = true;
      script.defer = true;
      window.loadMap = this.loadMap;
      document.body.appendChild(script);
    });
    for (let i = 0; i < this.amenities.length; i++) {
      const name = this.amenities[i];
      this.setState({ [name]: false }); // initial state false
      if (this.props.update === true) {
        // lets get in through traditional method since in experinced me messed up with naming convention
        for (let j in this.props.value) {
          if (name.toLowerCase() === j.toLowerCase()) {
            this.setState({ [name]: this.props.value[j] }); // initallized
            break;
          }
        }
      }
    }
    if (this.props.update === true) {
      for (let i = 1; i < this.image_limit; i++) {
        this.setState({ ["image_" + i]: this.props.value["image_" + i] });
      }
    }
    if (this.props.update === true) {
      this.setState({ id: this.props.value["id"] });
      for (let i in this.props.value) {
        for (let j in this.state) {
          if (i.toLowerCase() === j.toLowerCase()) {
            this.setState({ [j]: this.props.value[i] });
            break;
          }
        }
      }
    }
  };
  recordUpdate = () => {
    const formData = new FormData();
    Object.entries(this.state).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    fetch("hotel/update-hotel", {
      headers: {
        Authorization: "Bearer " + this.utils.getToken(),
      },
      method: "POST",
      body: formData,
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          this.setState({ updateSuccess: true });
        } else {
          this.setState({ updateSuccess: false });
        }
      });
  };

  updateState = (ev) => {
    let { name, value, type, checked } = ev.target;
    if (type === "checkbox") {
      value = checked;
    }
    if (type === "file") {
      value = ev.target.files[0];
    }
    this.setState({ [name]: value }, () => {});

    // Debounce location API call to save my bank balance if I made it to producetion
    if (name === "location") {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => this.fetchResults(value), 1000);
    }
  };

  fetchResults = async (searchTerm) => {
    const url = `https://dev.virtualearth.net/REST/v1/Locations?query={${searchTerm}}&includeNeighborhood=true&include=true&maxResults=5&key=${this.bingKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const { resourceSets } = data;
    const { resources } = resourceSets[0];
    this.setState({ results: [] });
    console.log(resources);
    for (let i in resources) {
      const address = resources[i].address;
      let temp = [];
      for (let j in address) {
        temp.push(address[j]);
      }
      temp = temp.join(" ");
      this.setState(
        (prv) => ({
          results: [...prv.results, temp],
        }),
        () => {}
      );
    }
  };

  submitForm = (ev) => {
    ev.preventDefault();
    const formData = new FormData();
    for (const i in this.state) {
      formData.append(i, this.state[i]);
    }
    if (this.props.update === true) {
      this.recordUpdate();
      return;
    }
    try {
      fetch("hotel/register-hotel", {
        headers: {
          Authorization: "Bearer " + this.utils.getToken(),
        },
        method: "POST",
        body: formData,
      })
        .then((rsp) => rsp.json())
        .then((response) => {
          const { statusCode } = response;
          if (statusCode === 200) {
            const { value } = response;
            localStorage.setItem("authToken", value);
            window.location.href = "/";
          } else {
            const { value } = response;
            this.setState({ err: value }, () => {
              console.log(this.state.err);
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const ImageInput = (params) => {
      // pass the input name and value of image to parent compoenent
      const handleImageChange = (e) => {
        const { name } = e.target;
        params.call("img_" + name, URL.createObjectURL(e.target.files[0]));
        params.call(name, e.target.files[0]); // since the child is idenpended of parent
      };
      const input = [];
      for (let i = 1; i <= this.image_limit; i++) {
        let preview = params.render["img_" + "image_" + i];
        if (preview === undefined && this.props.update === true) {
          preview = this.props.value["image_" + i];
          if (preview === "") {
            preview = undefined;
          } else {
            preview = "/images/" + preview;
          }
        }
        input.push(
          <React.Fragment key={i}>
            <label className="file-input">
              Image {i}
              <input
                name={"image_" + i}
                style={{ display: preview === undefined ? "block" : "none" }}
                className="form-control input-r"
                type="file"
                onInput={(e) => {
                  handleImageChange(e);
                }}
              ></input>
              {preview !== undefined ? (
                <img
                  id={"image_" + i}
                  className="imgPreviwe"
                  src={preview === undefined ? "" : preview}
                  alt="Selected"
                />
              ) : null}
            </label>
          </React.Fragment>
        );
      }
      return <>{input}</>;
    };
    // never doing css like that again
    const timeObject = (time) => {
      return new Date("2005-12-19 " + time).toString().split(" ")[4];
    };
    return (
      <div
        id="register-hotel"
        style={
          this.props.update === true
            ? { backgroundImage: "none", position: "relative", float: "left" }
            : {}
        }
        ref={this.fameRef}
      >
        {this.state.updateSuccess === true ? (
          <div className="alert alert-success global-success" role="alert">
            Chages were made{" "}
            <span
              onClick={() => {
                this.setState({ updateSuccess: null });
              }}
              className="cancel-alert"
            >
              x
            </span>
          </div>
        ) : null}
        {this.state.updateSuccess === false ? (
          <div className="alert alert-danger global-success" role="alert">
            Changes was not saved!!{" "}
            <span
              onClick={() => {
                this.setState({ updateSuccess: null });
              }}
              className="cancel-alert"
            >
              x
            </span>
          </div>
        ) : null}
        <center>
          <div id="hotel-register-frame">
            <form onSubmit={this.submitForm}>
              {this.props.update === true ? null : (
                <>
                  <span className="side-label">
                    Company license key (Contact us for the key)
                  </span>
                  <input
                  type="text"
                    placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                    className="input-r form-control"
                    name="LicenseKey"
                    onInput={this.updateState}
                    autoComplete="off"
                    required
                  ></input>
                </>
              )}
               <span className="side-label">
                hotel name (Required)
              </span>
              <input
                  type="text"
                    placeholder="name of your hotel"
                    className="input-r form-control"
                    name="name"
                    onInput={this.updateState}
                    autoComplete="off"
                    required
                    defaultValue={
                      this.props.update === true
                        ? this.props.value.name
                        : ""
                    }
                  ></input>
              <span className="side-label">
                Your hotel location information (Required)
              </span>
              <div style={{ position: "relative" }}>
                <input
                  placeholder="location in words"
                  type="text"
                  className="input-r form-control"
                  name="location"
                  onInput={this.updateState}
                  autoComplete="off"
                  required
                  value={this.state.location}

                ></input>
                {this.state.results.length > 0 ? (
                  <div
                    className="p-3 mb-2 bg-light text-dark"
                    id="some-powerful-autocomplete"
                  >
                    <span onClick={() => {this.setState({results: []})}} style={{right: "5px", position: "absolute"}}><ImCross /></span>
                    {this.state.results.map((i, j) => {
                      return (
                        <React.Fragment key={j}>
                          <div>
                          <span  onClick={(ev) => {this.setState({location: ev.target.innerText, results: []})}} className="side-label">{i}</span> <hr />
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <span className="side-label">
                Your hotel location in map (Required) [For best accuracy and helps client to find nearby using Habersine formula]
              </span>
              <hr />
              <div
                id="map"
                className="input-r"
                style={{ width: "100%", height: "500px" }}
                ref={this.mapRef}
              />
              <span className="side-label">
                Amenities [Select avalible] (Optional)
              </span>
              <div id="amenities-input">
                {this.amenities.map((i, j) => {
                  // initilaziting default state
                  const underscoreToWords = (word) => {
                    return (word = word.split("_").join(" "));
                  };
                  let defaultValue = false;
                  for (const k in this.props.value) {
                    if (k.toLocaleLowerCase() === i.toLocaleLowerCase()) {
                      defaultValue = this.props.value[k];
                      break;
                    }
                  }
                  return (
                    <React.Fragment key={j}>
                      <div className="amenities-label">
                        <span className="amenities-label-name">
                          {underscoreToWords(i)}
                        </span>
                        <label className="switch">
                          <input
                            onInput={this.updateState}
                            name={i}
                            type="checkbox"
                            defaultChecked={defaultValue}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>{" "}
                      <br />
                    </React.Fragment>
                  );
                })}
              </div>
              <span className="side-label">Description (Required)</span>
              <textarea
                className="form-control input-r"
                placeholder="description"
                name="description"
                onInput={this.updateState}
                defaultValue={
                  this.props.update === true ? this.props.value.description : ""
                }
              />
              <span className="side-label">Check in time (Required)</span>
              <input
                name="checkIn"
                className="form-control datetime input-r"
                type="time"
                onInput={this.updateState}
                required
                defaultValue={
                  this.props.update === true
                    ? timeObject(this.props.value.checkIn)
                    : ""
                }
              ></input>
              <span className="side-label">Check out time (Required)</span>
              <input
                name="checkOut"
                className="form-control datetime input-r"
                type="time"
                onInput={this.updateState}
                defaultValue={
                  this.props.update === true
                    ? timeObject(this.props.value.checkOut)
                    : ""
                }
                required
              ></input>
              <span className="side-label">
                Hotel images (Required atleast one) for your own good production
                use high resulotion images{" "}
              </span>
              <ImageInput call={this.simpleState} render={this.state} />
              {this.state.err !== null ? (
                <>
                  <div className="alert alert-secondary input" role="alert">
                    {this.state.err.message}
                  </div>
                </>
              ) : null}
              <hr style={{ visibility: "hidden" }}></hr>
              <input
                type="submit"
                className="btn btn-primary input-btn input-r"
              />
            </form>
          </div>
        </center>
      </div>
    );
  }
}

export default RegisterHotel;
