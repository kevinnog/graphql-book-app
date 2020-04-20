import React, { Component } from "react";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import {
  getAuthorsQuery,
  addBookMutation,
  getBooksQuery,
} from "../queries/queries";
import swal from "sweetalert";

class AddBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      genre: "",
      authorId: "",
    };
  }

  displayAuthors() {
    var data = this.props.getAuthorsQuery;
    if (data.loading) {
      return <option disabled>Loading authors...</option>;
    } else {
      return data.authors.map((author) => {
        return (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        );
      });
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit(event) {
    event.preventDefault();

    let name = this.state.name;
    let genre = this.state.genre;
    let authorId = this.state.authorId;

    if (name !== "" && genre !== "" && authorId !== "") {
      this.props.addBookMutation({
        variables: {
          name: name,
          genre: genre,
          authorId: authorId,
        },
        refetchQueries: [{ query: getBooksQuery }],
      });
      let form = document.getElementById("add-book");
      form.reset();
      swal("Good job!", "Book sucessfully added", "success");
      this.setState({
        name: "",
        genre: "",
        authorId: "",
      });
    } else {
      return swal("Error", "Name/genre/author not informed!", "error");
    }
  }

  render() {
    return (
      <form id="add-book" onSubmit={this.handleSubmit.bind(this)}>
        <div className="field">
          <label>Book Name:</label>
          <input name="name" type="text" onChange={this.handleChange} />
        </div>

        <div className="field">
          <label>Genre:</label>
          <input name="genre" type="text" onChange={this.handleChange} />
        </div>

        <div className="field">
          <label>Author:</label>
          <select name="authorId" onChange={this.handleChange}>
            <option>Select Author</option>
            {this.displayAuthors()}
          </select>
        </div>

        <button>+</button>
      </form>
    );
  }
}

export default compose(
  graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
  graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);
