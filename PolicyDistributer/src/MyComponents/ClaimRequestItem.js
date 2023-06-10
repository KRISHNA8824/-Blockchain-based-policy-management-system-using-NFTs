import React, { useState, useEffect } from 'react'

export const ClaimRequestItem = ({ claimRequest, onClaimApprove, onClaimReject }) => {

    return (
        <div>
            <h6>Policy Holder Name: {claimRequest.policyHolderName}</h6>
            <h6>Policy Name: {claimRequest.policyName}, TokenId : {claimRequest.tokenId}</h6>
            <h6> Premium : {claimRequest.premium} INR, Deductibles: {claimRequest.deductibles} INR</h6>
            <h6> Coverage Limit : {claimRequest.coverageLimit} INR, Coverage Period: {claimRequest.coveragePeriod} months</h6>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className='btn btn-sm btn-success' onClick={() => { onClaimApprove(claimRequest) }}>Approve</button>
                <button className='btn btn-sm btn-danger' style={{ marginLeft: '10px' }} onClick={() => { onClaimReject(claimRequest) }}>Reject</button>
            </div>
        </div>
    )
}
