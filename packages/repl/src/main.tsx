import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.less'
import './styles/light.less'
import './styles/dark.less'

import App from './app'
import ThemeProvider from './components/theme-provider'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
