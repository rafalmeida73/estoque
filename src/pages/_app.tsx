import type { AppProps } from 'next/app';
import '../../styles/globals.scss';
import { ToastContainer } from 'react-toastify';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tiny-fab/dist/styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <ToastContainer
        autoClose={3000}
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Component {...pageProps} />
      <Footer />
    </>

  );
}

export default MyApp;
