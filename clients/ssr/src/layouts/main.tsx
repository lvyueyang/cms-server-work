import { Header } from '../components/Header'
import '../styles/globals.css'

export function MainLayout({children}: {children: React.ReactNode}) {
  return <>
    <Header></Header>
    <main>{children}</main>
    <footer>Footer</footer>
  </>
}