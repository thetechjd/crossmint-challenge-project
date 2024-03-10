require("dotenv").config()
const axios = require("axios");

const endpoint = `https://challenge.crossmint.io/api/`;

const getMap = async () => {
    try {
      const response = await axios.get(
        `${endpoint}map/${process.env.CANDIDATE_ID}/goal`
      );
      const {goal } = response.data;
      console.log(goal)
  
      return goal
      
    } catch (error) {
      console.error('Error: ' + error.message);
    }
  };

  module.exports = {getMap}