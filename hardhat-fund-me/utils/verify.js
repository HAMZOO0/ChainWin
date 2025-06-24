async function verify(contractAddress , args) {
  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: args,
  });
  console.log("Contract verified");
}

module.exports = { verify };
