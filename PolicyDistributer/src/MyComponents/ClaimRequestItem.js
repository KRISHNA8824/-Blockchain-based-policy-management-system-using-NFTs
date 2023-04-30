import React, { useState, useEffect } from 'react'

export const ClaimRequestItem = ({ claimRequest, onClaimApprove, onClaimReject }) => {

    return (
        <div>
            <h6>TokenId: {claimRequest.tokenId}</h6>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className='btn btn-sm btn-success' onClick={() => { onClaimApprove(claimRequest) }}>Approve</button>
                <button className='btn btn-sm btn-danger' style={{ marginLeft: '10px' }} onClick={() => { onClaimReject(claimRequest) }}>Reject</button>
            </div>
        </div>
    )
}
