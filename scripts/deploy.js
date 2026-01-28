const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.parseEther("0.001");

  const [deployer, secondSigner] = await hre.ethers.getSigners();
  
  // Use the second signer to avoid the default "0x5Fb..." address which is often flagged
  const NeuroChain = await hre.ethers.deployContract("NeuroChain", [], secondSigner);
  
  await NeuroChain.waitForDeployment();

  const address = await NeuroChain.getAddress();

  console.log(`NeuroChain deployed to ${address}`);

  // Write address to frontend
  const fs = require("fs");
  const path = require("path");
  const addressFile = path.join(__dirname, "../frontend/src/contract-address.json");
  fs.writeFileSync(
    addressFile,
    JSON.stringify({ address: address }, null, 2)
  );
  console.log(`Address written to ${addressFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
