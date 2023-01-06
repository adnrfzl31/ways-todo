import {
  Image,
  HStack,
  Text,
  Box,
  Button,
  FormControl,
  Input,
} from "native-base"
import LoginImage from "../../../assets/png/AuthImage.png"
import { useContext, useState } from "react"
import { UserContext } from "../../context/userContext"
import { useMutation } from "react-query"
import { API } from "../../confiq/Api"
import { showMessage } from "react-native-flash-message"

export default function Login({ navigation }) {
  const [state, dispatch] = useContext(UserContext)
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  })

  const handleChange = (name, value) => {
    setDataLogin({
      ...dataLogin,
      [name]: value,
    })
  }

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault()
    try {
      const response = await API.post("/auth/login", dataLogin)
      const payload = response.data
      if (response?.status === 200) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload,
        })
        showMessage({
          message: "Login berhasil!",
          type: "success",
        })
      }
      navigation.navigate("Main")
    } catch (err) {
      showMessage({
        message: "Email / password salah!",
        type: "danger",
      })
    }
  })
  return (
    <Box flex={1} alignItems="center" justifyContent="center" safeArea>
      <Image
        width={300}
        height={275}
        resizeMode="contain"
        source={LoginImage}
        alt="Auth.png"
      />
      <Box w="80%">
        <Text fontSize="4xl" fontWeight={700} my={3}>
          Login
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
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(value) => handleChange("email", value)}
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
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={(value) => handleChange("password", value)}
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
            Login
          </Button>
        </FormControl>
        <Box alignItems="center" mt={3}>
          <HStack>
            <Text fontWeight={500}>New User ?</Text>
            <Text
              mx={2}
              fontWeight={700}
              color="#FF5555"
              onPress={() => navigation.push("Register")}
            >
              Register
            </Text>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}
