
import AppLayout from './conponents/layout/AppLayout';
import { CryptoContextProvider } from './context/crypto-context';

export default function App() {
    return (
        <CryptoContextProvider>
           <AppLayout></AppLayout>
        </CryptoContextProvider>
    );
}
