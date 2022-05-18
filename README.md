# Full-Stack-NFT-

This is a sample project made by me in which a contract development, testing and deployment (on Polygon's Mumbai Testne)
has been done using Hardhat. The Repo also contains a simple frontend for checking if any address is whitelisted and then minting.

The user needs to sign-in by Signing a Message and then he/she/it can take the following actions:
1. Mint (per NFT costs 0.1 <nativ unit>) his/her/its address
2. Check if he/she/it is Whitelisted.
  
Please note that right now only `0xE61DCBb8B3dcf391B2144DD948738028431A4192` (mine) is Whitelisted.
  
## Steps to Run
The smart contract can be deployed using the general methodology but please make sure to have your `.env` in the smart contracts. The `.env` should atleast have
the following Environment Variables: 
  ```
ETHERSCAN_API_KEY=<Your Etherscan Key>
ROPSTEN_URL=https://eth-ropsten.alchemyapi.io/v2/<YOUR ALCHEMY KEY>
PRIVATE_KEY=<Your Private Key>
REPORT_GAS=false
POLYGONSCAN_API_KEY=<Your Polygonscan key>
  ```  
  
Given below is the process to run the frontend:-
  1. Browse to the frontend dir and run `npm install`.
  2. Run `npm start` to open the site locally on `localhost:3000`.

## Stack Used

  On the Frontend:-
  1. React
  2. Material UI
  3. EthersJS

  On the Backend:-
  1. Hardhat
  
  Solidity Compiler version: `0.8.4`
