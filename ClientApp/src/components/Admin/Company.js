import React, { Component } from "react";
import "../Static/company.css";

class EditCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CompanyName: this.props.details.name,
      CompanyDescription: this.props.details.description,
      CompanyContactNumber: this.props.details.companyContactNumber,
      CompanyRating: parseInt(this.props.details.rating),
      Id: this.props.details.id,
      success: false,
    };
    this.UpdateRequestSubmit = this.UpdateRequestSubmit.bind(this);
  }

  UpdateCompany = (ev) => {
    const { value, name } = ev.target;
    this.setState({ [name]: value });
  };

  UpdateRequestSubmit = () => {
    fetch("admin/edit-company", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(this.state),
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          this.setState({ success: true }, () => {
            // set updated value in original state
            this.props.update(this.state);
          });
        }
      });
  };

  render() {
    return (
      <>
        <span className="side-label">Company Name</span> <br />
        <input
          className="form-control company-input"
          name="CompanyName"
          defaultValue={this.props.details.name}
          onInput={this.UpdateCompany}
        />
        <span className="side-label">Comapny description</span> <br />
        <textarea
          className="form-control company-input"
          name="CompanyDescription"
          defaultValue={this.props.details.description}
          onInput={this.UpdateCompany}
        />
        <span className="side-label">Company contact number</span> <br />
        <input
          className="form-control company-input"
          type="input"
          name="CompanyContactNumber"
          defaultValue={this.props.details.companyContactNumber}
          onInput={this.UpdateCompany}
        />
        <span className="side-label">Company Rating</span> <br />
        <input
          className="form-control company-input"
          defaultValue={this.props.details.rating}
          onInput={this.UpdateCompany}
          name="CompanyRating"
        />
        {this.state.success === true ? (
          <>
            <div className="alert alert-success company-input" role="alert">
              The update was successful!
            </div>{" "}
            <br />
          </>
        ) : null}
        <button
          onClick={this.UpdateRequestSubmit}
          className="btn btn-outline-primary submission-btn"
        >
          Done
        </button>
      </>
    );
  }
}

class Company extends Component {
  state = {
    company: null,
    edit: false,
    editElement: null,
  };

  constructor(props) {
    super(props);
    this.UpdateFromChild = this.UpdateFromChild.bind(this);
  }

  UpdateFromChild = (obj) => {
    // sallow copy
    let company = [...this.state.company];
    // get the original
    for (let i = 0; i <= company.length; i++) {
      if (company[i].id === obj.Id) {
        company[i].companyContactNumber = obj.CompanyContactNumber; // update which can be updated
        company[i].name = obj.CompanyName;
        company[i].rating = parseInt(obj.CompanyRating);
        company[i].description = obj.CompanyDescription;
        break;
      }
    }
    this.setState({company: company})

  };

  getInitialValue = () => {
    fetch("admin/get-company?LastItem=null", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        this.setState({ company: response });
      });
  }

  componentDidMount = () => {
    this.getInitialValue();
  };

  humanReadAbleDate = (date) => {
    const originalDate = new Date(date);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      originalDate
    );
    return formattedDate;
  };

  mimimalDescription = (content) => {
    if (content.length > 5) return content.substring(0, 5) + "...";
    return content;
  };

  LoadMoreCompanyDetail = () => {
    const { company } = this.state;
    const lastElement = company[company.length - 1].createdDate;
    fetch(`admin/get-company?LastItem=${lastElement}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        console.log(response);
        for (let i in response) {
          this.setState((prv) => ({
            company: [...prv.company, response[parseInt(i)]],
          }));
        }
      });
  };

  EditFrame = (ev, id) => {
    const getElement = this.state.company.find((x) => x.id == id);
    this.setState({
      edit: true,
      editElement: getElement,
    });
  };

  UpdateCompany = (ev) => {
    const { value, name, type } = ev.target;
    if (name === "seo") {
      if (value === "") {
        this.getInitialValue();
      }
    }
    this.setState({ [name]: type === "number" ? parseInt(value) : value });
  };

  RegisterCompany = () => {
    fetch("admin/register-company", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        CompanyContactNumber: this.state.CompanyContactNumber,
        CompanyDescription: this.state.CompanyDescription,
        CompanyName: this.state.CompanyName,
        CompanyRating: this.state.CompanyRating
      })
    }).then((rsp) => rsp.json()).then((response) => {
      const {statusCode} = response;
      if (statusCode === 200) {
        const {value} = response;
        // prepoding in array (for the sake of notifing admin its added)
        let arr = [...this.state.company]
        arr.unshift(value);
        this.setState({company: arr});
      }
    })
  }

  SearchCompany = () => {
    const query = this.state.seo;
    fetch("admin/search-company?query=" + query, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get"
    }).then(rsp => rsp.json()).then((response) => {
      const {value, statusCode} = response;
      if (statusCode === 200) {
        this.setState({company: value.length === undefined ? [value]: value});
      }
    })
  }

  render() {
    return (
      <div className="commonFrame">
        <span className="side-label">Registered Company</span> <br />
        {this.state.edit ? (
          <div>
            <div className="edit-company-details">
              <EditCompany
                update={this.UpdateFromChild}
                details={this.state.editElement}
              />
              <button
                onClick={() => {
                  this.setState({ edit: false, editElement: null });
                }}
                className="btn btn-outline-danger submission-btn"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
        <input
          placeholder="search by name or company id"
          className="form-control"
          name="seo"
          autoComplete="off"
          id="company-search"
          onInput={this.UpdateCompany}
        />
        <button onClick={this.SearchCompany} id="company-search-button" className="btn btn-outline-primary">
          Search
        </button>
        <br />
        <div id="company-table">
          <table className="table table-hover">
            <tbody>
              <tr>
                <th>Id</th>
                <th>Company</th>
                <th>Description</th>
                <th>Rating</th>
                <th>Company Contact number</th>
                <th>Comapny Unique/key Id</th>
                <th>Registration Date</th>
                <th>Action</th>
                <th>Edit</th>
              </tr>
              {this.state.company
                ? this.state.company.map((i, j) => {
                    return (
                      <React.Fragment key={j}>
                        <tr>
                          <th>{i.id}</th>
                          <th>{i.name} </th>
                          <th>{this.mimimalDescription(i.description)}</th>
                          <th>{i.rating}</th>
                          <th>{i.companyContactNumber}</th>
                          <th>{i.companyId}</th>
                          <th>{this.humanReadAbleDate(i.createdDate)}</th>
                          <th>
                            <button className="btn btn-outline-danger">
                              Delete
                            </button>
                          </th>
                          <th>
                            <button
                              onClick={(ev) => {
                                this.EditFrame(ev, i.id);
                              }}
                              className="btn btn-outline-primary"
                            >
                              Edit
                            </button>
                          </th>
                        </tr>
                      </React.Fragment>
                    );
                  })
                : null}
            </tbody>
          </table>
          <span
            onClick={this.LoadMoreCompanyDetail}
            className="side-label"
            id="load-more-btn"
          >
            Load more..
          </span>
        </div>
        <span className="side-label">New Registration</span> <br />
        <input
          className="registrationInput form-control"
          placeholder="Company name"
          name="CompanyName"
          onInput={this.UpdateCompany}
          autoComplete="off"
        ></input>
        <input
          className="registrationInput form-control"
          placeholder="Company description"
          name="CompanyDescription"
          onInput={this.UpdateCompany}
          autoComplete="off"
        ></input>
        <input
          className="registrationInput form-control"
          placeholder="Rating"
          type="number"
          name="CompanyRating"
          onInput={this.UpdateCompany}
          autoComplete="off"
        ></input>
        <input
          className="registrationInput form-control"
          placeholder="Company contact number"
          type="number"
          name="CompanyContactNumber"
          onInput={this.UpdateCompany}
          autoComplete="off"
        ></input>
        <button onClick={this.RegisterCompany} className="registrationInput btn btn-outline-success">
          Register
        </button>
      </div>
    );
  }
}

export default Company;
