const path = require("path");

const dist = {
  absolutePath(){
    return path.join(__dirname, 'web')
  }
};

module.exports = dist;
