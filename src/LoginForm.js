import React, { Component } from 'react';

class LoginForm extends Component {

  state = {
    inputText: ''
  };

  onSubmit = (e) => {
    e.preventDefault();

    if (!this.state.inputText) {
      return;
    }

    this.props.onFormSubmit(this.state.inputText);
  }

  onChange = (e) => {
    this.setState({inputText: e.target.value});
  }

  render () {
    return (
      <form onSubmit={this.onSubmit} className="login-form">
        <h4>
          Please choose a username
        </h4>
        <div className="field">
          <label className="label">Username</label>
          <div className="control">
            <input onChange={this.onChange} value={this.state.inputText} className="input" type="text" placeholder="Type username" />
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-info">Submit</button>
          </div>
        </div>
      </form>
    );
  }
}

export default LoginForm;
