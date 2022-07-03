import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import abi from "../utils/abi.json";

const contractAddress = "0x14A9d45Cb0d92498de0d5CF3525b35D839a0Ad7E";
const contractABI = abi;

const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();  
const demerecContract = new ethers.Contract(contractAddress, contractABI, signer);

const getDetails = async () => {
    let 
}


const HospitalTemplate = () => {
    useEffect(()=>{
        getDetails();
    },[]);
    return(
        <>
        <div className="App-header">

        </div>
        </>
    )
}

export default HospitalTemplate;