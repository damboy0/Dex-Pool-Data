# Uniswap Pool Tracker

A simple npm package to interact with the Uniswap V3 protocol, allowing users to fetch pool addresses and details based on token pairs and fee tiers.

## Installation

1. **Install the package**:
   ```bash
   npm install dex-pool
   ```

2. **Set up environment variables**:

Create a .env file in your project root directory to store your Alchemy API key with the name "API_KEY":

    ```text
    API_KEY=your_api_key_here
    ```

# Usage

## Import the Package

    ```javasript
    const { getPoolAddress, fetchPoolDetails } = require('your-package-name');
    require('dotenv').config();
    ```