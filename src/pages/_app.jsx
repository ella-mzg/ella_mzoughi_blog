import "@/styles/globals.css"
import MainMenu from "@/web/components/MainMenu"
import { SessionContextProvider } from "@/web/components/SessionContext"
import Link from "@/web/components/ui/Link"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()
const App = ({ Component: Page, pageProps }) => (
  <div>
    <SessionContextProvider>
      <QueryClientProvider client={queryClient}>
        <header className="border-b-2 bg-black text-white py-4">
          <div className="max-w-3xl mx-auto flex items-center">
            <h1 className="text-2xl font-bold">
              <Link href="/" className="hover:text-pink-500">
                Worst Blog Ever
              </Link>
            </h1>
            <MainMenu className="ms-auto" />
          </div>
        </header>
        <div className="max-w-3xl mx-auto">
          <Page {...pageProps} />
        </div>
      </QueryClientProvider>
    </SessionContextProvider>
  </div>
)

export default App
