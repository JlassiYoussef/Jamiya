import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('shows the sign-in form before association data is loaded', () => {
    const markup = renderToStaticMarkup(createElement(App))

    expect(markup).toContain('jamiya')
    expect(markup).toContain('Se connecter')
    expect(markup).toContain('Espace de l’association')
    expect(markup).toContain('association-nour')
  })
})
