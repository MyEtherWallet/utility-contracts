export default [
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "bool",
        name: "name",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "website",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "email",
        type: "bool",
      },
    ],
    name: "getAllBalance",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
