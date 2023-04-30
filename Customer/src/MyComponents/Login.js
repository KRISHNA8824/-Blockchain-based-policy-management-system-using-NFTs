import React, { useState } from 'react';

export const Login = (props) => {

  let myStyle = {
    minHeight: "73vh",
    maxWidth: "60vh",
    margin: "40px auto"
  }

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Name or Description cannot be blank");
    }
    else {
      props.loginUser(email, password);
      setEmail("");
      setPassword("");
    }
  }
  return (
    <div className="container custom-container" style={myStyle}>
      <h3 className='text-center my-3'>Login</h3>
      <form onSubmit={submit}>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} className="form-control" id="email" aria-describedby="emailHelp" />
          {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} className="form-control" id="password" />
        </div>

        <div className="mb-3 d-flex justify-content-center">
          <button type="submit" className="btn btn-sm btn-success w-100">Submit</button>
        </div>

        <div className="d-flex justify-content-center mb-3">
          <p>Don't have an account <button type="button" className="btn btn-link" onClick={props.onRegisterClick}>Register</button></p>
        </div>

      </form>
    </div>
  )
}
