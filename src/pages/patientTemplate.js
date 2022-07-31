import { ethers } from "ethers";
import { contractABI , contractAddress } from "../utils/contract";
import React, { useEffect, useState } from "react";

const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
const demerecContract = new ethers.Contract(contractAddress, contractABI, signer);

const PatientTemplate = () =>{
    const [load, reLoad] = useState(true);
    const [record, setRecord] = useState([]);
    const [[identity, emergency, medicalrecords], setMedicalRecords] = useState([[], [], []]);

    const formate = [['Date', 'Time', 'DoctorName', 'PatientName', 'Age', 'BloodPressure', 'Sugar', 'Problem', 'Describtion', 'Prescription'],['Date', 'Time', 'DoctorName', 'PatientName', 'Age', 'Prescription']]

    const getDetails = async () => {
        if(!load){
            listing();
            return;
        }
        try{
            let details = await demerecContract.imPatient();
            reLoad(false);
            let [_identity, _emergency, _medicalrecords] = [details[0], details[1], details[2]];
            [,_identity,] = _identity.split("'");
            _identity = _identity.split("$");
            [,_emergency,] = _emergency.split("'");
            _emergency = _emergency.split("$");
            console.log(_medicalrecords);
            setMedicalRecords([_identity, _emergency, _medicalrecords]);
        } catch (error){
            alert(error.errorArgs + "\nGo Back To Home Page!");
        }
    }

    const listing = () => {
        let _report = [];
        medicalrecords.forEach(element => {
            let [x,y,z] = [element[0], element[1], element[2]];
            [,y,] = y.split("'");
            y = y.split("$");
            // console.log("x:",x,"y:",y,"z:",z.toNumber());
            _report.push([x,z.toNumber(),y]);
            // report.push(_report);
            // console.log(_report);
        });
        _report.reverse();
        setRecord(_report);
        console.log (record);
    }

    // setTimeout((load) => {
    //     if(!load){
    //         console.log("setter");
    //         listing();
    //     }
    // }, 5000);

    useEffect(()=>{
        getDetails();
    },[load]);

    function Records() {
        let len = record.length+1;
        const context = record.map(
            (element) => {
                len = len-1;
                return (
                    <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                    <th>S.No.</th>
                    <th>Hospital Address</th>
                    {formate[element[1]].map((ele)=>{return(<th>{ele}</th>)})}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                    <td>{len}</td>
                    <td>{element[0]}</td>
                    {element[2].map((ele)=>{return(<td>{ele}</td>)})}
                    </tr>
                    </tbody>
                    </table>
                )
            }
        )

        return (
            <div >
                <h2>Your Medical Records</h2>
                {context.length===0 ? <p>You have no medical records</p> : context}
            </div>
        )
    }

    const giveAccess = async() =>{
        try{
            let _address = document.getElementById("hospitalAddress").value;
            if(_address === ""){
                alert("Please enter Address!")
                return;
            }
            await demerecContract.giveAccess(_address);
            console.log("giving access to:" , _address);
        } catch (error) {
            console.log(error);
        }
    }

    const takeAccess = async() =>{
        try{
            let _address = document.getElementById("hospitalAddress").value;
            if(_address === ""){
                alert("Please enter Address!")
                return;
            }
            await demerecContract.takeAccess(_address);
            console.log("taking access from:" , _address);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <>
        <div className="App-header">
            <h2>Welcome Back Patient</h2>
        </div>
        <div className="details">
            <h2>Your Personal Details</h2>
            <p><b>Name:</b> {identity[0]} | <b>Phone No.:</b> {identity[1]} | <b>Aadhar No.:</b> {identity[2]} | <b>Blood Grp:</b> {identity[4]}</p>
            <p><b>Location:</b> {identity[3]}</p>
            <h2>Your Emergency Contact</h2>
            <p><b>Name:</b> {emergency[1]} | <b>Relation:</b> {emergency[2]} | <b>Phone No.:</b> {emergency[3]}</p>
        </div>
        <br/>
        <div className="Give-Take-Access">
            <h2>Give and take Access permision of your medical records from hospital</h2>
            <div className="input-group">
            <span className="input-group-text">Wallet Address</span>
            <input className="form-control" id="hospitalAddress" type="text" placeholder="Wallet address Of Hospital" ></input>
            </div>
            <button className="btn btn-primary" onClick={giveAccess}>Give Access</button>
            <button className="btn btn-primary" onClick={takeAccess}>Take Access</button>
        </div>
        <br/>
        <div className="medicalRecords" >
            <Records/>
        </div>
        </>
    )
}

export default PatientTemplate;