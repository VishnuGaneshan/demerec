import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import {contractABI, contractAddress} from "../utils/contract";

const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();  
const demerecContract = new ethers.Contract(contractAddress, contractABI, signer);


const HospitalTemplate = () => {
    const [load, reLoad] = useState(true);
    const [selFormate, setFormate] = useState(-1);
    const [record, setRecord]= useState([]);
    const [[name, medicalrecords], setDetails] = useState([,[]]);

    const getDetails = async () => {
        if(!load){
            listing();
            return;
        }
        try{
            let details = await demerecContract.imHospital();
            let [identity, _medicalrecords] = [details[0], details[2]]
            
            let [,_name,] = identity.split("'");
            _name = _name.split("$");
            // let _name = name.replace(/\$/g, ", ");;
            console.log("identity:", _name);
            setDetails([_name, _medicalrecords]);
        } catch(error){
            alert(error.errorArgs);
        }
        reLoad(false);
    }
    
    const formate = [['Date', 'Time', 'DoctorName', 'PatientName', 'Age', 'BloodPressure', 'Sugar', 'Problem', 'Describtion', 'Prescription'],['Date', 'Time', 'DoctorName', 'PatientName', 'Age', 'Prescription']]

    const listing = () => {
        let _report = [];
        medicalrecords.forEach(element => {
            let [x,y,z] = [element[0], element[1], element[2]];
            [,y,] = y.split("'");
            y = y.split("$");
            // console.log("x:",x,"y:",y,"z:",z.toNumber());
            _report.push([x,z.toNumber(),y]);
        });
        _report.reverse();
        setRecord(_report);
        // console.log(record, _report, load, medicalrecords);
    }
    
    useEffect(()=>{
        getDetails();
        // console.log(record);
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
                    <th>Patient Address</th>
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

    const show = () =>{
        let index = document.getElementById("formateIndex").value;
        if(index == -1){
            alert("Please Select Index");
            return;
        }
        document.getElementById("formate").innerHTML = "<b>Selected Medical Formate Have: </b>" + formate[index];
    }

    function FormateIndex(){
        let ind = -1;
        const options = formate.map(
            (element) => {
                ind++;
                return(<option value={ind}>{ind}</option>)
            }
        )
        
        return(
            <>
            {options}
            </>
        )
        
    }

    const proceed = () =>{
        setFormate(document.getElementById("formateIndex").value);
    }

    const addMedicalRecord = async() => {
        const selectedFormate = formate[selFormate];
        let final = "";
        let patientAddress = document.getElementById("patientAddress").value;
        if(patientAddress.length !==42 || patientAddress[0] !== "0" || patientAddress[1] !== "x"){
            alert("Enter Valid Patient Address!");
            return;
        }
        for( let index = 0; index < selectedFormate.length; index++){
            let element = selectedFormate[index];
            let x = document.getElementById(element).value;
            if(!x){
                alert("Enter "+element);
                return;
            }
            if(index == 0){
                final = "'"+x;
            }else{
                final = final+"$"+x;
            }
        }
        final = final+"'";
        // alert(final);
        // console.log(final);
        try{
        const transac = await demerecContract.writeMedicalRecord(patientAddress, final, selFormate, { gasLimit: 300000 });
        await transac.wait()
        } catch (error){
            alert("Adding Medical Record Failed!\nMaybe Due to:\n       1. Access Denied from patient side\n        2. Internet Issue");
            console.log(error);
        }

    }

    function MediField(){
        const field = formate[selFormate].map(
            (element) =>{
                return (
                <div className="input-group">
                <span className="input-group-text">{element}</span>
                <input className="form-control" id={element} type="text" placeholder={"Enter "+element} ></input>
                </div>
                )
            }
        )

        return (
            <>
            <div className="input-group">
            <span className="input-group-text">Enter Patient Wallet Address</span>
            <input className="form-control" id="patientAddress" type="text" placeholder="Wallet Address" ></input>
            </div>
            {field}
            <button className="btn btn-primary" onClick={addMedicalRecord}>Submit</button>
            </>
        )

    }

    return(
        <>
        { name ? <>
        <div className="App-header">
            <h2>Hospital {name[0]+" ("+name[1]})</h2>
            <p>Phone No.: {name[2]} | Address: {name[3]}</p>
        </div>
        <br/>
        <div className="form-selector input-group">
        <span className="input-group-text">Format Index</span>
        <select id="formateIndex" class="form-select" aria-label="Default select example">
        <option value={-1} selected>Select Format Index</option>
        <FormateIndex/>
        </select>
        </div>
        <button className="btn btn-primary" onClick={show} >Show</button>
        <button className="btn btn-primary" onClick={proceed} > Proceed</button>
        <br/>
        <div id="formate">

        </div>
        {selFormate == -1 ? <></> : 
        <div id="addRecord">
            <MediField/>
        </div> }
        <br/>
        <div className="medicalRecords" >
            <Records/>
        </div>
        </> : (<div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
        </div>) }
        </>
    )
}

export default HospitalTemplate;