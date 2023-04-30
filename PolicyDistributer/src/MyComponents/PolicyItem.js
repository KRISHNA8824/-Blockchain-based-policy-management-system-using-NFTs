import React from 'react'

export const PolicyItem = ({policy, onDelete}) => {
  return (
    <div>
      <h6>Name: {policy.name}</h6>
      <h6>Terms & Conditions: {policy.termsAndConditions}</h6>
      <h6> Premium : {policy.premium} INR, Deductibles: {policy.deductibles} INR</h6>
      <h6> Coverage Limit : {policy.coverageLimit} INR, Coverage Period: {policy.coveragePeriod} months</h6>
      <button className='btn btn-sm btn-danger' onClick={()=>{onDelete(policy)}}>Delete</button>
    </div>
  )
}
