import './App.css';
import React, { useState, useEffect } from "react";
import {ethers} from "ethers";
import abi from "./utils/abi.json";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import OwnerTemplate from './pages/ownerTemplate';
import ManagerTemplate from './pages/managerTemplate';
import AdminTemplate from './pages/adminTemplate';
import HospitalTemplate from './pages/hospitalTemplate';


const contractAddress = "0x14A9d45Cb0d92498de0d5CF3525b35D839a0Ad7E";
const contractABI = abi;

function set_role( x ){
  if( x === 0){
    return "Owner";
  }else if( x === 1){
    return "Manager";
  }else if( x=== 2){
    return "Admin";
  }else if( x=== 3){
    return "Hospital";
  }else if( x=== 4){
    return "Patient";
  }else if( x===5) {
    return "New User";
  }
  return (x);
}

function App() {
  const [role, setRole] = useState("");
  const [account, setAccount] = useState("");


  const checkIfConnectedToWallet = async () => {
    try {
        const { ethereum } = window;
    
        if (!ethereum) {
          alert("Please Download any Web3 Wallet such as MetaMask!");
          console.log("Make sure you have metamask!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if(accounts.length === 0){
          alert("No authorized account found");
          console.log("No authorized account found");
        }else{
          console.log("Found an authorized account:", accounts[0]);
          setAccount(accounts[0]);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();  
          const demerecContract = new ethers.Contract(contractAddress, contractABI, signer);
          let myRole = await demerecContract.getMyRole();
          setRole( set_role( myRole));
        }

    } catch ( error) {
      console.log(error);
    } 
    // const accounts = await ethereum.request({ method: "eth_accounts" });
    // const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    // const provider = new ethers.providers.Web3Provider(ethereum);
    // const signer = provider.getSigner();  
    // const demerecContract = new ethers.Contract(contractAddress, contractABI, signer);
    // let rl = await demerecContract.getMyRole();
  }


  const connectWallet = async () =>{
    try{
      const { ethereum } = window;

      if(!ethereum){
        alert("Get MetaMask!");
        return;
      }else{
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      }
    } catch( error){
      console.log(error);
    }
  }

  useEffect( () => {
    checkIfConnectedToWallet();
    console.log("connected address is:", account);
  },[account]);

  const Home = () => {
    return(
      <>
      <header className="App-header">
        <h1> Hi!, Welcome To <b>THE DEMEREC DAPP</b> Website</h1>
      </header>
      {!account && (
        <button className='connectButton' onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      {account && (
        <>
        <h1> Your Connected Wallet Address is: {account}</h1>
        <h2> According to your address you are {role}</h2>
        <Link to= {role.toLowerCase()}><button>Yes, Continue as {role}</button></Link>
        </>
      )}
      </>
    );
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/owner' element={<OwnerTemplate/>} />
          <Route path='/manager' element={<ManagerTemplate/>} />
          <Route path='/admin' element={<AdminTemplate/>} />
          <Route path='/hospital' element={<HospitalTemplate/>} />
        </Routes>
      </Router>
    </div>
  );
}


export default App;
