const { run } = require("../scrape");

 const getUserData = async (req, res) => {
    const { username } = req.params;
    const data = await run(username);

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json({ message: "Failed to scrape the data." });
    }
}

module.exports = { getUserData };