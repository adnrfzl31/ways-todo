import { HStack, Text, Box, VStack, Menu, Image, Pressable } from "native-base"
import { useContext, useState } from "react"
import { UserContext } from "../../context/userContext"
import { useQuery } from "react-query"
import { API } from "../../confiq/Api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { showMessage } from "react-native-flash-message"
import avatar from "../../../assets/avatar.png"

export default function Header({ listCount }) {
  const [state, dispatch] = useContext(UserContext)
  const [shouldOverlapWithTrigger] = useState(false)

  let { data: list } = useQuery("listCache", async () => {
    let Response = await API.get("/List")
    return Response.data
  })

  let count = 0
  listCount
    ? (count = listCount.length)
    : list?.length > 0
    ? (count = list.length)
    : null

  const handleLogout = () => {
    AsyncStorage.removeItem("token")
    dispatch({
      type: "LOGOUT_SUCCESS",
    })
    showMessage({
      message: "Logout success!",
      type: "success",
    })
  }
  return (
    <Box w="full" safeArea>
      <HStack justifyContent="space-between" mx={5} py={5}>
        <VStack>
          <Text fontSize="2xl" fontWeight={700}>
            Hi, {state?.data?.user?.firstName}
          </Text>
          <HStack space={2}>
            <Text fontSize="lg" fontWeight={500} color="error.500">
              {count}
            </Text>
            <Text fontSize="lg" fontWeight={500} color="error.500">
              List
              {count > 1 ? "s" : null}
            </Text>
          </HStack>
        </VStack>
        <Menu
          w="160"
          shouldOverlapWithTrigger={shouldOverlapWithTrigger}
          placement={"bottom right"}
          trigger={(triggerProps) => {
            return (
              <Pressable
                borderRadius={100}
                p={2}
                variant="ghost"
                {...triggerProps}
              >
                <Image
                  size={12}
                  alignSelf="center"
                  source={avatar}
                  alt="icon.png"
                />
              </Pressable>
            )
          }}
        >
          <Menu.Item onPress={handleLogout}>Logout</Menu.Item>
        </Menu>
      </HStack>
    </Box>
  )
}
