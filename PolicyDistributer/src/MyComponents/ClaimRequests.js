import React from 'react'
import { ClaimRequestItem } from './ClaimRequestItem'

export const ClaimRequests = (props) => {
  let myStyle = {
    minHeight: "75vh",
    maxWidth: "150vh",
    margin: "40px auto"
  }
  return (
    <div className='container custom-container' style={myStyle}>
      {(JSON.parse(localStorage.getItem("User"))===null) ? "" : <h3 className='my-3'> Claim Requests</h3>}
      {(JSON.parse(localStorage.getItem("User"))===null) ? "Please login first" : (props.claimRequests.length === 0) ? "No request to display" :
        props.claimRequests.map((claimRequest) => {
          return (
            <div key={claimRequest._id}>
              <ClaimRequestItem claimRequest={claimRequest} onClaimApprove={props.onClaimApprove} onClaimReject={props.onClaimReject} /> <hr />
            </div>
          );
        })
      }

    </div>
  )
}
