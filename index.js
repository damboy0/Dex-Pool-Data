const { ethers, AddressZero } = require('ethers');
require('dotenv').config();

// RPC URL
const apiKey = process.env.API_KEY;
const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`);

// Uniswap V3 Factory contract address
const factoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const factoryAbi = [
  'function getPool(address token0, address token1, uint24 fee) external view returns (address)',
];

// Pool ABI 
const poolAbi = [
    'function liquidity() external view returns (uint128)',
    'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
    'function token0() external view returns (address)',
    'function token1() external view returns (address)',
    'function fee() external view returns (uint24)',
  ];

  // Helper functions
function sqrtPriceX96ToPrice(sqrtPriceX96) {
    return (Number(sqrtPriceX96) / Math.pow(2, 96)) ** 2;
  }
  
  function tickToPrice(tick) {
    return Math.pow(1.0001, Number(tick));
  }


  // Get pool address
async function getPoolAddress(token0, token1, fee) {
    const factory = new ethers.Contract(factoryAddress, factoryAbi, provider);
    try {
      const poolAddress = await factory.getPool(token0, token1, fee);
      if (poolAddress === AddressZero) {
        throw new Error('No pool found for the given tokens and fee tier.');
      }
      return poolAddress;
    } catch (error) {
      console.error('Error fetching pool address:', error);
      throw error;
    }
  }

  // Fetch pool details

  async function fetchPoolDetails(poolAddress) {

    const pool = new ethers.Contract(poolAddress, poolAbi, provider);
    try {
        const liquidity = await pool.liquidity();
        const slot0 = await pool.slot0();
        const token0 = await pool.token0();
        const token1 = await pool.token1();
        const fee = await pool.fee();

        const sqrtPriceX96 = slot0.sqrtPriceX96.toString();
        const tick = slot0.tick;

    // Convert sqrtPriceX96 and tick to human-readable price
        const priceFromSqrtPrice = sqrtPriceX96ToPrice(sqrtPriceX96);
        const priceFromTick = tickToPrice(tick);

        return {
            liquidity: liquidity.toString(),
            priceFromSqrtPrice: priceFromSqrtPrice.toFixed(6),
            priceFromTick: priceFromTick.toFixed(6), 
            token0,
            token1,
            fee
        };
    } catch (error) {
      console.error('Error fetching pool details:', error);
      throw error;
    }
    
  }

module.exports = { getPoolAddress, fetchPoolDetails };