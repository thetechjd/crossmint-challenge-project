require("dotenv").config();
const { getMap } = require("./utils/getMap");
const { splitWord } = require("./utils/splitWord");
const axios = require("axios");

const endpoint = `https://challenge.crossmint.io/api/`;

const makePattern = async (start = 0) => {
  const goal = await getMap();
  
  let row = start;
  for (row; row < goal.length; row++) {
    
    for (const col in goal[row]) {
      try {
        if (goal[row][col] == "POLYANET") {
          await handlePolyanet(row, col);
        } else if (goal[row][col].includes("SOLOON")) {
          await handleSoloon(goal[row][col], row, col);
        } else if (goal[row][col].includes("COMETH")) {
          await handleCometh(goal[row][col], row, col);
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.log(
            `Pausing due to too many requests at row ${row}, column ${col}.`
          );
          await delay(5000); 
        } else {
          console.error("Error:", error.message);
        }
      }
    }
  }
};

const handlePolyanet = async (row, col) => {
  try {
    await axios.post(`${endpoint}polyanets/`, {
      candidateId: process.env.CANDIDATE_ID,
      row,
      column: col,
    });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      await delay(5000); 
      return handlePolyanet(row, col); 
    } else {
      throw error; 
    }
  }
};

const handleSoloon = async (word, row, col) => {
  const adj = await splitWord(word);
  console.log(adj);
  try {
    await axios.post(`${endpoint}soloons/`, {
      candidateId: process.env.CANDIDATE_ID,
      row,
      column: col,
      color: adj,
    });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      await delay(5000); 
      return handleSoloon(word, row, col); 
    } else {
      throw error; 
    }
  }
};

const handleCometh = async (word, row, col) => {
  const adj = await splitWord(word);
  console.log(adj);
  try {
    await axios.post(`${endpoint}comeths/`, {
      candidateId: process.env.CANDIDATE_ID,
      row,
      column: col,
      direction: adj,
    });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      await delay(5000); 
      return handleCometh(word, row, col); 
    } else {
      throw error; 
    }
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

makePattern();
