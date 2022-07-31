import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/contract";

const NewUserTemplate = () => {
    
    async function addPatient() {
        let name = document.getElementById("p-name").value;
        let ph = document.getElementById("p-ph").value; 
        let aadhar = document.getElementById("p-aadhar").value; 
        let loc = document.getElementById("p-loc").value;
        let bg = document.getElementById("p-bg").value;
        let ename = document.getElementById("p-ename").value;
        let erltn = document.getElementById("p-erltn").value;
        let eph = document.getElementById("p-eph").value;
        
        if(name !== ""){
            for(let i =0; i< name.length ; i++){
                if(name[i] === '"' || name[i] === "$" || name[i] === "\\" || name[i] === "'" || name[i] === ","){
                    alert("Don't Use \" | $ | ' | \\ | , in Name!");
                    return;
                }
            }
        }
        if(ename !== ""){
            for(let i =0; i< ename.length ; i++){
                if(ename[i] === '"' || ename[i] === "$" || ename[i] === "\\" || ename[i] === "'" || ename[i] === ","){
                    alert("Don't Use \" | $ | ' | \\ | , in Name!");
                    return;
                }
            }
        }
        if(name === "" || ename === ""){
            alert("Invalid Name!");
            return;
        }
        if(loc !== ""){
            for(let i =0; i< loc.length ; i++){
                if(loc[i] === '"' || loc[i] === "$" || loc[i] === "'" || loc[i] === "\\"){
                    alert("Don't Use \" | $ | ' | \\ in Location!");
                    return;
                }
            }
        }
        if(loc === ""){
            alert("Invalid Location!");
            return;
        }
        if( ph.length !== 10 || eph.length !==10){
            alert("Invalid Phone Number!");
            return;
        }
        if( aadhar.length !== 12){
            alert("Invalid Aadhar Number!");
            return;
        }
        let par1 = "'"+name+"$"+ph+"$"+aadhar+"$"+loc+"$"+bg+"'";
        let par2 = "'"+name+"$"+ename+"$"+erltn+"$"+eph+"'";
        console.log(par1, par2);
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();  
        const demerecContract = new ethers.Contract(contractAddress, contractABI, signer);
        const transac = await demerecContract.addPatient(par1, par2, { gasLimit: 300000 });
        await transac.wait();
        alert("Success! Go back to home");
        
    }
    
    return (
    <>
    <p>If you are here to add as a Patient Fill The Below Form and go back.</p>
    <p>If not Contact our higher authority, because your role is not set or deativated</p>
    <div className="">
        <h3>Personal Details</h3>
        <label>Name:<input type="text" id="p-name"/></label>
        <label>Phone No.:<input type="number" id="p-ph"/></label>
        <label>Aadhar No.:<input type="number" id="p-aadhar"/></label>
        <label>Location:<input type="text" id="p-loc"/></label>
        <label>Blood Grp:
            <select id="p-bg">
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
            </select>
        </label>
        <h3>Emergency Contact Details</h3>
        <label>Name:<input type="text" id="p-ename"/></label>
        <label>Relation type:<input type="text" id="p-erltn"/></label>
        <label>Phone No.:<input type="number" id="p-eph" /></label>
        <br/><br/>
        <button onClick={addPatient}>Add Me as a patient</button>
    </div>
    </>
    );
}

export default NewUserTemplate;