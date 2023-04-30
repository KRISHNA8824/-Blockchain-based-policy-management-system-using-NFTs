import React from 'react'
import { MyPolicyItem } from './MyPolicyItem'

export const MyPolicies = (props) => {
  let myStyle = {
    minHeight: "75vh",
    maxWidth: "150vh",
    margin: "40px auto"
  }
  return (
    <div className='container custom-container' style={myStyle}>
      {(JSON.parse(localStorage.getItem("user"))===null) ? "" : <h3 className='my-3'> My Policies</h3>}
      {
        (JSON.parse(localStorage.getItem("user"))===null) ? "Please login first" : (props.myPolicies.length === 0) ? "No policy to display" :
        props.myPolicies.map((myPolicy) => {
          return( 
            <div key={myPolicy.tokenId}>
          <MyPolicyItem myPolicy={myPolicy} onClaim={props.onClaim} onPayPremium = { props.onPayPremium } /> <hr/>
          </div>
          );
        })
      }

    </div>
  )
}
