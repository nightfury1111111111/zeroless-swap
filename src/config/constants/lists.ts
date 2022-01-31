const PANCAKE_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'
const PANCAKE_TOP100 = 'https://tokens.pancakeswap.finance/pancakeswap-top-100.json'


export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  PANCAKE_TOP100,
  PANCAKE_EXTENDED,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []

// --------- Uniswap --------- //
const AAVE_LIST = 'https://bafybeick5mozllkwessstgvebwvqcallrkoiiakrl3agh2lghwapg53dmy.ipfs.dweb.link'
const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'
const CMC_ALL_LIST = 'https://bafybeia2zujfb5qraeekvil62gxemmzumvigoe4lymtqxo2ey4jdlt3p7i.ipfs.dweb.link/'
const CMC_STABLECOIN = 'https://bafybeihuwebylwuzllrnbes5gkgh3axscj4qadiqwtonrvajycu66ddmye.ipfs.dweb.link/'
const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
const KLEROS_LIST = 'https://bafybeiajdskditd7wpiq4i2a3pu4brrven2oxasj3d7dul2avfsa7imoj4.ipfs.dweb.link/'
const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
const ROLL_LIST = 'https://app.tryroll.com/tokens.json'
const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
const WRAPPED_LIST = 'https://bafybeifhpq7ttgicdzng4jkr4nscjzjharik4jm2tmpn3ynn4xgxy4h7um.ipfs.dweb.link/'

export const UNSUPPORTED_UNI_LIST_URLS: string[] = []

// this is the default list of lists that are exposed to users
// lower index == higher priority for token import
const DEFAULT_LIST_OF_LISTS_TO_DISPLAY: string[] = [
  // BA_LIST,
  COMPOUND_LIST,
  AAVE_LIST,
  CMC_ALL_LIST,
  CMC_STABLECOIN,
  // COINGECKO_LIST,
  // WRAPPED_LIST,
  // SET_LIST,
  // ROLL_LIST,
  // KLEROS_LIST,
  // OPTIMISM_LIST,
  // GEMINI_LIST,
]

export const DEFAULT_UNI_LIST_OF_LISTS: string[] = [
  ...DEFAULT_LIST_OF_LISTS_TO_DISPLAY,
  ...UNSUPPORTED_UNI_LIST_URLS, // need to load dynamic unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_UNI_LIST_URLS: string[] = []