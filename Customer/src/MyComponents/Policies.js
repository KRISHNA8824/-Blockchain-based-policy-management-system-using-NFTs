import React from 'react'
import { PolicyItem } from './PolicyItem'

export const Policies = (props) => {
  let myStyle = {
    minHeight: "75vh",
    maxWidth: "150vh",
    margin: "40px auto"
  }
  return (
    <div className='container custom-container' style={myStyle}>
      { (JSON.parse(localStorage.getItem("user"))===null) ? "" : <h3 className='my-3'> Policies List</h3> }
      {(JSON.parse(localStorage.getItem("user"))===null) ? "Please login first" : (props.policies.length === 0) ? "No policy to display" :
        props.policies.map((policy) => {
          return (
            <div key={policy._id}>
              <PolicyItem policy={policy} key={policy._id} onBuy={props.onBuy} /> <hr />
            </div>
          );
        })
      }

    </div>
  )
}
