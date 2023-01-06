import {
  Image,
  HStack,
  Text,
  Box,
  Button,
  FormControl,
  Input,
} from "native-base"
import { useState } from "react"
import { useMutation } from "react-query"
import { showMessage } from "react-native-flash-message"
import { API } from "../../confiq/Api"
import RegisterImage from "../../../assets/png/AuthImage.png"

export default function Register({ navigation }) {
  const [dataRegister, setDataRegister] = useState({
    email: "",
    firstName: "",
    password: "",
  })

  const handleChange = (name, value) => {
    setDataRegister({
      ...dataRegister,
      [name]: value,
    })
  }

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault()
    try {
      if (
        dataRegister.email.trim() === "" ||
        dataRegister.email.trim() === null
      ) {
        return showMessage({
          message: "Register failed!",
          description: "Email cannot be empty!",
          type: "danger",
        })
      }

      if (
        dataRegister.firstName.trim() === "" ||
        dataRegister.firstName.trim() === null
      ) {
        return showMessage({
          message: "Register failed!",
          description: "Name cannot be empty!",
          type: "danger",
        })
      }

      if (dataRegister.password === "" || dataRegister.password === null) {
        return showMessage({
          message: "Register failed!",
          description: "Password cannot be empty!",
          type: "danger",
        })
      }

      const response = await API.post(
        "/auth/register",
        {
          email: dataRegister.email.trim(),
          firstName: dataRegister.firstName.trim(),
          password: dataRegister.password,
        },
        {
          validateStatus: () => true,
        }
      )

      if (response.status === 400) {
        return showMessage({
          message: "Register failed!",
          description: `${response.data.message}`,
          type: "danger",
        })
      }

      showMessage({
        message: "Register successful! Please Login",
        type: "success",
      })

      navigation.push("Login")
    } catch (err) {
      return showMessage({
        message: "Register failed!",
        description: `${err}`,
        type: "danger",
      })
    }
  })

  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="center"
      safeArea
    >
      <Image
        width={300}
        height={275}
        resizeMode="contain"
        source={RegisterImage}
        alt="Auth.png"
      />
      <Box w="80%">
        <Text fontSize="4xl" fontWeight={700} my={3}>
          Register
        </Text>

        <FormControl w="100%">
          <Input
            p={2}
            w="100%"
            bg="muted.200"
            fontSize={15}
            borderWidth={2}
            borderRadius={8}
            borderColor="muted.400"
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={(value) => handleChange("email", value)}
            value={dataRegister?.email}
          />
          <Input
            mt={3}
            p={2}
            w="100%"
            bg="muted.200"
            fontSize={15}
            borderWidth={2}
            borderRadius={8}
            borderColor="muted.400"
            placeholder="Fullname"
            onChangeText={(value) => handleChange("firstName", value)}
            value={dataRegister?.firstName}
          />

          <Input
            p={2}
            mt={3}
            w="100%"
            bg="muted.200"
            fontSize={15}
            borderWidth={2}
            borderRadius={8}
            borderColor="muted.400"
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(value) => handleChange("password", value)}
            value={dataRegister?.password}
          />
          <Button
            bg="error.500"
            onPress={(e) => handleSubmit.mutate(e)}
            _hover={{ backgroundColor: "error.600" }}
            _text={{ color: "white", fontWeight: "700" }}
            w="100%"
            p={2}
            mt={5}
          >
            Register
          </Button>
        </FormControl>
        <Box alignItems="center" mt={3}>
          <HStack>
            <Text fontWeight={500}>Joined us before ?</Text>
            <Text
              mx={2}
              fontWeight={700}
              color="#FF5555"
              onPress={() => navigation.push("Login")}
            >
              Login
            </Text>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}
