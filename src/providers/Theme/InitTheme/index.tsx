import Script from "next/script";
import { useId } from "react";

import { defaultTheme, themeLocalStorageKey } from "../ThemeSelector/types";

export const InitTheme: React.FC = () => {
	const scriptId = useId();
	return (
		// eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
		<Script
			id={scriptId}
			dangerouslySetInnerHTML={{
				__html: `
  (function () {
    function getImplicitPreference() {
      var mediaQuery = '(prefers-color-scheme: dark)'
      var mql = window.matchMedia(mediaQuery)
      var hasImplicitPreference = typeof mql.matches === 'boolean'

      if (hasImplicitPreference) {
        return mql.matches ? 'dark' : 'light'
      }

      return null
    }

    function getStoredPreference() {
      try {
        return localStorage.getItem('${themeLocalStorageKey}')
      } catch (err) {
        return null
      }
    }

    function setTheme(theme) {
      try {
        localStorage.setItem('${themeLocalStorageKey}', theme)
      } catch (err) {
        // ignore
      }
    }

    var colorScheme = getStoredPreference() || getImplicitPreference() || '${defaultTheme}'
    var root = document.documentElement

    root.style.setProperty('--initial-theme', colorScheme)
    root.style.setProperty('color-scheme', colorScheme)

    if (colorScheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    setTheme(colorScheme)
  })()
`,
			}}
		/>
	);
};
