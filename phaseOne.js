require("dotenv").config();
const { getMap } = require("./utils/getMap");
const axios = require("axios");

const endpoint = `https://challenge.crossmint.io/api/`;



const makePattern = async (start = 0) => {
  const goal = await getMap();

  let row = start;
  for (row; row < goal.length; row++) {
    for (const col in goal[row]) {
      if (goal[row][col] == "POLYANET") {
        try {
          await axios.post(`${endpoint}polyanets/`, {
            candidateId: process.env.CANDIDATE_ID,
            row,
            column: col,
          });
        } catch (error) {
          if (error.response && error.response.status === 429) {
            console.log(
              `Too many requests. Trying again at row ${row} after a delay.`
            );
            setTimeout(() => makePattern(row), 5000);
          } else {
            console.error("Error:", error.message);
          }
        }
      }
    }
  }
};

makePattern();
