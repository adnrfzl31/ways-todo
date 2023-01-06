import {
  Text,
  Box,
  Button,
  FormControl,
  Input,
  HStack,
  CloseIcon,
  Modal,
} from "native-base"
import { useMutation, useQuery } from "react-query"
import { API } from "../confiq/Api"
import { showMessage } from "react-native-flash-message"
import { useEffect, useState } from "react"
import Header from "../component/header/Header"

export default function AddCategory() {
  const [dataCategory, setDataCategory] = useState({
    name: "",
  })

  let { data: category, refetch } = useQuery("categoryCache", async () => {
    let categoryResponse = await API.get("/Category")
    return categoryResponse.data
  })

  const handleChange = (name, value) => {
    setDataCategory({
      ...dataCategory,
      [name]: value,
    })
  }

  const categoryColor = [
    {
      index: 0,
      bgColor: "danger.500",
    },
    {
      index: 1,
      bgColor: "purple.500",
    },
    {
      index: 2,
      bgColor: "green.500",
    },
    {
      index: 3,
      bgColor: "primary.500",
    },
    {
      index: 4,
      bgColor: "warning.500",
    },
  ]

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault()
    try {
      if (dataCategory.name.trim() == "") {
        return showMessage({
          message: "Category name cannot be empty!",
          type: "danger",
        })
      }
      const response = await API.post("/Category", dataCategory)
      showMessage({
        message: "Category successfully added!",
        type: "success",
      })
      setDataCategory({
        name: "",
      })
      refetch()
    } catch (err) {
      showMessage({
        message: "Failed to add category!",
        type: "danger",
      })
    }
  })

  const [confirmDelete, setConfirmDelete] = useState(null)
  const [idDelete, setIdDelete] = useState(null)
  const [open, setOpen] = useState(false)

  const openModal = (id) => {
    setOpen(true)
    setIdDelete(id)
  }

  const deleteById = async (id) => {
    await API.delete(`/Category/${id}`)
    refetch()
  }

  useEffect(() => {
    if (confirmDelete) {
      setOpen(false)
      deleteById(idDelete)
      setConfirmDelete(null)
    }
  }, [confirmDelete])

  return (
    <Box alignItems="center" justifyContent="center" safeArea>
      <Header />

      <Box w="90%">
        <Box w="100%">
          <Text fontSize="4xl" fontWeight={700} my={2}>
            Add Category
          </Text>
          <FormControl w="100%" mt={3}>
            <Input
              p={2}
              w="100%"
              bg="muted.200"
              fontSize={15}
              borderWidth={2}
              borderRadius={8}
              borderColor="muted.400"
              placeholder="Name"
              value={dataCategory.name}
              onChangeText={(value) => handleChange("name", value)}
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
              Add Category
            </Button>
          </FormControl>
        </Box>

        <Box mt={10} w="100%">
          <Text fontSize="4xl" fontWeight={700} my={2}>
            Add Category
          </Text>
          <Box
            mt={3}
            display="flex"
            flexDirection="row"
            w="100%"
            flexWrap="wrap"
          >
            {category?.map((item, i) => {
              return (
                <Box
                  key={item._id}
                  py={1}
                  pl={4}
                  pr={2}
                  m={2}
                  borderRadius={10}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={
                    categoryColor?.find(
                      (item) =>
                        item.index ===
                        i % (Object.keys(categoryColor).length - 1)
                    ).bgColor
                  }
                >
                  <HStack space={3}>
                    <Text fontSize="sm" fontWeight={700} color="white">
                      {item.name}
                    </Text>
                    <CloseIcon
                      size="5"
                      color="white"
                      onPress={() => openModal(item._id)}
                    />
                  </HStack>
                  <Modal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    safeAreaTop={true}
                  >
                    <Modal.Content maxWidth="350">
                      <Modal.CloseButton />
                      <Modal.Header w="100%">
                        <Text fontSize="md">Delete {item.name}</Text>
                      </Modal.Header>
                      <Modal.Body>
                        <FormControl>
                          <FormControl.Label>
                            <Text fontSize="md">
                              Are you sure you want to delete {item.name} ?
                            </Text>
                          </FormControl.Label>
                        </FormControl>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button.Group space={2}>
                          <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                              setOpen(false)
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onPress={() => {
                              setConfirmDelete(true)
                            }}
                          >
                            Delete
                          </Button>
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
