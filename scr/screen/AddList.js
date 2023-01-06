import {
  HStack,
  Text,
  Box,
  Button,
  FormControl,
  Input,
  Select,
  CheckIcon,
  TextArea,
  Pressable,
} from "native-base"
import { useState } from "react"
import { useMutation, useQuery } from "react-query"
import { API } from "../confiq/Api"
import { showMessage } from "react-native-flash-message"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import Header from "../component/header/Header"

export default function AddList() {
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState("date")
  const [show, setShow] = useState(false)
  const [text, setText] = useState("Choose Date")

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(false)
    setDate(currentDate)

    let tempDate = new Date(currentDate)
    let formatDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear()
    setText(formatDate)
  }

  const showMode = (currentDate) => {
    setShow(true)
    setMode(currentDate)
  }

  const [dataList, setDataList] = useState({
    name: "",
    date: "",
    description: "",
    category: "",
    status: 0,
  })

  let { data: category } = useQuery("categoryCache", async () => {
    let categoryResponse = await API.get("/Category")
    return categoryResponse.data
  })

  let { data: list, refetch: listRefetch } = useQuery(
    "listCaches",
    async () => {
      let listResponse = await API.get("/List")
      return listResponse.data
    }
  )

  const handleChange = (name, value) => {
    setDataList({
      ...dataList,
      [name]: value,
    })
  }

  const handleSubmit = useMutation(async (e) => {
    // e.preventDefault()
    try {
      if (dataList.name.trim() == "" || dataList.name.trim() == null) {
        return showMessage({
          message: "List name cannot be empty!",
          type: "danger",
        })
      }

      if (dataList.description == "" || dataList.description == null) {
        return showMessage({
          message: "List description cannot be empty!",
          type: "danger",
        })
      }

      const listData = {
        name: dataList.name,
        date: date,
        description: dataList.description,
        category: dataList.category,
        status: 0,
      }

      const response = await API.post("/List", listData)
      showMessage({
        message: "List successfully added!",
        type: "success",
      })
      setDataList({
        name: "",
        date: "",
        description: "",
        category: "",
        status: 0,
      })
      listRefetch()
    } catch (err) {
      showMessage({
        message: "Failed to add list!",
        type: "danger",
      })
    }
  })

  return (
    <Box alignItems="center" justifyContent="center">
      <Header listCount={list} />
      <Box w="90%">
        <Text fontSize="4xl" fontWeight={700} my={2}>
          Add List
        </Text>
        <FormControl w="100%" mt={3}>
          <Input
            bg="muted.200"
            w="100%"
            p={2}
            fontSize={15}
            borderWidth={2}
            borderRadius={8}
            borderColor="muted.400"
            placeholder="Name"
            value={dataList.name}
            onChangeText={(value) => handleChange("name", value)}
          />

          <Select
            mt={3}
            bg="muted.200"
            minWidth="200"
            fontSize={15}
            borderWidth={2}
            borderRadius={8}
            borderColor="muted.400"
            placeholder="Select category..."
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            defaultValue={dataList.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            {category?.map((item, i) => (
              <Select.Item label={item?.name} value={item?._id} key={i} />
            ))}
          </Select>
          <Pressable
            p={3}
            h={47}
            mt={3}
            bg="muted.200"
            fontSize={15}
            borderWidth={2}
            borderRadius={8}
            borderColor="muted.400"
            title="DatePicker"
            onPress={() => showMode("date")}
          >
            <HStack justifyContent="space-between">
              <Text fontSize={15} color="blueGray.400">
                {text}
              </Text>
              <Text color="blueGray.400">
                <Ionicons name="calendar-outline" size={25} />
              </Text>
            </HStack>
          </Pressable>
          <TextArea
            w="100%"
            h={100}
            py={3}
            my={2}
            bg="muted.200"
            fontSize={15}
            borderWidth={2}
            borderRadius={8}
            borderColor="muted.400"
            placeholder="Description"
            value={dataList.description}
            onChangeText={(value) => handleChange("description", value)}
          />

          <Button
            bg="error.500"
            onPress={(e) => handleSubmit.mutate(e)}
            _pressed={{ backgroundColor: "error.600" }}
            _hover={{ backgroundColor: "error.600" }}
            _text={{ color: "white", fontWeight: "700" }}
            w="100%"
            p={2}
            mt={5}
          >
            Add List
          </Button>
        </FormControl>
        {show && (
          <DateTimePicker
            testId="dateTimePicker"
            value={date}
            mode={mode}
            in24Hours={true}
            display="default"
            onChange={onChangeDate}
          />
        )}
      </Box>
    </Box>
  )
}
