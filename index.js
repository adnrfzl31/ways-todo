import React, { useContext, useEffect, useState } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons"
import { UserContext } from "./scr/context/userContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API, setAuthorization } from "./scr/confiq/Api"

import Wellcome from "./scr/screen/Wellcome"
import Login from "./scr/screen/Auth/Login"
import Register from "./scr/screen/Auth/Register"
import Home from "./scr/screen/Home"
import AddCategory from "./scr/screen/AddCategory"
import AddList from "./scr/screen/AddList"
import DetailList from "./scr/screen/DetailList"

import { Box, Image } from "native-base"
import loading from "./assets/Loading.png"

export default function Router() {
  const Stack = createStackNavigator()
  const Tab = createBottomTabNavigator()
  const [state, dispatch] = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      let token = await AsyncStorage.getItem("token")

      if (token) setAuthorization(token)

      await API.post("/auth/verify-token", {
        validateStatus: () => true,
      })
        .then((response) => {
          if (response.status >= 400) {
            return dispatch({
              type: "AUTH_ERROR",
            })
          }

          const payload = response.data
          dispatch({
            type: "AUTH_SUCCESS",
            payload,
          })
        })
        .catch((error) => {
          dispatch({
            type: "AUTH_ERROR",
          })
        })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const checkUser = async () => {
    await AsyncStorage.getItem("token")
    checkAuth()
  }

  useEffect(() => {
    checkUser()
  }, [])

  const BottomTab = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: () => {
            return null
          },
          tabBarIcon: ({ focused }) => {
            let bgColor
            if (route.name === "Home") {
              bgColor = focused ? "#FF5555" : "#D9D9D9"
              return <AntDesign name="home" size={30} color={bgColor} />
            } else if (route.name === "Add List") {
              bgColor = focused ? "#FF5555" : "#D9D9D9"
              return (
                <FontAwesome name="calendar-plus-o" size={30} color={bgColor} />
              )
            } else if (route.name === "Add Category") {
              bgColor = focused ? "#FF5555" : "#D9D9D9"
              return <MaterialIcons name="category" size={30} color={bgColor} />
            }
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Add List"
          component={AddList}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Add Category"
          component={AddCategory}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    )
  }

  return (
    <>
      {isLoading ? (
        <Box safeArea flex={1} alignItems="center" justifyContent="center">
          <Image
            source={loading}
            width={300}
            height={275}
            resizeMode="contain"
            alt="Loadng.png"
          />
        </Box>
      ) : state.isLogin ? (
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={BottomTab}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Detail List" component={DetailList} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Wellcome"
            component={Wellcome}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
    </>
  )
}
