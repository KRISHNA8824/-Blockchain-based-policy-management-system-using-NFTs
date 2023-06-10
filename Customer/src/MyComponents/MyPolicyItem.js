import React from 'react'

export const MyPolicyItem = ({myPolicy, onClaim, onPayPremium}) => {
  return (
    <div>
      <h6>Name of policy: {myPolicy.policyName}</h6>
      <h6>Terms & Conditions: {myPolicy.termsAndConditions}</h6>
      <h6> Premium : {myPolicy.premium}, Deductibles: {myPolicy.deductibles}</h6>
      <h6> Coverage Limit : {myPolicy.coverageLimit}, Coverage Period: {myPolicy.coveragePeriod}</h6>
      <h6> Total premium paid: {myPolicy.totalPremiumPaid}</h6>
      <div style={{ display: 'flex', alignItems: 'center' }}>
      <button className='btn btn-sm btn-success' onClick={()=>{onClaim(myPolicy.tokenId)}}>Claim</button>
      <button className='btn btn-sm btn-primary' style={{ marginLeft: '10px' }} onClick={()=>{onPayPremium(myPolicy.tokenId)}}>Pay premium</button>
      </div>
    </div>
  )
}
