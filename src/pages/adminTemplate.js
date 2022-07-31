import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import {contractABI, contractAddress} from "../utils/contract";

const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();  
const demerecContract = new ethers.Contract(contractAddress, contractABI, signer);

const AdminTemplate =() =>{
    const [[name, phno, aadhar, address], setEmployee] = useState(["","","",""]);
    const [renderList, setRenderList] = useState([]);

    const getDetails = async () => { 
        try {
            let details = await demerecContract.imAdmin();
            let [,result,] = details[0].split("'");
            let [_name , _phno , _aadhar , _address] = result.split("$");
            setEmployee([_name, _phno, _aadhar, _address]);
            getListOfHospitalAddress();
            console.log(result);
        } catch(error) {
            alert("To Access this page "+error.errorArgs[0])
            console.log(error);
        }
    }

    useEffect(()=>{
        getDetails();
        gettingList();
    },[])

    async function addHospital() {
        let name = document.getElementById("addName").value;
        let location = document.getElementById("addLocation").value;
        let describtion = document.getElementById("addDescribtion").value;
        let ph = document.getElementById("addPhone").value;
        let address = document.getElementById("addAddress").value;

        if(name !== ""){
            for(let i =0; i< name.length ; i++){
                if(name[i] === '"' || name[i] === "$" || name[i] === "\\" || name[i] === "'" || name[i] === ","){
                    alert("Invalid Name!");
                    return;
                }
            }
        }
        if(name === ""){
            alert("Invalid Name!");
            return;
        }
        if(location !== ""){
            for(let i =0; i< location.length ; i++){
                if(location[i] === '"' || location[i] === "$" || location[i] === "'"){
                    alert("Invalid Location!");
                    return;
                }
            }
        }
        if(location === ""){
            alert("Invalid Location!");
            return;
        }
        if( ph.length !== 10){
            alert("Invalid Phone Number!");
            return;
        }
        if( describtion ===""){
            alert("add Describtion!");
            return;
        }
        for(let i =0; i< describtion.length ; i++){
            let x = describtion[i];
            if(x === '$' || x === '"' || x === "'"){
                alert("invalid describtion!");
                return;
            }
        }
        if( address.length !== 42 || address[0] !== "0" || address[1] !== "x"){
            alert("Invalid Wallet Address!");
            return;
        }

        let final = "'"+name+"$"+location+"$"+describtion+"$"+ph;
        alert("Hey Admin! please check the final string: "+final+"\n if not correct decline the transaction");
        try{
            const transac = await demerecContract.addHospital(final, address , { gasLimit: 300000 });
            await transac.wait()
            alert("Hospital \""+name+"\" with wallet address"+address+"\n Added Successfully!");
            setRenderList([]);
        } catch( error){
            alert("Unsuccessful! (on Adding Hospital)")
            console.log("Error from Add Admin:\n", error);
        }
        // console.log(final);
    }

    let listOfHospitalAddress = [];

    const getListOfHospitalAddress = async () => {
        try{
            let list = await demerecContract.getHospitals();
            listOfHospitalAddress = list;
            gettingList();
        } catch(error){
            alert(error.errorArgs);
            console.log(error);
        }
    }

    const gettingList = async() => {
        let _renderList = [];
        for(let i=0; i < listOfHospitalAddress.length; i++){
            let address = listOfHospitalAddress[i];
            let details = await demerecContract.hospitalDetail(address);
            let [,Identity,] = details[0].split("'");
            Identity = Identity.toUpperCase().split("$");
            let result =  Identity;
            result.push(address);
            if(details[1]){
                result.push(1);
            }else{
                result.push(0);
            }
            _renderList.push(result);
        }
        setRenderList(_renderList);
    }

    function HospitalList(){
        const listItems = renderList.map(
            (element) => {
                return (element[5] === 1 ? 
                (
                    <tr key={element[0].toString()}>
                        <td>{element[0]}</td>
                        <td>{element[1]}</td>
                        <td>{element[2]}</td>
                        <td>{element[3]}</td>
                        <td>{element[4]}</td>
                        <td>Active</td>
                    </tr>
                )
                :(
                <tr key={element[0].toString()}>
                    <td>{element[0]}</td>
                    <td>{element[1]}</td>
                    <td>{element[2]}</td>
                    <td>{element[3]}</td>
                    <td>{element[4]}</td>
                    <td>Deactive</td>
                </tr>
                )
                )
            }
        )
        // console.log(listItems);
        return (
            <tbody>
                {listItems}
            </tbody>
        )            
    }

    async function activator() {
        try{
            let x = document.getElementById("modiAddress").value;
            if(x === ""){
                alert("Please enter Address!")
                return;
            }
            await demerecContract.actHospital(x);
            console.log("activating" , x);
        } catch (error) {
            console.log(error);
        }
    }
    
    async function deactivator ( ) {
        try{
            let x = document.getElementById("modiAddress").value;
            if(x === ""){
                alert("Please enter Address!")
                return;
            }
            await demerecContract.deactHospital(x);
            console.log("deactivating" , x);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <>
        { name ? (<>
        <div className="App-header">
            <h2>Name: {name} Phone No.: {phno}</h2>
            <h2>Aadhar No.: {aadhar} Address: {address}</h2>
        </div>
        <br/>
        <div className="Add-Hospital" style={{backgroundColor: "white" , textAlign:"center" ,color: "black"}}>
            <h4>Add Hospital</h4>
            <div className="input-group">
            <span className="input-group-text">Hospital Name</span>
            <input className="form-control" id="addName" type="text" placeholder="Name Of Hospital" />
            </div>
            <div className="input-group">
            <span className="input-group-text">Hospital Describtion</span>
            <input className="form-control" id="addDescribtion" type="text" placeholder="Describtion Of Hospital" />
            </div>
            <div className="input-group">
            <span className="input-group-text">Phone no.: +91</span>
            <input className="form-control" id="addPhone" type="number" placeholder="Phone no. Of Hospital" />
            </div>
            <div className="input-group">
            <span className="input-group-text">Hospital Location</span>
            <input className="form-control" id="addLocation" type="text" placeholder="Location Of Hospital" />
            </div>
            <div className="input-group">
            <span className="input-group-text">Wallet Address</span>
            <input className="form-control" id="addAddress" type="text" placeholder="Wallet address used by Hospital" />
            </div>
            <button className="btn btn-primary" onClick={addHospital}>Add Hospital</button>
            <br/>
        </div>
        <br/>
        <div className="Act-Deact-Admin">
            <h4>Change Status of Hospital</h4>
            <div className="input-group">
            <span className="input-group-text">Wallet Address</span>
            <input className="form-control" id="modiAddress" type="text" placeholder="Hospital Address" ></input>
            </div>
            <button className="btn btn-primary" onClick={activator} >Activate</button>
            <button className="btn btn-primary" onClick={deactivator} >Deactivate</button>
        </div>
        <br/>
        <h4>Hospitals List</h4>
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Hospital Name</th>
                    <th>Describtion</th>
                    <th>Phone no.</th>
                    <th>Location</th>
                    <th>Address</th>
                    <th>Status</th>
                </tr>
            </thead>
            <HospitalList/>
        </table>
        </>) : (<div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
        </div>) }
        </>
    );
}

export default AdminTemplate;