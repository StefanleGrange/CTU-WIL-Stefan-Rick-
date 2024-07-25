import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();


let [AllAgents] = await pool.query('SELECT * FROM Agents');
let [AllListings] = await pool.query('SELECT * FROM Listings');

//Create Dynamic Objects for Agents
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

//Search and filter function for agents
export async function SearchAgent(){
    const agentsListDiv = document.getElementById("agentsListDiv")
    const AgentArea = document.getElementById("AgentArea");
    const AreaCheckbox = document.getElementById("AreaCheckbox");
    const AgentName = document.getElementById("AgentName");
    let SearchQuery = 'SELECT * FROM Agents';

    if(AgentArea.value!="" && AreaCheckbox.checked){
        SearchQuery += (' WHERE Agent_area = ?', [AgentArea.value]);
        if(AgentName.value!=""){
            SearchQuery += (' AND Agent_Firstname LIKE ? OR Agent_Lastname LIKE ?', ['%'+AgentName.value+'%', '%'+AgentName.value+'%']);
        }
    } else if(AgentName.value!=""){
        SearchQuery += (' WHERE Agent_Firstname LIKE ? OR Agent_Lastname LIKE ?', ['%'+AgentName.value+'%', '%'+AgentName.value+'%']);
    }
    [AllAgents] = await pool.query(SearchQuery);
    if(AllAgents.length > 0){
        agentsListDiv.innerHTML = "";
        CreateAgentDIV();
    } else {
        console.log("No matching Agents found");
        alert("No matching Agents found");
    }
    
}

//Create Dynamic Objects for Listings
export async function CreateListingDIV(ListDIV){
    const listingsListDiv = document.getElementById(ListDIV)

    for (let i = 0; i < AllListings.length; i++){
        let Listing_ID = AllListings[i].listing_id;
        let Location = AllListings[i].listing_address;
        let Price = AllListings[i].price;
        let Bedrooms = AllListings[i].Bedrooms;
        let Bathrooms = AllListings[i].Bathrooms;
        let AgentID = AllListings[i].agent_id;
        let EmbededMap = AllListings[i].listingMap;

        let [AgentName] = await pool.query("SELECT Agent_Firstname +' '+ Agent_Lastname AS AgentName FROM Agents WHERE Agent_id = ?", [AgentID]);
        
        let ListingDispDIV = document.createElement('div');
        ListingDispDIV.className = "ListingCard";
        ListingDispDIV.innerHTML += `<p>${Location} <br> ${Price} <br> ${Bedrooms} bedrooms, ${Bathrooms} bathrooms</p>`;
        ListingDispDIV.onclick = FillDetailsPage(Listing_ID, AgentName, EmbededMap);
        listingsListDiv.appendChild(ListingDispDIV);
    }
}

//Fill Details page
async function FillDetailsPage(ListingID, AgentName, ListMap){
    const MapDiv = document.getElementById("mapDIV");
    if (ListMap != null){
        MapDiv.innerHTML = ListMap;
    } else {
        MapDiv.innerHTML = "No Map Available";
    }
    
    let [ListingDetails] = await pool.query('SELECT * FROM Listings WHERE Listing_ID = ?', [ListingID]);

    document.getElementById("DetailsPrice").innerHTML = '$' + ListingDetails.price;
    document.getElementById("DetailsBedrooms").innerHTML = ListingDetails.Bedrooms;
    document.getElementById("DetailsBathrooms").innerHTML = ListingDetails.Bathrooms;
    document.getElementById("DetailsDescription").innerHTML = ListingDetails.more_info;
    document.getElementById("DetailsAgentName").innerHTML = AgentName;
    DetailsPre = document.createElement("pre");
    DetailsPre.textContent = `Price: ${ListingDetails.price}    Rooms: ${ListingDetails.Bedrooms} bedrooms | ${ListingDetails.Bathrooms} bathrooms
    Agent assigned to this Property: ${AgentName}
    More info about the property: ${ListingDetails.more_info}`;
}

//Search and Filter function
export async function SearchListings(){
    const FilterMinPrice = document.getElementById("FilterMinPrice");
    const FilterMaxPrice = document.getElementById("FilterMaxPrice");
    const FilterBathrooms = document.getElementById("FilterBathrooms");
    const FilterBedrooms = document.getElementById("FilterBedrooms");
    const FilterLocation = document.getElementById("FilterLocation");
    
    let RoomsQuery = await pool.query('Bedrooms >= ? AND Bathrooms >= ?', [FilterBedrooms.value, FilterBathrooms.value]);
    let PriceQuery = await pool.query('price BETWEEN ? AND ?', [FilterMinPrice.value, FilterMaxPrice.value]);
    let LocQuery = await pool.query('listing_address LIKE ?', ['%' + FilterLocation.value + '%']);

    const PriceCheckbox = document.getElementById("PriceCheckbox");
    const LocationCheckbox = document.getElementById("LocationCheckbox");
    const RoomsCheckbox = document.getElementById("RoomsCheckbox");
    let sChecks = PriceCheckbox.checked+','+ LocationCheckbox.checked +','+ RoomsCheckbox.checked;
    let SearchQuery = 'SELECT * FROM Listings';

    switch (sChecks){
        case "True,False,False":
            SearchQuery += ' WHERE '+ PriceQuery;
        break;
        case "False,True,False":
            SearchQuery += ' WHERE '+ LocQuery;
        break;
        case "False,False,True":
            SearchQuery += ' WHERE '+ RoomsQuery;
        break;
        case "True,True,False":
            SearchQuery += ' WHERE '+ PriceQuery +' AND '+ LocQuery;
        break;
        case "True,False,True":
            SearchQuery += ' WHERE '+ PriceQuery +' AND '+ RoomsQuery;
        break;
        case "False,True,True":
            SearchQuery += ' WHERE '+ LocQuery +' AND '+ RoomsQuery;
        break;
        case "True,True,True":
            SearchQuery += ' WHERE '+ PriceQuery +' AND '+ LocQuery +' AND '+ RoomsQuery;
        break;
        default:
            SearchQuery = 'SELECT * FROM Listings';
        break;
    }
    
    [AllListings] = await pool.query(SearchQuery);
    if(AllListings.length > 0){
        listingsListDiv.innerHTML = "";
        CreateListingDIV();
    } else {
        console.log("No matching listings found");
        alert("No matching listings found");
    }
}