// pages/_app.tsx
import "../styles/tailwind.css";
import "@mantine/core/styles.css";
import { ApolloProvider } from "@apollo/client";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import apolloClient from "../lib/apollo";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </MantineProvider>
  );
}

export default MyApp;
