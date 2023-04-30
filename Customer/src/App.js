import './App.css';
import Header from './MyComponents/Header'
import { Policies } from './MyComponents/Policies'
import { MyPolicies } from './MyComponents/MyPolicies'
import { Footer } from './MyComponents/Footer'
import { Login } from './MyComponents/Login'
import { Register } from './MyComponents/Register'
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import axios from 'axios';
import Web3 from 'web3';

import contractABI from './contractABI.json'; // Replace with your contract ABI


function App() {

  // Function to login the user
  const loginUser = async (email, password) => {
    console.log("I am login", email, password);
    try {
      const res = await axios.post('http://localhost:3009/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem("user", JSON.stringify({ name: res.data.name, email: res.data.email }));

      console.log("Successfully logged in with name: ", res.data.name, "email: ", res.data.email);
      // redirect user to authenticated page
    } catch (err) {
      console.log(err);
    }
  }


  // Function to register the user
  const registerUser = async (name, email, password) => {
    console.log("I am registering.", name, email, password);
    try {
      await axios.post('http://localhost:3009/auth/register', { name, email, password });
      console.log("Successfully registered with a new account.");
      // redirect user to login page
    } catch (err) {
      console.log(err);
    }
  }

  const contractAddress = '0x818ddF70Ff1db1d3Db70b68F32aFfe3E094A6718';
  // const [currentAccount, setCurrentAccount] = useState(null);

  // Connect to the Polygon network using a web3 provider
  const web3 = new Web3(window.ethereum);
  // Load the contract ABI
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  // Maximum required gas price
  const gasPriceInGwei = 50;
  const gasPriceInWei = web3.utils.toWei(gasPriceInGwei.toString(), 'Gwei');

  const [currentAccount, setCurrentAccount] = useState(null);
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


  // Extract name from login credential which is stored in local storage
  const storedUser = localStorage.getItem("user");
  const userObject = storedUser ? JSON.parse(storedUser) : null;
  const [name, setName] = useState(userObject ? userObject.name : null);
  useEffect(() => {
    if (storedUser && userObject!=null) {
      setName(userObject.name);
    } else {
      setName(null);
    }
  }, [storedUser]);

  const onBuy = (policy) => {

    // console.log(name);
    console.log("Buy button is tapped.");

    if (currentAccount != null && name != null) {
      const policyMintRequest = {
        currentAccount: currentAccount,
        premium: policy.premium,
        deductibles: policy.deductibles,
        coverageLimit: policy.coverageLimit,
        coveragePeriod: policy.coveragePeriod,
        termsAndConditions: policy.termsAndConditions,
        name: name,
        Address: "address",
        contactInformation: "contactInfo"
      };

      fetch("http://localhost:3009/policyMintRequest/", {
        method: "POST",
        body: JSON.stringify(policyMintRequest),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
    else {
      console.log("Either address is null or name is null");
    }

  }


  const [policies, setPolicies] = useState([]);
  useEffect(() => {

    fetch('http://localhost:3009/policyDetails/')
      .then(response => response.json())
      .then(data => setPolicies(data))
      .catch(error => console.error(error));
  }, []);


  // For handling login and register screens

  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const handleBackToLoginClick = () => {
    setIsRegistering(false);
  };

  // used store all policies and then render those policies in frontend
  const [myPolicies, setMyPolicies] = useState([]);

  useEffect(() => {

    // console.log('accountAddress:', accountAddress);
    if (currentAccount) {
      contract.methods.balanceOf(currentAccount).call()
        .then(balance => {
          // console.log(balance); // should output the actual balance value
          const promises = [];
          for (let i = 0; i < balance; i++) {
            promises.push(contract.methods.tokenOfOwnerByIndex(currentAccount, i).call()
              .then(tokenId => {
                return contract.methods.getInfo1(tokenId).call()
                  .then((result) => {
                    // console.log(result[1]);
                    const myPolicy = {
                      tokenId: tokenId,
                      premium: result[0],
                      deductibles: result[1],
                      coverageLimit: result[2],
                      coveragePeriod: result[3],
                      totalPremiumPaid: result[4],
                      termsAndConditions: result[5],
                      name: result[6],
                      Address: result[7],
                      contactInformation: result[8]
                    }
                    return myPolicy;
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              })
              .catch(error => {
                console.error(error);
              }));
          }
          Promise.all(promises)
            .then(policies => {
              // console.log(policies);
              setMyPolicies(policies);
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [currentAccount]);


  const onClaim = (tokenId) => {

    console.log("Claim button is tapped", tokenId, currentAccount);

    if (currentAccount) {

      contract.methods.getInfo2(tokenId).call()
        .then((result) => {
          if (result[0] === true && result[1] === true && result[2] === false) {
            console.log("Now you can submit claim.");
            // Call the submitClaim function on the contract to submit a claim
            try {
              contract.methods.submitClaim(tokenId).send({
                from: currentAccount,
                gasPrice: gasPriceInWei
              }).then(() => {
                console.log('Claim Submitted.');
                const claimRequest = {
                  tokenId: tokenId
                }
                fetch("http://localhost:3009/claimRequest/", {
                  method: "POST",
                  body: JSON.stringify(claimRequest),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((response) => response.json())
                  .then((data) => console.log(data));
              });

            } catch (error) {
              console.error('Error in claiming the policy', error);
            }
            // console.log('Claim Submitted1.');
          }
          else if (result[1] == false) {
            console.log("This policy is not active.");
          }
          else {
            console.log("You already have claimed for this policy");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

  }

  const onPayPremium = (tokenId) => {
    console.log("Pay premium button is tapped with tokenId:", tokenId);

    if (contractAddress) {

      contract.methods.getInfo2(tokenId).call()
        .then((result) => {
          if (result[0] === true && result[1] === true) {
            console.log("You can pay premium now.");
            contract.methods.getInfo1(tokenId).call()
              .then((res) => {
                // console.log(res[4]);
                // Call the submitClaim function on the contract to submit a claim
                try {
                  contract.methods.renewPolicy(tokenId, res[0]).send({
                    from: currentAccount,
                    gasPrice: gasPriceInWei
                  }).then(() => {
                    console.log('Premium paid.');
                  });

                } catch (error) {
                  console.error('Error in paying premium', error);
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }
          else if (result[1] == false) {
            console.log("This policy is not active.");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  return (
    <>
      <Router>
        <Header title="Customer" />

        <Routes>
          <Route path="/" element={
            <>
              {/* <AddPolicy addPolicy={addPolicy} /> */}
              <Policies policies={policies} onBuy={onBuy} />
            </>
          } />
          <Route path="/myPolicies" element={<MyPolicies myPolicies={myPolicies} onClaim={onClaim} onPayPremium={onPayPremium} />} />
          <Route path="/login" element={isRegistering ? <Register registerUser={registerUser} onBackToLoginClick={handleBackToLoginClick} /> : <Login loginUser={loginUser} onRegisterClick={handleRegisterClick} />} />
        </Routes>

        <Footer />
      </Router>
    </>
  );
}

export default App;
