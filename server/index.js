/**
 * @module index
 * @description Entry point for the scheduling system server.
 * Starts the Express server on the specified port.
 */

const app = require("./app");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
