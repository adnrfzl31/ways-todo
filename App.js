import { NavigationContainer } from "@react-navigation/native"
import { NativeBaseProvider } from "native-base"
import Router from "./index"
import { QueryClient, QueryClientProvider } from "react-query"
import { UserContextProvider } from "./scr/context/userContext"

// LogBox.ignoreAllLogs()
export default function App() {
  const client = new QueryClient()
  return (
    <NavigationContainer>
      <QueryClientProvider client={client}>
        <UserContextProvider>
          <NativeBaseProvider>
            <Router />
          </NativeBaseProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </NavigationContainer>
  )
}
