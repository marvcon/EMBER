const APP_CONFIG = {
  tokenAddress: 'E1R5AwQGYfdcyNJ8iHGMGKeMpWnJDCsZBxeCfQrQyray',
  pairAddress: 'E1R5AwQGYfdcyNJ8iHGMGKeMpWnJDCsZBxeCfQrQyray',
  raydiumUrl: '',
  dexscreenerUrl: 'https://dexscreener.com/solana/E1R5AwQGYfdcyNJ8iHGMGKeMpWnJDCsZBxeCfQrQyray',
  telegramUrl: 'https://t.me/EMBERSCRIPT',
  xUrl: 'https://x.com/EMBER315399',
  phantomInstallUrl: 'https://phantom.app/'
};

const walletButtons = [
  document.getElementById('walletBtn'),
  document.getElementById('walletBtnHero')
];
const walletStatus = document.getElementById('walletStatus');
const copyContractBtn = document.getElementById('copyContractBtn');

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function getProvider() {
  if ('phantom' in window) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) return provider;
  }
  if (window.solana?.isPhantom) return window.solana;
  return null;
}

function setWalletState(label) {
  walletButtons.forEach((button) => {
    if (button) button.textContent = label;
  });
  if (walletStatus) walletStatus.textContent = label;
}

function buildRaydiumUrl() {
  if (APP_CONFIG.raydiumUrl) return APP_CONFIG.raydiumUrl;
  if (!APP_CONFIG.tokenAddress || APP_CONFIG.tokenAddress === 'SET_TOKEN_ADDRESS') return '#';
  return `https://raydium.io/swap/?inputMint=sol&outputMint=${encodeURIComponent(APP_CONFIG.tokenAddress)}`;
}

function buildDexUrl() {
  if (APP_CONFIG.dexscreenerUrl) return APP_CONFIG.dexscreenerUrl;
  if (!APP_CONFIG.pairAddress || APP_CONFIG.pairAddress === 'SET_DEX_PAIR_ADDRESS') return '#';
  return `https://dexscreener.com/solana/${encodeURIComponent(APP_CONFIG.pairAddress)}`;
}

async function connectWallet() {
  const provider = getProvider();

  if (!provider) {
    const target = isMobile()
      ? `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`
      : APP_CONFIG.phantomInstallUrl;
    window.open(target, '_blank', 'noopener,noreferrer');
    setWalletState('Phantom required');
    return;
  }

  try {
    const response = await provider.connect({ onlyIfTrusted: false });
    const publicKey = response.publicKey?.toString?.() || provider.publicKey?.toString?.() || 'Connected';
    const shortened = publicKey.length > 10
      ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
      : publicKey;
    setWalletState(shortened);
  } catch (error) {
    console.error(error);
    setWalletState('Connection rejected');
  }
}

walletButtons.forEach((button) => {
  if (button) button.addEventListener('click', connectWallet);
});

async function copyContract() {
  const tokenAddress = APP_CONFIG.tokenAddress;
  if (!tokenAddress || tokenAddress === 'SET_TOKEN_ADDRESS') {
    if (copyContractBtn) {
      const old = copyContractBtn.textContent;
      copyContractBtn.textContent = 'Set token first';
      setTimeout(() => copyContractBtn.textContent = old, 1400);
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(tokenAddress);
    if (copyContractBtn) {
      const old = copyContractBtn.textContent;
      copyContractBtn.textContent = 'Copied';
      setTimeout(() => copyContractBtn.textContent = old, 1400);
    }
  } catch (error) {
    console.error(error);
    if (copyContractBtn) {
      const old = copyContractBtn.textContent;
      copyContractBtn.textContent = 'Copy failed';
      setTimeout(() => copyContractBtn.textContent = old, 1400);
    }
  }
}

if (copyContractBtn) {
  copyContractBtn.addEventListener('click', copyContract);
}

function setLink(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  el.href = url || '#';
  if (url && url !== '#') {
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  }
}

function applyLinks() {
  const raydiumUrl = buildRaydiumUrl();
  const dexUrl = buildDexUrl();

  setLink('raydiumBtn', raydiumUrl);
  setLink('buyBtnHeader', raydiumUrl);
  setLink('chartBtn', dexUrl);
  setLink('xLink', APP_CONFIG.xUrl);
  setLink('telegramLink', APP_CONFIG.telegramUrl);
  setLink('dexLink', dexUrl);

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('contractAddressLabel', APP_CONFIG.tokenAddress || 'SET_TOKEN_ADDRESS');
  setText('raydiumLinkLabel', raydiumUrl);
  setText('chartLinkLabel', dexUrl);
  setText('telegramLinkLabel', APP_CONFIG.telegramUrl);
  setText('xLinkLabel', APP_CONFIG.xUrl);
}

window.addEventListener('load', async () => {
  applyLinks();

  const provider = getProvider();
  if (!provider) {
    setWalletState('Phantom not found');
    return;
  }

  try {
    if (provider.isConnected && provider.publicKey) {
      const key = provider.publicKey.toString();
      setWalletState(`${key.slice(0, 4)}...${key.slice(-4)}`);
    } else {
      setWalletState('Phantom ready');
    }
  } catch {
    setWalletState('Wallet ready');
  }
});