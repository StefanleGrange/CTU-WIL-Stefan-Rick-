import express from 'express'

import { CreateListingDIV, SearchListings } from 'include/database.js'

const app = express()

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(3000, () => console.log('Server is running on port 3000'))

document.addEventListener('load', CreateListingDIV());

listingSearchBtn = document.getElementById("listingSearchBtn");
listingSearchBtn.addEventListener('click', SearchListings())

listingClearSearch = document.getElementById("listingClearSearch");

listingClearSearch.addEventListener('click', () => {
    document.getElementById("FilterMinPrice").value = "";
    document.getElementById("FilterMaxPrice").value = "";
    document.getElementById("FilterLocation").value = "";
    document.getElementById("FilterBathrooms").value = "";
    document.getElementById("FilterBedrooms").value = "";
    SearchListings();
})
