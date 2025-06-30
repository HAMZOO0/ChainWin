export const ContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const abi = [
   {
      inputs: [
         {
            internalType: "address",
            name: "_priceFeed",
            type: "address",
         },
      ],
      stateMutability: "payable",
      type: "constructor",
   },
   {
      inputs: [],
      name: "FundMe__not_owner",
      type: "error",
   },
   {
      inputs: [],
      name: "Fund",
      outputs: [],
      stateMutability: "payable",
      type: "function",
   },
   {
      inputs: [],
      name: "cheaperWithdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "ethAmount",
            type: "uint256",
         },
      ],
      name: "getConverstionRate",
      outputs: [
         {
            internalType: "uint256",
            name: "",
            type: "uint256",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "index",
            type: "uint256",
         },
      ],
      name: "getFunders",
      outputs: [
         {
            internalType: "address",
            name: "",
            type: "address",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [],
      name: "getFundersLength",
      outputs: [
         {
            internalType: "uint256",
            name: "",
            type: "uint256",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [],
      name: "getOwner",
      outputs: [
         {
            internalType: "address",
            name: "",
            type: "address",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [],
      name: "getPrice",
      outputs: [
         {
            internalType: "uint256",
            name: "",
            type: "uint256",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "funderIndex",
            type: "address",
         },
      ],
      name: "getsFundersWithAmount",
      outputs: [
         {
            internalType: "uint256",
            name: "",
            type: "uint256",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [],
      name: "getsPriceFeed",
      outputs: [
         {
            internalType: "contract AggregatorV3Interface",
            name: "",
            type: "address",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
];
