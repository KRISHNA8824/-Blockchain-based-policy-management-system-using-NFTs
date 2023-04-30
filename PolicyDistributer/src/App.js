import './App.css';
import Header from './MyComponents/Header'
import { Policies } from './MyComponents/Policies'
import { Footer } from './MyComponents/Footer'
import { PolicyApprovalRequests } from './MyComponents/PolicyApprovalRequests'
import { ClaimRequests } from './MyComponents/ClaimRequests'
import { BurnNFT } from './MyComponents/BurnNFT'
import { Login } from './MyComponents/Login'
import React, { useState, useEffect } from 'react';
import { AddPolicy } from './MyComponents/AddPolicy';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Web3 from 'web3';
import contractABI from './contractABI.json';


function App() {

  const loginUser = (email, password) => {
    console.log("I am login", email, password);
    localStorage.setItem("User", JSON.stringify(email));
  }


  const addPolicy = (name, termsAndConditions, premium, deductibles, coverageLimit, coveragePeriod) => {

    let sno;
    if (policies.length === 0) {
      sno = 1;
    }
    else {
      sno = parseInt(policies[policies.length - 1].sno) + 1;
    }
    const myPolicy = {
      sno: sno.toString(),
      name: name,
      termsAndConditions: termsAndConditions,
      premium: premium,
      deductibles: deductibles,
      coverageLimit: coverageLimit,
      coveragePeriod: coveragePeriod
    }

    console.log("Add policy button is tapped to add the policy: ", myPolicy);
    fetch("http://localhost:3009/policyDetails/", {
      method: "POST",
      body: JSON.stringify(myPolicy),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {console.log(data.myData); setPolicies([...policies, data.savedData]);});

    // console.log(myPolicy);

  }

  const onDelete = (policy) => {
    console.log("I am on delete of policy.", policy);
    setPolicies(policies.filter((e) => {
      return e !== policy;
    }));

    // localStorage.setItem("policies", JSON.stringify(policies));
    fetch(`http://localhost:3009/policyDetails/${policy._id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }

  // const [policies, setPolicies] = useState(initPolicies);
  const [policies, setPolicies] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3009/policyDetails/')
      .then(response => response.json())
      .then(data => setPolicies(data))
      .catch(error => console.error(error));
  }, []);


  const contractAddress = '0x818ddF70Ff1db1d3Db70b68F32aFfe3E094A6718';
  const [currentAccount, setCurrentAccount] = useState(null);
  // Connect to the Polygon network using a web3 provider
  const web3 = new Web3(window.ethereum);
  // Load the contract ABI
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  // Maximum cost price for a transaction happen
  const gasPriceInGwei = 50;
  const gasPriceInWei = web3.utils.toWei(gasPriceInGwei.toString(), 'Gwei');

  if (window.ethereum) {
    // request access to user's accounts
    window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
      // get the current account address
      setCurrentAccount(accounts[0]);
      // console.log(currentAccount);
    }).catch((error) => {
      console.error(error);
    });
  }

  const onPolicyApprove = (policyApprovalRequest) => {
    console.log("Policy approval button is clicked.", policyApprovalRequest);

    if (currentAccount) {

      // Call the mint function on the contract to mint a new token
      try {
        contract.methods.mint(policyApprovalRequest.currentAccount, policyApprovalRequest.premium, policyApprovalRequest.deductibles, policyApprovalRequest.coverageLimit, policyApprovalRequest.coveragePeriod, policyApprovalRequest.termsAndConditions, policyApprovalRequest.name, policyApprovalRequest.Address, policyApprovalRequest.contactInformation).send({
          from: currentAccount,
          gasPrice: gasPriceInWei
        }).then((result) => {
          console.log('Token minted!', result);
          // localStorage.setItem("policies", JSON.stringify(policies));
          fetch(`http://localhost:3009/policyMintRequest/${policyApprovalRequest._id}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));

          setPolicyApprovalRequests(policyApprovalRequests.filter((e) => {
            return e !== policyApprovalRequest;
          }));

        });
      } catch (error) {
        console.error('Error minting token', error);
      }
    }
    else {
      console.log("Current account is null.")
    }
  }


  const onPolicyReject = (policyApprovalRequest) => {
    console.log("Reject Button for policy approval is tapped with policyApprovalRequest:", policyApprovalRequest);

    // localStorage.setItem("policies", JSON.stringify(policies));
    fetch(`http://localhost:3009/policyMintRequest/${policyApprovalRequest._id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));

    setPolicyApprovalRequests(policyApprovalRequests.filter((e) => {
      return e !== policyApprovalRequest;
    }));
  }


  const [policyApprovalRequests, setPolicyApprovalRequests] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3009/policyMintRequest/')
      .then(response => response.json())
      .then(data => setPolicyApprovalRequests(data))
      .catch(error => console.error(error));
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("policies", JSON.stringify(policies));
  // }, [policies]);


  const onClaimApprove = (claimRequest) => {
    console.log("Claim Approval Button is tapped", claimRequest);

    if (currentAccount) {

      contract.methods.getInfo2(claimRequest.tokenId).call()
        .then((result) => {
          if (result[0] === true && result[1] === true && result[2] === true) {
            console.log("Now you can approve this claim.");
            // Call the submitClaim function on the contract to submit a claim
            try {
              contract.methods.approveClaim(claimRequest.tokenId).send({
                from: currentAccount,
                gasPrice: gasPriceInWei
              }).then(() => {
                console.log('Claim approved.');
              });

            } catch (error) {
              console.error('Error minting token', error);
            }
            console.log('Claim Submitted1.');
          }
          else {
            console.log("Either this policy is not active or invalid claim request.");
          }

          fetch(`http://localhost:3009/claimRequest/${claimRequest._id}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));

          setClaimRequests(claimRequests.filter((e) => {
            return e !== claimRequest;
          }));

        })
        .catch((error) => {
          console.error(error);
        });
    }

  }

  const onClaimReject = (claimRequest) => {
    console.log("Claim Reject button is tapped.", claimRequest);

    if (currentAccount) {

      contract.methods.getInfo2(claimRequest.tokenId).call()
        .then((result) => {
          if (result[0] === true && result[1] === true && result[2] === true) {
            console.log("Now you can reject this claim.");
            // Call the submitClaim function on the contract to submit a claim
            try {
              contract.methods.rejectClaim(claimRequest.tokenId).send({
                from: currentAccount,
                gasPrice: gasPriceInWei
              }).then(() => {
                console.log('Claim rejected.');
              });

            } catch (error) {
              console.error('Error minting token', error);
            }
            console.log('Claim Submitted1.');
          }
          else {
            console.log("Either this policy is not active or invalid claim request.");
          }

          fetch(`http://localhost:3009/claimRequest/${claimRequest._id}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));

          setClaimRequests(claimRequests.filter((e) => {
            return e !== claimRequest;
          }));

        })
        .catch((error) => {
          console.error(error);
        });
    }

  }


  const [claimRequests, setClaimRequests] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3009/claimRequest/`)
      .then(response => response.json())
      .then(data => setClaimRequests(data))
      .catch(error => console.error(error));
  }, []);

  const onBurn = (tokenId)=> {
    console.log("onBurn button is tapped.", tokenId);

    if (currentAccount) {

            // Call the submitClaim function on the contract to submit a claim
            try {
              contract.methods.burn(tokenId).send({
                from: currentAccount,
                gasPrice: gasPriceInWei
              }).then(() => {
                console.log('NFT has burned successfully.');
                alert("NFT has burned successfully.");
              });

            } catch (error) {
              console.error('Error burning NFT', error);
              alert('Got an error.');
            }

    }
  }

  return (
    <>
      <Router>
        <Header title="Admin" />

        <Routes>

          <Route path="/" element={
            <>
              <AddPolicy addPolicy={addPolicy} />
              <Policies policies={policies} onDelete={onDelete} />
            </>
          } />

          <Route path="/policyApprovalRequest" element={<PolicyApprovalRequests policyApprovalRequests={policyApprovalRequests} onPolicyApprove={onPolicyApprove} onPolicyReject={onPolicyReject} />} />

          <Route path="/claimRequest" element={<ClaimRequests claimRequests={claimRequests} onClaimApprove={onClaimApprove} onClaimReject={onClaimReject} />} />

          <Route path="/burnNFT" element={<BurnNFT onBurn={onBurn} />} />

          <Route path="/login" element={<Login loginUser={loginUser} />} />

        </Routes>

        <Footer />
      </Router>
    </>

  );
}

export default App;
