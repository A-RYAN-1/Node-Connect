import Head from "next/head";
import "../styles/globals.css";

//INTERNAL IMPORT
import { ChatAppProvider } from "../Context/ChatAppContext";
import { NavBar } from "../Components/index";

const MyApp = ({ Component, pageProps }) => (
  <div>
    <Head>
      <title>Node Connect - Decentralised Chat</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <ChatAppProvider>
      <NavBar />
      <main>
        <Component {...pageProps} />
      </main>
    </ChatAppProvider>
  </div>
);

export default MyApp;
