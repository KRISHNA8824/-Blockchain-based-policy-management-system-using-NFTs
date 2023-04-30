import React, { useState } from 'react';

export const AddPolicy = (props) => {
    const [name, setName] = useState("")
    const [termsAndConditions, setTermsAndConditions] = useState("")
    const [premium, setPremium] = useState("")
    const [deductibles, setDeductibles] = useState("")
    const [coverageLimit, setCoverageLimit] = useState("")
    const [coveragePeriod, setCoveragePeriod] = useState("")
    

    const submit = (e)=> {
        e.preventDefault();
        if(!name || !termsAndConditions || !premium || !deductibles || !coverageLimit || !coveragePeriod) {
            alert("Please fill all required info.");
        }
        else {
            props.addPolicy(name, termsAndConditions, premium, deductibles, coverageLimit, coveragePeriod);
            setName("");
            setTermsAndConditions("");
            setPremium("");
            setDeductibles("");
            setCoverageLimit("");
            setCoveragePeriod("");
        }
        
    }
    let myStyle = {
        maxWidth: "150vh"
    }
    return (
        
        <div className='container custom-container' style = { myStyle }>
            <h3 className='my-3'>Add a policy</h3>
            <form onSubmit={submit}>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name of The policy</label>
                    <input type="text" value = {name} onChange = {(e)=> {setName(e.target.value)}} className="form-control" id="name"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="termsAndConditions" className="form-label">Terms and conditions</label>
                    <input type="text" value = {termsAndConditions} onChange={(e)=> {setTermsAndConditions(e.target.value)}} className="form-control" id="termsAndConditions" />
                </div>

                <div className="mb-3">
                    <label htmlFor="premium" className="form-label">Premium</label>
                    <input type="number" value = {premium} onChange = {(e)=> {setPremium(e.target.value)}} className="form-control" id="name"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="deductibles" className="form-label">Deductibles</label>
                    <input type="number" value = {deductibles} onChange = {(e)=> {setDeductibles(e.target.value)}} className="form-control" id="name"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="coverageLimit" className="form-label">Coverage Limit</label>
                    <input type="number" value = {coverageLimit} onChange = {(e)=> {setCoverageLimit(e.target.value)}} className="form-control" id="name"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="coveragePeriod" className="form-label">coveragePeriod</label>
                    <input type="number" value = {coveragePeriod} onChange = {(e)=> {setCoveragePeriod(e.target.value)}} className="form-control" id="name"/>
                </div>

                <button type="submit" className="btn btn-sm btn-success">Add Policy</button>
            </form>
        </div>
    )
}
