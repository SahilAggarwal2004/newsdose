import Script from "next/script"
import ReactQueryProvider from "@/contexts/ReactQueryProvider"
import ContextProvider from "@/contexts/ContextProvider"
import Navbar from "@/components/Navbar"
import Modal from "@/components/Modal"
import '@/styles/globals.css'

export default function MainLayout({ children }) {
    return <html lang="en">
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous" strategy='lazyOnload' />
        <body>
            <ReactQueryProvider>
                <ContextProvider>
                    <Navbar />
                    <Modal />
                    {children}
                </ContextProvider>
            </ReactQueryProvider>
        </body>
    </html>
}