EmberScript updated website package

What changed:
- Buy on Raydium button now auto-builds from APP_CONFIG.tokenAddress
- View Chart button now auto-builds from APP_CONFIG.pairAddress
- Added Copy Contract button
- Added How To Buy section
- Header CTA now points to Raydium instead of launch info

Before going live:
1. Open app.js
2. Set APP_CONFIG.tokenAddress to your token mint address
3. Set APP_CONFIG.pairAddress to your Dexscreener/Raydium pair address
4. Set telegramUrl and xUrl
5. If you want to hardcode URLs directly, you can also fill raydiumUrl and dexscreenerUrl

Main button logic:
- Raydium URL format:
  https://raydium.io/swap/?inputMint=sol&outputMint=YOUR_TOKEN_ADDRESS
- Dex URL format:
  https://dexscreener.com/solana/YOUR_PAIR_ADDRESS
