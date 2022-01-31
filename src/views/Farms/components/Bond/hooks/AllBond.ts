import { ChainId } from "@sphynxdex/sdk-multichain";
import { StableBond } from "utils/Bond/BondLib";
import  BUSDTokenIcon  from 'assets/images/BUSD.png'
import { abi as DaiBondContract } from 'config/abi/Bond/DaiBondContract.json'

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const dai = new StableBond({
  name: "BUSD",
  displayName: "BUSD",
  bondToken: "BUSD",
  isAvailable: { [ChainId.MAINNET]: true,[ChainId.TESTNET]: true },
  bondIconSvg: BUSDTokenIcon,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [ChainId.MAINNET]: {
      bondAddress: "0x575409F8d77c12B05feD8B455815f0e54797381c",
      reserveAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    [ChainId.TESTNET]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
  },
});

export const allBonds = [dai];
// TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
