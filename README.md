# Aguadulce-FrontEndAssignment

 
[Project walkthrough](https://www.loom.com/share/64ab0d96ab8b4b58b1a6222ea7f1b523  )


cd hardhat 

npm install --save-dev hardhat

npm install

npx hardhat

npx hardhat compile

npx hardhat test         -> run the tests 

npx hardhat node         -> run the hardhat network and then connect the metamask wallet to the local host(change the settings)

npx hardhat run scripts/deployMemberRole.ts --network localhost         -> run the scripts to deploy the contract  on localhost   
                                                                        -> get the contract address
cd ..



FRONTEND
 
 cd frontend/my-app 
 
 add the contract address in the App.tsx CONTRACT_ADDRESS variable (or you could set up the dotenv file) 
 
 npm install 
 
 npm start
 
 
