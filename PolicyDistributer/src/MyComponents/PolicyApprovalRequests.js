import React from 'react'
import { PolicyApprovalRequestItem } from './PolicyApprovalRequestItem'

export const PolicyApprovalRequests = (props) => {

  let myStyle = {
    minHeight: "75vh",
    maxWidth: "150vh",
    margin: "40px auto"
  }
  return (
    <div className='container custom-container' style={myStyle}>
      <h3 className='my-3'> Policies Approval Requests</h3>
      {(JSON.parse(localStorage.getItem("User"))===null) ? "Please login first" : (props.policyApprovalRequests.length === 0) ? "No request to display" :
        props.policyApprovalRequests.map((policyApprovalRequest) => {
          return (
            <div key={policyApprovalRequest._id}>
              <PolicyApprovalRequestItem policyApprovalRequest={policyApprovalRequest} onPolicyApprove={props.onPolicyApprove} onPolicyReject={props.onPolicyReject} /> <hr />
            </div>
          );
        })
      }

    </div>
  )
}
