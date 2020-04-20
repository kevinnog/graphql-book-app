import React, { Component } from "react";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { getAuthorsQuery, addAuthorMutation } from "../queries/queries";
import swal from "sweetalert";

class AddAuthor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      age: 0,
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit(event) {
    event.preventDefault();
    let name = this.state.name;
    let age = this.state.age;
    let int = parseInt(age);

    if (age !== 0 && name !== "") {
      this.props.addAuthorMutation({
        variables: {
          name: this.state.name,
          age: int,
        },
        refetchQueries: [{ query: getAuthorsQuery }],
      });
      let form = document.getElementById("add-author");
      form.reset();
      swal("Good job!", "Author sucessfully added", "success");
      this.setState({
        name: "",
        age: 0,
      });
    } else {
      return swal("Error", "Name or age not informed!", "error");
    }
  }

  render() {
    return (
      <form id="add-author" onSubmit={this.handleSubmit.bind(this)}>
        <div className="field">
          <label>Author Name:</label>
          <input name="name" type="text" onChange={this.handleChange} />
        </div>

        <div className="field">
          <label>Age:</label>
          <input name="age" type="number" onChange={this.handleChange} />
        </div>

        <button>+</button>
      </form>
    );
  }
}

export default compose(
  graphql(addAuthorMutation, { name: "addAuthorMutation" })
)(AddAuthor);
