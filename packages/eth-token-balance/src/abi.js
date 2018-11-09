export default [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      },
      {
        name: "name",
        type: "bool"
      },
      {
        name: "website",
        type: "bool"
      },
      {
        name: "email",
        type: "bool"
      },
      {
        name: "_count",
        type: "uint256"
      }
    ],
    name: "getAllBalance",
    outputs: [
      {
        name: "",
        type: "bytes"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];
