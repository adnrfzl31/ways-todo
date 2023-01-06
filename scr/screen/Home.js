import { AntDesign, FontAwesome } from "@expo/vector-icons"
import moment from "moment"
import {
  Box,
  Button,
  Center,
  FlatList,
  Input,
  Modal,
  Pressable,
  Select,
  Text,
} from "native-base"
import { useEffect, useState } from "react"
import { showMessage } from "react-native-flash-message"
import { useQuery } from "react-query"
import { API } from "../confiq/Api"
import Header from "../component/header/Header"

export default function List({ navigation }) {
  const [showModalFilter, setShowModalFilter] = useState(false)
  const [dataFilter, setDataFilter] = useState({
    search: "",
    date: "",
    category: "",
    status: "",
  })

  const [tempDataFilter, setTempDataFilter] = useState({
    date: "",
    category: "",
    status: "",
  })

  const todoColor = [
    {
      index: 0,
      bgColor: "primary.200",
    },
    {
      index: 1,
      bgColor: "green.200",
    },
    {
      index: 2,
      bgColor: "danger.200",
    },
    {
      index: 3,
      bgColor: "warning.200",
    },
    {
      index: 4,
      bgColor: "purple.200",
    },
  ]

  const categoryColor = [
    {
      index: 0,
      bgColor: "#155263",
    },
    {
      index: 1,
      bgColor: "#FF6F3C",
    },
    {
      index: 2,
      bgColor: "#FF9A3C",
    },
    {
      index: 3,
      bgColor: "#FFC93C",
    },
    {
      index: 4,
      bgColor: "danger.500",
    },
  ]

  let { data: list, refetch: listRefetch } = useQuery(
    "listCaches",
    async () => {
      let listResponse = await API.get("/List")
      return listResponse.data
    }
  )

  let { data: category } = useQuery("categoryCaches", async () => {
    let categoryResponse = await API.get("/Category")
    return categoryResponse.data
  })

  const cutSentence = (sentence, maxCharacter) => {
    return sentence.length > maxCharacter
      ? sentence.substring(0, maxCharacter) + "..."
      : sentence
  }

  const handleUpdateIsDone = async (e, id, current_status) => {
    e.preventDefault()
    try {
      await API.patch(`/List/${id}`, {
        status: current_status == 0 ? 1 : 0,
      })
      listRefetch()
    } catch (err) {
      showMessage({
        message: "Gagal mengubah status todo!",
        type: "danger",
      })
    }
  }

  useEffect(() => {
    listRefetch()
  }, [])

  const TodoComponent = (item, i) => {
    let listBgColor = todoColor?.find(
      (item) => item.index === i % todoColor.length
    )?.bgColor
    let categoryBgColor = categoryColor?.find(
      (item) => item.index === i % categoryColor.length
    )?.bgColor
    let categoryName = category?.find(
      (itemCategory) => itemCategory._id === item.category
    )?.name
    return (
      <Pressable
        bg={listBgColor}
        w={"100%"}
        borderRadius={10}
        display="flex"
        flexDirection="row"
        px={5}
        py={5}
        key={i}
        my={2}
        onPress={() =>
          navigation.navigate("Detail List", {
            listId: item._id,
            listBgColor,
            categoryBgColor,
            categoryName,
          })
        }
      >
        <Box flex={2}>
          <Text
            fontWeight="bold"
            fontSize={20}
            textDecorationLine={item.status == 0 ? "none" : "line-through"}
          >
            {cutSentence(item.name, 15)}
          </Text>
          <Text
            color="muted.500"
            flex={1}
            textDecorationLine={item.status == 0 ? "none" : "line-through"}
          >
            {cutSentence(item.description, 20)}
          </Text>
          <Text color="muted.500" display="flex" alignItems="center">
            <FontAwesome
              name="calendar"
              size={15}
              color="muted.500"
              style={{ marginRight: 5 }}
            />
            {moment(item.date).format(" DD MMMM YYYY")}
          </Text>
        </Box>
        <Box flex={1}>
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
          <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              bg={listBgColor}
              borderRadius={100}
              _hover={{ backgroundColor: { listBgColor } }}
              _pressed={{ backgroundColor: { listBgColor } }}
              mt={2}
              onPress={(e) => handleUpdateIsDone(e, item._id, item.status)}
            >
              {item.status ? (
                <AntDesign name="checkcircle" size={42} color="green" />
              ) : (
                <>
                  <Button
                    bg={item.status ? "white" : "muted.200"}
                    borderRadius={100}
                    _hover={{ backgroundColor: "muted.300" }}
                    _pressed={{ backgroundColor: "muted.400" }}
                    w={50}
                    h={50}
                    onPress={(e) =>
                      handleUpdateIsDone(e, item._id, item.status)
                    }
                  ></Button>
                </>
              )}
            </Button>
          </Box>
        </Box>
      </Pressable>
    )
  }

  const handleChangeTextFilter = (name, value) => {
    setDataFilter({
      ...dataFilter,
      [name]: value,
    })
  }

  const handleChangeTextTempFilter = (name, value) => {
    setTempDataFilter({
      ...tempDataFilter,
      [name]: value,
    })
  }

  return (
    <Box display="flex" flex={1} alignItems="center" bg="white">
      <Header />
      <Box display="flex" w={"85%"} flexDirection="column">
        <Box display="flex" flexDirection="row" w={"100%"}>
          <AntDesign className="" />
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Search List..."
            py={3}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            value={dataFilter.search}
            onChangeText={(value) => handleChangeTextFilter("search", value)}
          />
        </Box>
        <Box display="flex" flexDirection="column" w={"100%"}>
          <Button
            onPress={() => setShowModalFilter(true)}
            my={3}
            bg="error.500"
            borderRadius={8}
            _hover={{ backgroundColor: "error.600" }}
            _pressed={{ backgroundColor: "error.700" }}
          >
            <Text
              fontSize={15}
              fontWeight="bold"
              color="white"
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <AntDesign name="filter" size={20} color="white" /> Filter
            </Text>
          </Button>
          <Center>
            <Modal
              isOpen={showModalFilter}
              onClose={() => {
                setTempDataFilter({
                  ...tempDataFilter,
                  category: "",
                  status: "",
                })
                setShowModalFilter(false)
              }}
            >
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Filter</Modal.Header>
                <Modal.Body display="flex" flexDirection="column" w={"100%"}>
                  <Text>Category</Text>
                  <Select
                    defaultValue={dataFilter.category}
                    placeholder="Category"
                    h={50}
                    mt={2}
                    py={3}
                    flex={1}
                    bg="muted.200"
                    fontSize={15}
                    borderRadius="sm"
                    borderColor="muted.500"
                    _selectedItem={{
                      bg: "muted.500",
                    }}
                    onValueChange={(value) =>
                      handleChangeTextTempFilter("category", value)
                    }
                  >
                    <Select.Item label={"Semua"} value={""} />
                    {category?.map((item, i) => (
                      <Select.Item label={item.name} value={item._id} key={i} />
                    ))}
                  </Select>
                  <Text mt={2}>Status</Text>
                  <Select
                    defaultValue={dataFilter.status}
                    placeholder="Status"
                    h={50}
                    bg="muted.200"
                    py={3}
                    mt={2}
                    flex={1}
                    fontSize={15}
                    borderRadius="sm"
                    borderColor="muted.500"
                    _selectedItem={{
                      bg: "muted.500",
                    }}
                    onValueChange={(value) =>
                      handleChangeTextTempFilter("status", value)
                    }
                  >
                    <Select.Item label={"Semua"} value={""} />
                    <Select.Item label={"Belum"} value={"0"} />
                    <Select.Item label={"Selesai"} value={"1"} />
                  </Select>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setTempDataFilter({
                          ...tempDataFilter,
                          category: "",
                          status: "",
                        })
                        setShowModalFilter(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={() => {
                        setDataFilter({
                          ...dataFilter,
                          date: tempDataFilter.date,
                          category: tempDataFilter.category,
                          status: tempDataFilter.status,
                        })
                        setTempDataFilter({
                          ...tempDataFilter,
                          date: "",
                          category: "",
                          status: "",
                        })
                        setShowModalFilter(false)
                      }}
                    >
                      Save
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center>
        </Box>
      </Box>
      <Box w={"85%"} display="flex" flex={1}>
        {list ? (
          <FlatList
            data={
              !dataFilter.search &&
              !dataFilter.category &&
              !dataFilter.date &&
              !dataFilter.status
                ? list
                : list.filter((item) => {
                    if (dataFilter.search) {
                      return item.name
                        .toLowerCase()
                        .includes(dataFilter.search.toLowerCase())
                    }

                    if (dataFilter.date) {
                      return item.date.toString() == dataFilter.date.toString()
                    }

                    if (dataFilter.category) {
                      let categoryId = category.find(
                        (itemCategory) => itemCategory._id === item.category
                      )._id
                      return (
                        categoryId.toString() == dataFilter.category.toString()
                      )
                    }

                    if (dataFilter.status) {
                      return (
                        item.status.toString() == dataFilter.status.toString()
                      )
                    }
                  })
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => TodoComponent(item, index)}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  )
}
