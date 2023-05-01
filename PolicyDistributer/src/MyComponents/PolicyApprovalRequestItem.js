import React from 'react'

export const PolicyApprovalRequestItem = ({policyApprovalRequest, onPolicyApprove, onPolicyReject}) => {
  return (
    <div>
      <h6>Name of policy holder: {policyApprovalRequest.name}</h6>
      <h6>Name of policy: {policyApprovalRequest.policyName}</h6>
      {/* <h6>Address of policy holder: {policyApprovalRequest.Address}</h6> */}
      {/* <h6>contactInfo of policy holder: {policyApprovalRequest.contactInformation}</h6> */}
      {/* <h6>Terms & Conditions: {policyApprovalRequest.termsAndConditions}</h6> */}
      <h6> Premium : {policyApprovalRequest.premium}, Deductibles: {policyApprovalRequest.deductibles}</h6>
      <h6> Coverage Limit : {policyApprovalRequest.coverageLimit}, Coverage Period: {policyApprovalRequest.coveragePeriod}</h6>
      <div style={{ display: 'flex', alignItems: 'center' }}>
      <button className='btn btn-sm btn-success' onClick={()=>{onPolicyApprove(policyApprovalRequest)}}>Approve</button>
      <button className='btn btn-sm btn-danger' style={{ marginLeft: '10px' }} onClick={()=>{onPolicyReject(policyApprovalRequest)}}>Reject</button>
      </div>
    </div>
  )
}
