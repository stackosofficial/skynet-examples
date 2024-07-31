import logo from "./logo.svg";
import "./App.css";
import { ethers } from "ethers";
import SkyEtherContractService from "@decloudlabs/skynet/lib/services/SkyEtherContractService";

function App() {
  const run = async () => {
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

    // const app = await skyMainBrowser.contractService.AppNFT.tokenOfOwnerByIndex(
    //   address,
    //   0
    // );
    // console.log(app);

    const app = await skyMainBrowser.appManager.getDecryptedFile(4);
    console.log(app);
  };
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={run}>press me</button>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
