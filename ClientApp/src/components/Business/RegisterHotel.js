import React, { Component } from "react";
import "../Static/registerHotel.css";
import Services from "../../utils/services";

class RegisterHotel extends Component {
  constructor(props) {
    super(props);
    this.utils = new Services();
    this.amenities = [
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
    this.image_limit = 10;
    this.simpleState.bind(this);
  }
  state = {
    LicenseKey: "",
    location: "",
    checkOut: "",
    checkIn: "",
    description: "",
    err: "",
  };

  simpleState = (name, value) => {
    this.setState({ [name]: value });
  };
  componentDidMount = () => {
    for (let i = 0; i < this.amenities.length; i++) {
      const name = this.amenities[i];
      this.setState({ [name]: false }); // initial state false
    }
  };
  updateState = (ev) => {
    let { name, value, type } = ev.target;
    if (type === "checkbox") {
      if (value === "off") {
        value = false;
      } else {
        value = true;
      }
    }
    if (type === "file") {
      value = ev.target.files[0];
    }
    this.setState({ [name]: value });
  };
  submitForm = (ev) => {
    ev.preventDefault();
    const formData = new FormData();
    for (const i in this.state) {
      formData.append(i, this.state[i]);
    }
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
          console.log(value);
          localStorage.setItem("authToken", value);
          window.location.href = "/";
        } else {
          const { value } = response;
          this.setState({ err: value }, () => {
            console.log(this.state.err);
          });
        }
      });
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
        if (this.props.update === true) {
          preview = this.props.value["image_" + i];
          if (preview === ""){
            preview = undefined;
          }else {
            preview = "/images/" + preview;
          }
        }
        input.push(
          <React.Fragment key={i}>
            <label className="file-input">
              Image {i}
              <input
                name={"image_" + i}
                style={{display: preview === undefined ? "block" : "none"}}
                className="form-control"
                type="file"
                onInput={(e) => {
                  handleImageChange(e);
                }}
              ></input>
              {preview !== undefined   ? (
                <img
                  id={"image_" + i}
                  className="imgPreviwe"
                  src={preview !== undefined ? preview : null}
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
    return (
      <div
        id="register-hotel"
        style={
          this.props.update === true
            ? { backgroundImage: "none", position: "relative", float: "left" }
            : {}
        }
      >
        <center>
          <div id="hotel-register-frame">
            <form onSubmit={this.submitForm}>
              {this.props.update === true ? null : (
                <>
                  <span className="side-label">
                    Company license key (Contact us for the key)
                  </span>
                  <input
                    placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                    className="input form-control"
                    name="LicenseKey"
                    onInput={this.updateState}
                    autoComplete="off"
                    required
                  ></input>
                </>
              )}
              <span className="side-label">
                Your hotel location information (Required)
              </span>
              <input
                placeholder="location in words"
                className="input form-control"
                name="location"
                onInput={this.updateState}
                required
                defaultValue={
                  this.props.update === true ? this.props.value.location : ""
                }
              ></input>
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
                className="form-control input"
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
                className="form-control datetime input"
                type="time"
                onInput={this.updateState}
                required
                defaultValue={
                  this.props.update === true ? this.props.value.checkIn : ""
                }
              ></input>
              <span className="side-label">Check out time (Required)</span>
              <input
                name="checkOut"
                className="form-control datetime input"
                type="time"
                onInput={this.updateState}
                defaultValue={
                  this.props.update === true ? this.props.value.checkOut : ""
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
              <input type="submit" className="btn btn-primary input" />
            </form>
          </div>
        </center>
      </div>
    );
  }
}

export default RegisterHotel;
