import React, { useEffect, useMemo } from 'react';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.less';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import styled from 'styled-components';
import { Layout } from 'antd';
import { isNil } from 'ramda';
import { WalletProvider } from '@/modules/wallet';
import { StorefrontProvider } from '@/modules/storefront';
import { AppHeader } from '@/common/components/elements/AppHeader';
import { Close } from '@/common/components/icons/Close';
import {
  AnalyticsProvider,
  OLD_GOOGLE_ANALYTICS_ID,
  GA4_ID,
} from '@/common/context/AnalyticsProvider';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  ConnectionProvider,
  WalletProvider as WalletProviderSolana,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../src/graphql/apollo';

import { QueryClient, QueryClientProvider } from 'react-query';

import '@solana/wallet-adapter-react-ui/styles.css';
import { MarketplaceProvider } from '@/modules/marketplace';
import '@fontsource/material-icons';
import { MultiTransactionProvider } from '@/common/context/MultiTransaction';

const { Content } = Layout;

const getSolanaNetwork = () => {
  return (process.env.NEXT_PUBLIC_SOLANA_ENDPOINT ?? '').toLowerCase().includes('devnet')
    ? WalletAdapterNetwork.Devnet
    : WalletAdapterNetwork.Mainnet;
};

const track = (category: string, action: string) => {
  if (isNil(OLD_GOOGLE_ANALYTICS_ID)) {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    send_to: [OLD_GOOGLE_ANALYTICS_ID, GA4_ID],
  });
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const onRouteChanged = (path: string) => {
    if (isNil(OLD_GOOGLE_ANALYTICS_ID)) {
      return;
    }

    window.gtag('config', OLD_GOOGLE_ANALYTICS_ID, { page_path: path });
  };

  useEffect(() => {
    if (typeof window !== 'undefined' || !OLD_GOOGLE_ANALYTICS_ID) {
      return;
    }
    router.events.on('routeChangeComplete', onRouteChanged);
    return () => {
      router.events.off('routeChangeComplete', onRouteChanged);
    };
  }, [router.events]);

  const network = getSolanaNetwork();
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_ENDPOINT!;

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SlopeWalletAdapter(),
      new TorusWalletAdapter({ params: { network } }),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            // retry: (failureCount, error) => {
            //   console.log('failure count', failureCount, error);
            //   return failureCount < 4;
            //   // return 3;
            // },
          },
        },
      }),
    []
  );

  return (
    <>
      <Head>
        <title>Tools built by creators, for creators, owned by creators | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="Discover, explore, and collect NFTs from incredible creators on Solana. Tools built by creators, for creators, owned by creators."
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <ToastContainer
          autoClose={5000}
          hideProgressBar={true}
          position={'bottom-center'}
          className="bottom-4 w-full max-w-full  font-sans text-sm text-white sm:right-4 sm:left-auto sm:w-96 sm:translate-x-0 "
          toastClassName="bg-gray-900 bg-opacity-80 rounded-lg items-center"
          closeButton={() => <Close color="#fff" />}
        />
        <ApolloProvider client={apolloClient}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProviderSolana wallets={wallets} autoConnect>
              <WalletModalProvider>
                <WalletProvider>
                  {({ wallet }) => (
                    <MultiTransactionProvider>
                      <StorefrontProvider wallet={wallet}>
                        {({}) => {
                          return (
                            <MarketplaceProvider wallet={wallet}>
                              {() => (
                                <AnalyticsProvider>
                                  <AppLayout>
                                    
                                    <AppHeader />
                                    <AppContent>
                                      <ContentWrapper>
                                        <Component {...pageProps} track={track} />
                                      </ContentWrapper>
                                    </AppContent>
                                  </AppLayout>
                                </AnalyticsProvider>
                              )}
                            </MarketplaceProvider>
                          );
                        }}
                      </StorefrontProvider>
                    </MultiTransactionProvider>
                  )}
                </WalletProvider>
              </WalletModalProvider>
            </WalletProviderSolana>
          </ConnectionProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;

const AppContent = styled(Content)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  padding-bottom: 3rem;
`;

const AppLayout = styled(Layout)`
  overflow-y: auto;
`;
