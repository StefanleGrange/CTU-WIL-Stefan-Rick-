import express from 'express'

import { CreateAgentDIV, SearchAgent } from 'include/database.js'

const app = express()

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(3000, () => console.log('Server is running on port 3000'))

document.addEventListener('load', CreateAgentDIV());

agentSearchBtn = document.getElementById("agentSearchBtn");
agentSearchBtn.addEventListener("click", SearchAgent());

agentClearSearch = document.getElementById("agentClearSearch");
 agentClearSearch.addEventListener("click", () => {
    document.getElementById("agentSearchInput").value = "";
    document.getElementById("agentSearchOutput").innerHTML = "";
    SearchAgent()
});
