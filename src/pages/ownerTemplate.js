import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import {contractABI, contractAddress} from "../utils/contract";

const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();  
const demerecContract = new ethers.Contract(contractAddress, contractABI, signer);

const OwnerTemplate = () => {
    const [[ownerName, ownerAddress], setName] = useState(["",""]);
    const [renderList, setRenderList] = useState([]);

    const getDetails = async () => { 
        try {
            let [add,name] = await demerecContract.imOwner();
            // console.log(name, add);
            setName([name, add]);
            getListOfManagerAddress();
        } catch(error) {
            alert("To Access this page "+error.errorArgs[0])
            console.log(error);
        }
    }

    let listOfManagerAddress = [];

    const getListOfManagerAddress = async () => {
        try{
            let list = await demerecContract.getMngrsList();
            listOfManagerAddress = list;
            // console.log(listOfManagerAddress);
            gettingList();
        } catch(error) {
            console.log(error);
        }
    }

    const gettingList = async () => {
        let _renderList = [];
        for(let i=0; i < listOfManagerAddress.length; i++){
            let address = listOfManagerAddress[i];
            let details = await demerecContract.managerDetail(address);
            // console.log(details[1]);
            let [,result,] = details[0].split("'");
            result = result.toUpperCase().split("$");
            result.push(address);
            if(details[1]){
                result.push(1);
            }else{
                result.push(0);
            }
            _renderList.push(result);
        }
        setRenderList(_renderList);
        // console.log(renderList);
    }

    function ManagerList(){
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
            await demerecContract.actMngr(x);
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
            await demerecContract.deactMngr(x);
            console.log("deactivating" , x);
        } catch (error) {
            console.log(error);
        }
    }

    async function addManager() {
        let name = document.getElementById("addName").value;
        let ph = document.getElementById("addPhone").value;
        let aadhar = document.getElementById("addAadhar").value;
        let location = document.getElementById("addLocation").value;
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
            alert("Invalid Name!");
            return;
        }
        if( ph.length !== 10){
            alert("Invalid Phone Number!");
            return;
        }
        if( aadhar.length !== 12){
            alert("Invalid Aadhar Number!");
            return;
        }
        if( address.length !== 42 || address[0] !== "0" || address[1] !== "x"){
            alert("Invalid Wallet Address!");
            return;
        }

        let final = "'"+name+"$+91"+ph+"$"+aadhar+"$"+location+"'";
        alert("Hey Owner! please check the final string: "+final+"\n if not correct decline the transaction");
        try{
            const transac = await demerecContract.addManager(final, address , { gasLimit: 300000 });
            await transac.wait()
            alert("Manager \""+name+"\" with wallet address"+address+"\n Added Successfully!");
            setRenderList([]);
        } catch( error){
            alert("Unsuccessful! (on Adding Manager)")
            console.log("Error from Add Manager:\n", error);
            // error.length ? alert("Unsuccessful! \n"+name+" is an active Manager already!") : alert("transaction cancelled");
        }
    }

    useEffect( () => {
        getDetails();
    },[ownerAddress]);

    return (
        <div className="owner">
        <div className="App-header">
            <h2>Name: {ownerName}</h2>
            <h2>Address: {ownerAddress}</h2>
        </div>
        <br/>
        <div className="Add-Manager" style={{backgroundColor: "white" , textAlign:"center" ,color: "black"}}>
            <h4>Add manager</h4>
            <div className="input-group">
            <span className="input-group-text">Name</span>
            <input className="form-control" id="addName" type="text" placeholder="Name Of Manager" />
            </div>
            <div className="input-group">
            <span className="input-group-text">Phone No.: +91</span>
            <input className="form-control" id="addPhone" type="number" placeholder="Phone no. Of Manager" />
            </div>
            <div className="input-group">
            <span className="input-group-text">Aadhar No.</span>
            <input className="form-control" id="addAadhar" type="number" placeholder="Aadhar no. Of Manager" />
            </div>
            <div className="input-group">
            <span className="input-group-text">Location</span>
            <input className="form-control" id="addLocation" type="text" placeholder="Location Of Manager" />
            </div>
            <div className="input-group">
            <span className="input-group-text">Wallet Address</span>
            <input className="form-control" id="addAddress" type="text" placeholder="Wallet address Of Manager" />
            </div>
            <button className="btn btn-primary" onClick={addManager} >Add Manager</button>
        </div>
        <br/>
        <div className="Act-Deact-Manager">
            <h4>Change Job Status of Manager</h4>
            <div className="input-group">
            <span className="input-group-text">Wallet Address</span>
            <input className="form-control" id="modiAddress" type="text" placeholder="Manager Address" ></input>
            </div>
            <button className="btn btn-primary" onClick={activator} >Activate</button>
            <button className="btn btn-primary" onClick={deactivator} >Deactivate</button>
        </div>
        <br/>
        <h4>Manager List</h4>
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Phone no.</th>
                    <th>Aadhar no.</th>
                    <th>Location</th>
                    <th>Address</th>
                    <th>Job Status</th>
                </tr>
            </thead>
            <ManagerList/>
        </table>
        </div>
    );
};

export default OwnerTemplate;