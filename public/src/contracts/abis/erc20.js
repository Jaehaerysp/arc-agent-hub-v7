export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",

  "function allowance(address owner, address spender) view returns (uint256)",

  "function approve(address spender, uint256 amount) returns (bool)",

  "function transfer(address to, uint256 amount) returns (bool)",

  "function transferFrom(address from, address to, uint256 amount) returns (bool)",

  "function decimals() view returns (uint8)",

  "function symbol() view returns (string)",

  "function name() view returns (string)",
];