import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Node Connect: a decentralised chat app on Ethereum. Sign in with MetaMask, add friends, chat on-chain and earn reward tokens."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
