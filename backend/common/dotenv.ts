const path = require("path")
const dotenv = require("dotenv")
module.exports = function () {
  const envFile =
    process.env.NODE_ENV === "production" ? ".env.production" : ".env"
  dotenv.config({ path: path.resolve(__dirname, "../../", envFile) })
}