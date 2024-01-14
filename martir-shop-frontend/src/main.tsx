import 'antd/dist/reset.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import {App} from '_app';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
