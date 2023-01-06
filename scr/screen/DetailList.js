import { AntDesign, FontAwesome } from "@expo/vector-icons"
import { Box, Button, Text, Stack, HStack, VStack, FlatList } from "native-base"
import { showMessage } from "react-native-flash-message"
import { useQuery } from "react-query"
import { API } from "../confiq/Api"
import moment from "moment"

export default function Detail({ route, navigation }) {
  let { listId, listBgColor, categoryBgColor, categoryName } = route.params

  let { data: list, refetch: listRefetchs } = useQuery(
    "listDetailCaches",
    async () => {
      let listResponse = await API.get(`/List/${listId}`)
      return listResponse.data
    }
  )

  let { data: lists, refetch: listRefetch } = useQuery(
    "listCaches",
    async () => {
      let listResponse = await API.get("/List")
      return listResponse.data
    }
  )

  const handleUpdateIsDone = async (e, id, current_status) => {
    e.preventDefault()
    try {
      await API.patch(`/List/${id}`, {
        status: current_status == 0 ? 1 : 0,
      })
      listRefetch()
      listRefetchs()
    } catch (err) {
      showMessage({
        message: "Failed to change status todo!",
        type: "danger",
      })
    }
  }

  return (
    <Box maxH={"76%"}>
      <Stack m={"4"} w={"93%"} rounded="2xl" space={1} bg={listBgColor}>
        <HStack justifyContent={"space-between"} p="3" pb={0}>
          <Box justifyContent={"center"} m={"2"} w={"50%"}>
            <Text
              fontSize={"3xl"}
              fontWeight="bold"
              textDecorationLine={list?.status == 0 ? "none" : "line-through"}
            >
              {list?.name}
            </Text>
          </Box>
          <VStack w="32" m={"2"}>
            <Box
              p={1}
              borderRadius={10}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={categoryBgColor}
            >
              <Text color="white" fontWeight="bold">
                {categoryName}
              </Text>
            </Box>
            <Button
              bg={listBgColor}
              borderRadius={100}
              _hover={{ backgroundColor: { listBgColor } }}
              _pressed={{ backgroundColor: { listBgColor } }}
              mt={1}
              onPress={(e) => handleUpdateIsDone(e, list?._id, list?.status)}
            >
              {list?.status ? (
                <AntDesign name="checkcircle" size={42} color="green" />
              ) : (
                <>
                  <Button
                    bg={list?.status ? "white" : "muted.200"}
                    borderRadius={100}
                    _hover={{ backgroundColor: "muted.300" }}
                    _pressed={{ backgroundColor: "muted.400" }}
                    w={50}
                    h={50}
                    onPress={(e) =>
                      handleUpdateIsDone(e, list?._id, list?.status)
                    }
                  ></Button>
                </>
              )}
            </Button>
          </VStack>
        </HStack>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text
              fontSize={"xs"}
              mx="6"
              textAlign="justify"
              color={"gray.600"}
              textDecorationLine={list?.status == 0 ? "none" : "line-through"}
            >
              {list?.description}
            </Text>
          }
          renderItem={() => {
            list?.description
          }}
        />
        <Box mx={"6"} my={"3"}>
          <HStack alignItems={"center"}>
            <FontAwesome
              name="calendar"
              size={15}
              color="muted.500"
              style={{ marginRight: 5 }}
            />
            <Text
              textDecorationLine={list?.status == 0 ? "none" : "line-through"}
            >
              {moment(list?.date).format("dddd, DD MMMM YYYY")}
            </Text>
          </HStack>
        </Box>
      </Stack>
    </Box>
  )
}
