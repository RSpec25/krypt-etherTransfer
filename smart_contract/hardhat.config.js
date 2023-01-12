require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
// };
require("@nomicfoundation/hardhat-chai-matchers");
module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/bNvEjQVacPTlZ4zpdk7ApWfynwrteoz4',
      accounts: ['bbc35d2d48bad7bf4bfd76c29c068515a5ae7997197315a5c616db65c42934e4']
    }
  }
};

// 0x323CD279f36f40629EF74EF031E490e8F7cBD887 transaction address