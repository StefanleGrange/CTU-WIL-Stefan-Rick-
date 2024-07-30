const dotenv = require('dotenv');

dotenv.config()

const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Replace these values with your MySQL database credentials
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

// Connect to the MySQL database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});
let prof = null;
    // Create a route to handle the form submission
    app.post('/submit', (req, res) => {
      // Retrieve form data
      const Profile_email = req.body.email;
      const Profile_Password = req.body.password

   // Perform Details retreaval here (e.g., check email and password against the database)
   const sql = 'SELECT * FROM Profiles WHERE Profile_email = ? AND Profile_Password = ?';
    [prof] = db.query(sql, [Profile_email, Profile_Password], (err, result) => {
     if (err) throw err;

    if (result.length > 0) {
      // User authenticated, redirect to the outside page
      res.redirect('Profile.html');
    } else {
      // Authentication failed, send an error message
      res.send('Invalid email or password');
    }
  });
});


// Connect to the MySQL database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Create a route to handle the sign-up form submission
app.post('/signup', (req, res) => {
  // Retrieve form data
  const Profile_Firstname = req.body.firstName;
  const Profile_Lastname = req.body.lastName;
  const Profile_phonenumber = req.body.cellphoneNumber;
  const Profile_email = req.body.email;
  const Profile_Password = req.body.password;
  const Wishlist = [];
  const favourites =[];

  // Insert the data into the MySQL database
  const sql = 'INSERT INTO Profiles (`Profile_Firstname`,`Profile_Lastname`,`Profile_Password`,`Profile_phonenumber`,`Profile_email`,`wishlist`,`favourites`) VALUES (?, ?, ?, ?, ?, ?, ? )';
  db.query(sql, [Profile_Firstname, Profile_Lastname, Profile_Password , Profile_phonenumber, Profile_email, Wishlist, favourites], (err, result) => {
    if (err) throw err;

    // Data inserted successfully, send a response
    res.send('Sign-up successful');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});



const jwt = require('jsonwebtoken');

function generateToken(uniqueID) {
    const expiry = '1h'; // Token expires in 1 hour
    const secretKey = 'Samaritan'; // Use a secure, environment-specific key
    return jwt.sign({ id: uniqueID }, secretKey, { expiresIn: expiry });
}

// Usage
const token = generateToken(uniqueID);
console.log(token);

    const nodemailer = require('nodemailer');
async function sendMail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or another email service
        auth: {
            user: 'Ctu.WIL.Projects@gmail.com',
            pass: '9517538246s'
        }
    });
    const mailOptions = {
        from: 'Ctu.WIL.Projects@gmail.com',
        to: email,
        subject: 'Email Verification',
        html: '<p>Please use the following <a href="http://yourdomain.com/verify?token=${encodeURIComponent(token)}"></a> link to verify your email. Link expires in 1 hour.</p>'
    };
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
}
// Usage
sendMail('recipient@example.com', token).catch(console.error);

function verifyToken(req, res) {
    const token = req.query.token;
    const secretKey = 'Samaritan';

    try {
        const decoded = jwt.verify(token, secretKey);
        console.log('Token verified:', decoded);
        // Proceed with user email verification logic
        res.send('Email verified successfully!');

    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(400).send('Invalid or expired token');
    }
}




async function wishdivfill(){
  const wishlistDiv = document.getElementById("WishlistDiv");
  wishlistDiv.innerHTML = '';
  let [profwishlist] = db.query('SELECT wishlist FROM Profiles WHERE user_id = ?',[prof.user_ID])
  for(let i=0; i<profwishlist[0].wishlist.length; i++){
      let [AllListings] =  db.query('SELECT * FROM Listings where listing_id = ?',[profwishlist[0].wishlist[i]]);
      CreateListingDIV(WishlistDiv)
  }
}





let wishlistindex = null;
async function isItemInWishlist(wishlist, listingid) {
    // Assuming wishlist is an array of items in the wishlist
let result = false

    for (let i = 0; i < wishlist.length; i++) {
        if (wishlist[i].toLowerCase() === listingid.toLowerCase()) {
            result = true
             wishlistindex = i;

        }
    }
return result

}
let wishlist = prof.wishlist;
let listingid = document.getElementById("listidpar").innerHTML; 

async function wishaddrem(){

    if (isItemInWishlist(wishlist, listingid)) {
        wishlist.splice(wishlistindex, 1);
        alert("Listing removed from wishlist")
    } else {
        wishlist.push(listingid);
        alert("Listing added to wishlist")
    }
}
