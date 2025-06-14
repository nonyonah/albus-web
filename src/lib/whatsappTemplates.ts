// Wallet Templates
export const walletTemplates = {
  // Basic wallet operations
  balance: (balance: string, currency: string = 'ETH'): string => 
    `💰 *Wallet Balance*\n\nYour current balance is *${balance} ${currency}*`,
    
  address: (address: string): string =>
    `📬 *Wallet Address*\n\n\`${address}\`\n\n_Use this address to receive funds_`,
    
  walletAddress: (address: string): string =>
    `📬 *Wallet Address*\n\n\`${address}\`\n\n_Use this address to receive funds_`,
    
  createWallet: (phrase: string): string =>
    `🔑 *New Wallet Created*\n\nYour wallet has been created successfully!\n\n*Recovery Phrase:*\n\`${phrase}\`\n\n⚠️ *IMPORTANT*: Write down this recovery phrase and keep it safe. Anyone with this phrase can access your funds!`,
    
  walletCreated: (address: string): string =>
    `✅ *Wallet Created*\n\nYour new wallet has been created!\n\n*Address:*\n\`${address}\`\n\nYou can now receive and send crypto.`,
    
  walletExists: (address: string): string =>
    `ℹ️ *Wallet Exists*\n\nYou already have a wallet:\n\`${address}\`\n\nUse /wallet address to see it.`,
    
  noWallet: (): string =>
    `❌ *No Wallet Found*\n\nYou don't have a wallet yet. Use /wallet create to create one.`,
    
  sendConfirmation: (amount: string, to: string, fee: string): string =>
    `⚠️ *Confirm Transaction*\n\nSend *${amount} ETH* to:\n\`${to}\`\n\nNetwork fee: *${fee} ETH*\n\nReply *CONFIRM* to proceed or *CANCEL* to abort.`,
    
  sendSuccess: (txHash: string, amount: string, to: string): string =>
    `✅ *Transaction Sent*\n\n*${amount} ETH* sent to:\n\`${to}\`\n\nView on Etherscan:\nhttps://etherscan.io/tx/${txHash}`,
    
  walletLocked: (): string =>
    `🔒 *Wallet Locked*\n\nYour wallet is currently locked. Use /unlock to access your wallet.`,
    
  invalidAddress: (): string =>
    `❌ *Invalid Address*\n\nThe address you provided is not a valid Ethereum address.`,
    
  insufficientFunds: (): string =>
    `❌ *Insufficient Funds*\n\nYou don't have enough ETH to complete this transaction.`,
};

// Token Templates
export const tokenTemplates = {
  // Token operations
  tokenBalance: (symbol: string, balance: string, address: string = ''): string =>
    `📊 *${symbol.toUpperCase()} Balance*\n\n*Balance:* ${balance} ${symbol.toUpperCase()}\n` +
    (address ? `*Contract:* \`${address}\`\n` : ''),
    
  tokenList: (tokens: Array<{symbol: string, balance: string, address: string}>): string =>
    `📊 *Your Tokens*\n\n` +
    tokens.map(t => `• *${t.symbol}*: ${t.balance} (\`${t.address}\`)`).join('\n') +
    '\n\nUse /token balance <address> to check a specific token',
    
  tokenTransfer: (amount: string, symbol: string, to: string): string =>
    `🔄 *Token Transfer*\n\n*${amount} ${symbol.toUpperCase()}* sent to:\n\`${to}\``,
    
  tokenApprove: (spender: string, symbol: string, amount: string = 'unlimited'): string =>
    `✅ *Approval Confirmed*\n\nApproved ${amount} ${symbol.toUpperCase()} for:\n\`${spender}\``,
    
  tokenInfo: (symbol: string, data: {
    name?: string;
    symbol?: string;
    decimals?: number | string;
    totalSupply?: string;
    address?: string;
  }): string =>
    `ℹ️ *${symbol.toUpperCase()} Info*\n\n` +
    `*Name:* ${data.name || 'N/A'}\n` +
    `*Symbol:* ${data.symbol || 'N/A'}\n` +
    `*Decimals:* ${data.decimals?.toString() || 'N/A'}\n` +
    `*Total Supply:* ${data.totalSupply || 'N/A'}\n` +
    `*Contract:* \`${data.address || 'N/A'}\``,
};

// NFT Templates
export const nftTemplates = {
  // NFT operations
  nftList: (nfts: Array<{
    name: string;
    contract: string;
    tokenId: string;
    imageUrl?: string;
  }>): string =>
    `🖼️ *Your NFTs*\n\n` +
    nfts.map(nft => `• *${nft.name}* (${nft.contract.slice(0, 6)}...${nft.contract.slice(-4)} #${nft.tokenId})`).join('\n') +
    '\n\nUse /nft info <contract> <tokenId> to view details',
    
  nftDetail: (nft: {
    name?: string;
    tokenId?: string;
    contract?: string;
    description?: string;
    imageUrl?: string;
  }): string =>
    `🖼️ *${nft.name || 'NFT'}*\n\n` +
    `*Token ID:* ${nft.tokenId || 'N/A'}\n` +
    `*Contract:* \`${nft.contract || 'N/A'}\`\n` +
    (nft.description ? `*Description:* ${nft.description}\n` : '') +
    (nft.imageUrl ? `\n[View Image](${nft.imageUrl})` : ''),
    
  nftDetails: (nft: {
    name?: string;
    description?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
    imageUrl?: string;
  }): string =>
    `🖼️ *${nft.name || 'NFT Details'}*\n\n` +
    (nft.description ? `*Description:* ${nft.description}\n\n` : '') +
    (nft.attributes && nft.attributes.length > 0 
      ? `*Attributes:*\n` + nft.attributes.map(a => `• *${a.trait_type}:* ${a.value}`).join('\n') + '\n\n'
      : '') +
    (nft.imageUrl ? `[View Image](${nft.imageUrl})` : ''),
    
  nftTransfer: (tokenId: string, to: string): string =>
    `✅ *NFT Transferred*\n\nNFT #${tokenId} has been transferred to:\n\`${to}\``,
};

// Help & System Messages
export const helpTemplates = {
  mainMenu: (): string =>
    `🤖 *Welcome to Albus* 🤖\n\n` +
    `I'm your Web3 assistant. Here's what you can do:\n\n` +
    `*💰 Wallet*\n` +
    `/wallet balance - Check your wallet balance\n` +
    `/wallet address - Show your wallet address\n` +
    `/wallet create - Create a new wallet\n\n` +
    `*🪙 Tokens*\n` +
    `/token list - List your tokens\n` +
    `/token balance <address> - Check token balance\n\n` +
    `*🖼️ NFTs*\n` +
    `/nft list - List your NFTs\n` +
    `/nft info <contract> <tokenId> - View NFT details\n\n` +
    `*❓ Help*\n` +
    `/help - Show this help message`,
    
  walletHelp: (): string =>
    `💰 *Wallet Help*\n\n` +
    `*/wallet balance* - Check your wallet balance\n` +
    `*/wallet address* - Show your wallet address\n` +
    `*/wallet create* - Create a new wallet\n` +
    `*/send <amount> <to>* - Send ETH to an address\n` +
    `*/backup* - Show your recovery phrase\n` +
    `*/lock* - Lock your wallet\n` +
    `*/unlock <phrase>* - Unlock your wallet`,
    
  tokenHelp: (): string =>
    `🪙 *Token Help*\n\n` +
    `*/token list* - List your tokens\n` +
    `*/token balance <address>* - Check token balance\n` +
    `*/token send <amount> <symbol> <to>* - Send tokens\n` +
    `*/token approve <spender> <symbol> [amount]* - Approve token spending`,
    
  nftHelp: (): string =>
    `🖼️ *NFT Help*\n\n` +
    `*/nft list* - List your NFTs\n` +
    `*/nft info <contract> <tokenId>* - View NFT details\n` +
    `*/nft transfer <id> <to>* - Transfer an NFT`,
    
  error: (message: string): string =>
    `❌ *Error*\n\n${message}`,
    
  invalidCommand: (): string =>
    `❌ *Invalid Command*\n\n` +
    `I didn't understand that command. Type /help to see available commands.`,
};

// Transaction Templates
export const txTemplates = {
  pending: (txHash: string): string =>
    `⏳ *Transaction Pending*\n\n` +
    `Your transaction is being processed.\n\n` +
    `View on Etherscan:\n` +
    `https://etherscan.io/tx/${txHash}`,
    
  success: (txHash: string, message: string = ''): string =>
    `✅ *Transaction Successful*\n\n` +
    `${message}\n\n` +
    `View on Etherscan:\n` +
    `https://etherscan.io/tx/${txHash}`,
    
  failed: (txHash: string, reason: string = ''): string =>
    `❌ *Transaction Failed*\n\n` +
    `${reason ? `${reason}\n\n` : ''}` +
    `View on Etherscan:\n` +
    `https://etherscan.io/tx/${txHash}`,
    
  confirmation: (confirmations: number, required: number, txHash: string): string =>
    `🔄 *Transaction Confirmed* (${confirmations}/${required})\n\n` +
    `Your transaction has ${confirmations} out of ${required} confirmations.\n\n` +
    `View on Etherscan:\n` +
    `https://etherscan.io/tx/${txHash}`,
};
