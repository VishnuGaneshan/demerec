import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import abi from "../utils/abi.json";

const contractAddress = "0x14A9d45Cb0d92498de0d5CF3525b35D839a0Ad7E";
const contractABI = abi;

const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();  
const demerecContract = new ethers.Contract(contractAddress, contractABI, signer);


const HospitalTemplate = () => {
    const getDetails = async () => {
        let details = await demerecContract.imHospital();
        let [identity, Status, medicalrecords] = [details[0], details[1], details[2]]
        // console.log("status:", Status);
        // console.log("medical records;", medicalrecords);
        
        let [,name,] = identity.split("'");
        let _name = name.replace(/\$/g, ", ");;
        console.log("identity:", _name);
        if(Status){
            Status = "Active";
        }else{
            Status = "Unactive";
        }
        setDetails([_name, Status]);
    }

    const [[name, status], setDetails] = useState([,,])
    useEffect(()=>{
        getDetails();
    },[]);
    return(
        <>
        <div className="App-header">
            <h1>Hospital: {name}</h1>
            Your status: {status}
        </div>
        </>
    )
}

export default HospitalTemplate;