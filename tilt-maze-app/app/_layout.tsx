import { useFonts } from "expo-font";
import { Stack, Redirect, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useContext } from "react";
import "react-native-reanimated";


// context
import { GameContextProvider } from "@/contexts/GameContext";
import { AuthContext, AuthContextProvider} from "@/contexts/AuthContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}
const StackLayout = () =>{
  const {user} = useContext(AuthContext);
  const segments = useSegments();
  
   // Check if the current route is in the (tabs) group
   const isInTabsGroup = segments[0] === '(tabs)';
  
   // If user is not authenticated and trying to access protected routes
   // Redirect them to auth page
   if (!user && isInTabsGroup) {
     return <Redirect href="/sign-in" />;
   }

  return(
    <Stack>
    <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
    <Stack.Screen name="(auth)" options={{ headerShown: false, gestureEnabled: false }} />
    <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
  </Stack>
  )
}

function RootLayoutNav() {
  return (
    <AuthContextProvider>
      <GameContextProvider>
        <StackLayout/>
      </GameContextProvider>
    </AuthContextProvider>
  );
}
