import React, { useState } from 'react';

export const BurnNFT = (props) => {
    const [tokenId, setTokenId] = useState("")
  
    const submit = (e)=> {
        e.preventDefault();
        if(!tokenId || tokenId<0) {
            alert("Please fill tokenId.");
        }
        else {
            props.onBurn(tokenId);
            setTokenId("");
        }
        
    }
    let myStyle = {
      minHeight: "75vh",
      maxWidth: "70vh",
      margin: "40px auto"
    }
    return (
        
        <div className='container custom-container' style = { myStyle }>
            <h3 className='my-3'>Add a policy</h3>
            <form onSubmit={submit}>

                <div className="mb-3">
                    <label htmlFor="tokenId" className="form-label">TokenId</label>
                    <input type="number" value = {tokenId} onChange = {(e)=> {setTokenId(e.target.value)}} className="form-control" id="tokenId"/>
                </div>

                <button type="submit" className="btn btn-sm btn-success">Burn NFT</button>
            </form>
        </div>
    )
}
