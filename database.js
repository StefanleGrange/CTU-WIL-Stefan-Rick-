import mysql from 'mysql2'

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();


const [AllAgents] = await pool.query('SELECT * FROM Agents');
const [AllListings] = await pool.query('SELECT * FROM Listings');

export async function CreateAgentDIV(){

    const agentsListDiv = document.getElementById("agentsListDiv")
    for (let i = 0; i < AllAgents.length; i++){
        let Name = AllAgents[i].Agent_Firstname;
        let Surname = AllAgents[i].Agent_Lastname;
        let Email = AllAgents[i].Agent_email;
        let PhoneNumber = AllAgents[i].Agent_phonenumber;

        let AgentDispDIV = document.createElement('div');
        AgentDispDIV.className = "AgentCard";
        AgentDispDIV.innerHTML += `<p>${Name} - ${Surname} <br> ${Email} <br> ${PhoneNumber}</p>`;
        agentsListDiv.appendChild(AgentDispDIV);
    }
}
export async function CreateListingDIV(){
    const listingsListDiv = document.getElementById("ListingsDiv")
    for (let i = 0; i < AllListings.length; i++){
        let Title = AllListings[i].Listing_title;
        let Price = AllListings[i].Listing_price;
        let Bedrooms = AllListings[i].Listing_bedrooms;
        let Bathrooms = AllListings[i].Listing_bathrooms;
        let Description = AllListings[i].Listing_description;
        let AgentID = AllListings[i].Agent_id;

        let ListingDispDIV = document.createElement('div');
        ListingDispDIV.className = "ListingCard";
        ListingDispDIV.innerHTML += `<p>${Title} <br> ${Price} <br> ${Bedrooms} bedrooms, ${Bathrooms} bathrooms <br> ${Description} <br> Agent ID: ${AgentID}</p>`;
        listingsListDiv.appendChild(ListingDispDIV);
    }
}

export async function ProfLogin(){
    let email = document.getElementById("profEmail").value;
    let password = document.getElementById("profPassword").value;
    let [rows] = await pool.query('SELECT * FROM Profiles WHERE Prof_email =? AND Prof_password =?', [email, password]);
    if(rows.length > 0){
        console.log("Login Successful");
        window.location.href = "profile.html";
    } else {
        console.log("Login Failed");
    }

}

export async function ProfSignup(){
    let firstName = document.getElementById("profFirstName").value;
    let lastName = document.getElementById("profLastName").value;
    let email = document.getElementById("profEmail").value;
    let password = document.getElementById("profPassword").value;
    let [rows] = await pool.query('SELECT * FROM Profiles WHERE Prof_email =?', [email]);
    if(rows.length > 0){
        console.log("Email already exists");
    } else {
        await pool.query('INSERT INTO Profiles (Prof_firstname, Prof_lastname, Prof_email, Prof_password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, password]);
        console.log("Signup Successful");
        window.location.href = "profile.html";
    }
}