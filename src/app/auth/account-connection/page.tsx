'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { supabase, getSession } from '@/lib/supabase';
import { toast } from 'sonner';
import { formatAddress } from '@/lib/utils';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { getName, getAvatar } from '@coinbase/onchainkit/identity';
import { base, baseSepolia } from 'viem/chains';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AccountConnectionPage() {
  const router = useRouter();
  const { user, authenticated, login, logout, connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const [isLoading, setIsLoading] = useState(false);
  const [cryptoConnected, setCryptoConnected] = useState(false);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(2);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [lastDisconnectTime, setLastDisconnectTime] = useState<number | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioConnected, setPortfolioConnected] = useState(false);
  
  const handleContinue = () => {
    setIsLoading(true);
    router.push('/dashboard');
  };
  
  // Check if any account is connected to enable the continue button
  const accountConnected = portfolioConnected || cryptoConnected;

  // Load saved wallet info from Supabase on component mount and auto-connect
  useEffect(() => {
    const loadAndConnectWallet = async () => {
      try {
        const { data: sessionData, error: sessionError } = await getSession();
        if (sessionError) throw sessionError;
        
        const session = sessionData;
        if (!session?.user?.id) return;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('wallet_address, display_name, avatar_url, last_disconnect_time')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        
        if (profile?.wallet_address) {
          console.log('Profile found with wallet:', profile.wallet_address);
          console.log('Last disconnect time:', profile.last_disconnect_time);
          
          // Check if we're already authenticated
          if (authenticated) {
            console.log('Already authenticated, no need to login');
            return;
          }
          
          // If there's no last_disconnect_time, it's a new connection
          if (!profile.last_disconnect_time) {
            console.log('No last disconnect time, using login without modal');
            await login();
          } else {
            const timeSinceDisconnect = Date.now() - profile.last_disconnect_time;
            console.log('Time since disconnect (hours):', timeSinceDisconnect / (60 * 60 * 1000));
            
            // Only show modal if disconnected for more than 24 hours
            if (timeSinceDisconnect > 24 * 60 * 60 * 1000) {
              console.log('Long disconnect, showing modal');
              await connectWallet();
            } else {
              console.log('Recent disconnect, using login without modal');
              await login();
            }
          }

          // Wait for the wallet to be connected
          let attempts = 0;
          const maxAttempts = 10; // 5 seconds total
          
          while (attempts < maxAttempts) {
            if (wallets.length > 0) {
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
          }

          if (wallets.length > 0) {
            const wallet = wallets[0];
            setCryptoConnected(true);
            setAddress(wallet.address);
            setDisplayName(profile.display_name);
            setAvatarUrl(profile.avatar_url);
            setLastDisconnectTime(profile.last_disconnect_time);
          }
        }
      } catch (error) {
        console.error('Error loading and connecting wallet:', error);
      }
    };

    loadAndConnectWallet();
  }, []);

  const handleConnectPortfolio = async () => {
    setPortfolioLoading(true);
    
    try {
      // Here you would implement stock portfolio connection
    // For now, we'll just simulate a successful connection
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`);
      const data = await response.json();
      
      if (data['Global Quote']) {
        // Successfully connected to the API
        setPortfolioConnected(true);
        toast.success('Stock portfolio connected successfully');
      } else {
        throw new Error('Failed to connect to stock portfolio');
      }
    } catch (error) {
      console.error('Error connecting to stock portfolio:', error);
      toast.error('Failed to connect to stock portfolio');
    } finally {
      setPortfolioLoading(false);
    }
  };

  const handleConnectCrypto = async () => {
    try {
      setCryptoLoading(true);
      
      // Check if we're already authenticated and have a wallet
      if (authenticated && wallets.length > 0) {
        console.log('Already authenticated with wallet, no need to login');
        const wallet = wallets[0];
        setCryptoConnected(true);
        setAddress(wallet.address);
        return;
      }
      
      console.log('Current lastDisconnectTime:', lastDisconnectTime);
      
      // If there's no lastDisconnectTime, it's a new connection
      if (!lastDisconnectTime) {
        console.log('No last disconnect time, using login without modal');
        if (!authenticated) {
          await login();
        }
      } else {
        const timeSinceDisconnect = Date.now() - lastDisconnectTime;
        console.log('Time since disconnect (hours):', timeSinceDisconnect / (60 * 60 * 1000));
        
        // Only show modal if disconnected for more than 24 hours
        if (timeSinceDisconnect > 24 * 60 * 60 * 1000) {
          console.log('Long disconnect, showing modal');
          if (!authenticated) {
      await connectWallet();
          }
        } else {
          console.log('Recent disconnect, using login without modal');
          if (!authenticated) {
            await login();
          }
        }
      }
      
      // Wait for the wallet to be connected
      let attempts = 0;
      const maxAttempts = 10; // 5 seconds total
      
      while (attempts < maxAttempts) {
        if (wallets.length > 0) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      
      if (wallets.length === 0) {
        throw new Error('No wallet connected');
      }

      const wallet = wallets[0];
      setCryptoConnected(true);
      setAddress(wallet.address);

      // Try to resolve name on both Base mainnet and Base Sepolia
      try {
        // Try Base mainnet first
        const mainnetName = await getName({ 
          address: wallet.address as `0x${string}`, 
          chain: base 
        });
        
        console.log('Resolved name on Base mainnet:', mainnetName);

        // If no name on mainnet, try Base Sepolia
        const sepoliaName = mainnetName ? null : await getName({ 
          address: wallet.address as `0x${string}`, 
          chain: baseSepolia 
        });
        
        console.log('Resolved name on Base Sepolia:', sepoliaName);

        const resolvedName = mainnetName || sepoliaName;
        
        if (resolvedName) {
          setDisplayName(resolvedName);
          // Try to get avatar for the resolved name
          try {
            const avatar = await getAvatar({ 
              ensName: resolvedName, 
              chain: mainnetName ? base : baseSepolia 
            });
            
            console.log('Resolved avatar:', avatar);
            
            if (avatar) {
              setAvatarUrl(avatar);
            }
          } catch (avatarError) {
            console.error('Error resolving avatar:', avatarError);
          }
        } else {
          // If no name found, use formatted address
          const formattedAddress = formatAddress(wallet.address);
          setDisplayName(formattedAddress);
        }
      } catch (error) {
        console.error('Error resolving name:', error);
        const formattedAddress = formatAddress(wallet.address);
        setDisplayName(formattedAddress);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setCryptoLoading(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      setCryptoLoading(true);
      setCryptoConnected(false);
      setAddress(null);
      setDisplayName(null);
      setAvatarUrl(null);
      
      // Set the disconnect time to now
      const disconnectTime = Date.now();
      setLastDisconnectTime(disconnectTime);
      
      // Update Supabase with the disconnect time
      const { data: sessionData, error: sessionError } = await getSession();
      if (sessionError) throw sessionError;
      
      const session = sessionData;
      if (!session?.user?.id) {
        throw new Error('User not logged in for profile update.');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          last_disconnect_time: disconnectTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (updateError) {
        throw new Error(`Failed to save disconnect time: ${updateError.message}`);
      }

      await logout();
      toast.success('Wallet disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    } finally {
      setCryptoLoading(false);
    }
  };
  
  // Update Supabase profile when wallet connects or disconnects
  useEffect(() => {
    const updateUserProfile = async () => {
      if (address || lastDisconnectTime) {
        setIsUpdatingProfile(true);
        
        try {
          const { data: sessionData, error: sessionError } = await getSession();
          
          if (sessionError) {
            throw new Error(`Error getting session: ${sessionError.message}`);
          }
          
          const session = sessionData;
          if (!session?.user?.id) {
            throw new Error('User not logged in for profile update.');
          }

          const userId = session.user.id;

          // Update the user's profile in Supabase with wallet info
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              wallet_address: address,
              display_name: displayName,
              avatar_url: avatarUrl,
              last_disconnect_time: lastDisconnectTime,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

          if (updateError) {
            throw new Error(`Failed to save wallet info: ${updateError.message}`);
          }

          if (address) {
            toast.success('Wallet connected successfully!');
          }
        } catch (err) {
          console.error('Error updating profile:', err);
          toast.error('Failed to save wallet information');
        } finally {
          setIsUpdatingProfile(false);
        }
      }
    };

    updateUserProfile();
  }, [cryptoConnected, address, displayName, avatarUrl, lastDisconnectTime]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Connect Your Accounts</CardTitle>
          <CardDescription>
            Link your stock portfolio and crypto accounts to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Stock Portfolio</h3>
            <Button 
              onClick={handleConnectPortfolio}
              disabled={portfolioLoading || portfolioConnected}
              className="w-full"
              variant="secondary"
            >
              {portfolioLoading ? 'Connecting...' : portfolioConnected ? 'Connected' : 'Connect Stock Portfolio'}
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Wallet</h3>
            {cryptoConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="w-full"
                    variant="secondary"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={avatarUrl || undefined} alt={displayName || ''} />
                        <AvatarFallback className="text-xs">
                          {displayName ? displayName.charAt(0).toUpperCase() : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{displayName || formatAddress(address || '')}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleDisconnectWallet}>
                    Disconnect Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
            <Button 
              onClick={handleConnectCrypto}
                disabled={cryptoLoading || isLoading}
                className="w-full"
                variant="secondary"
              >
                {cryptoLoading || isLoading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
            )}
          </div>
        </CardContent>
        <CardContent>
          <Button 
            onClick={handleContinue} 
            disabled={!accountConnected || isLoading}
            className="w-full bg-black text-white border border-white hover:bg-black/90 hover:text-white"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}