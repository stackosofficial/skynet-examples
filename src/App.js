import logo from "./logo.svg";
import "./App.css";
import { ethers } from "ethers";
import SkyEtherContractService from "@decloudlabs/skynet/lib/services/SkyEtherContractService";
import { useState } from "react";

function App() {
  const [isSigned, setIsSigned] = useState(false);

  const run = async () => {
    // Request account access if needed
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const address = await signer.getAddress();

    const contractInstance = new SkyEtherContractService(
      provider,
      signer,
      address,
      11
    ); // 11 is the chain Id of Skynet

    // Dynamically import SkyMainBrowser and SkyBrowserSigner
    const { default: SkyMainBrowser } = await import(
      "@decloudlabs/skynet/lib/services/SkyMainBrowser"
    );
    const { default: SkyBrowserSigner } = await import(
      "@decloudlabs/skynet/lib/services/SkyBrowserSigner"
    );

    const skyMainBrowser = new SkyMainBrowser(
      contractInstance,
      address, // connected wallet address
      new SkyBrowserSigner(address, signer)
    );

    await skyMainBrowser.init();

    const resp = await skyMainBrowser.appManager.getUrsulaAuth();
    console.log(resp);
    if (resp.success) setIsSigned(true);

    const decFile = await skyMainBrowser.appManager.getDecryptedFile(19);
    console.log(decFile);
  };
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={run} style={{ padding: "20px", fontSize: "16px" }}>
          sign
        </button>
        <div>{isSigned ? "signed" : "not signed"}</div>
      </header>
    </div>
  );
}

export default App;
