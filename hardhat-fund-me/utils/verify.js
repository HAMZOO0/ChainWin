async function verify(contractAddress) {
  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: [],
  });
  console.log("Contract verified");
}

module.exports = { verify };
