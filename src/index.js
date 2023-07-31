import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "./style/flexboxgrid.min.css";
import "./style/index.css";
import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';

Providers.globalProvider = new Msal2Provider({
  clientId: 'REPLACE_WITH_CLIENTID'
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
