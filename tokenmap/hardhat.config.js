/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
const fs = require('fs')
const privateKey = fs.readFileSync(".secret").toString()
module.exports = {
  defaultNetwork: "mainnet",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/d5b5a5f91fae4fd1b5f9eb66fc3e2295",
      accounts: [privateKey]
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/d5b5a5f91fae4fd1b5f9eb66fc3e2295",
      accounts: [privateKey]
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/d5b5a5f91fae4fd1b5f9eb66fc3e2295",
      accounts: [privateKey]
    }

  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    chainlink: "/home/toshiba/projects/Blockchain/HACKATHON/Dapp-TokenMap/tokenmap/artifacts/@chainlink"
  },
}
