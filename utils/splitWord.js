const splitWord = async (word) => {
    const arr = word.split("_");
    const adj = arr[0];
  
    return adj.toLowerCase();
  };

  module.exports = {splitWord}