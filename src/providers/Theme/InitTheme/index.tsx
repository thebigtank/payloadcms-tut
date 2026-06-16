import Script from 'next/script'
import React from 'react'

/**
 * Sets <html data-theme> from a stored preference (or the OS setting) before
 * the page becomes interactive, so returning dark-mode users don't see a flash
 * of light. Rendered via next/script (strategy="beforeInteractive") rather than
 * a raw <script> so Next reliably injects + executes it on every route
 * (including the not-found boundary) and React doesn't warn about a script child.
 */
export const InitTheme: React.FC = () => {
  return (
    <Script
      id="theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    function getImplicitPreference() {
      try {
        var mql = window.matchMedia('(prefers-color-scheme: dark)')
        if (typeof mql.matches === 'boolean') return mql.matches ? 'dark' : 'light'
      } catch (e) {}
      return null
    }
    var themeToSet = 'light'
    try {
      var preference = window.localStorage.getItem('theme')
      if (preference === 'light' || preference === 'dark') {
        themeToSet = preference
      } else {
        var implicit = getImplicitPreference()
        if (implicit) themeToSet = implicit
      }
    } catch (e) {}
    document.documentElement.setAttribute('data-theme', themeToSet)
  })();
  `,
      }}
    />
  )
}
