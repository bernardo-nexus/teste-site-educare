import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import './index.css'
import App from './App'
import { I18nProvider } from './i18n'

const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {recaptchaKey ? (
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
        <BrowserRouter>
          <I18nProvider>
            <App />
          </I18nProvider>
        </BrowserRouter>
      </GoogleReCaptchaProvider>
    ) : (
      <BrowserRouter>
        <I18nProvider>
          <App />
        </I18nProvider>
      </BrowserRouter>
    )}
  </StrictMode>,
)
