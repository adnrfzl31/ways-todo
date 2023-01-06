import { Image, HStack, Text, Box, Button } from "native-base"
import WelcomeImage from "../../assets/png/wellcome.png"

export default function Wellcome({ navigation }) {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Image
        width={300}
        height={300}
        resizeMode="contain"
        source={WelcomeImage}
        alt="Wellcome.png"
      />
      <HStack space={2} mb={3}>
        <Text fontSize="4xl" fontWeight={700}>
          Ways
        </Text>
        <HStack>
          <Text fontSize="4xl" fontWeight={700} color="#B82020">
            To
          </Text>
          <Text fontSize="4xl" fontWeight={700} color="#FF5555">
            DO
          </Text>
        </HStack>
      </HStack>
      <Text fontSize={15} fontWeight={500} mx={10} mb={10} textAlign="center">
        Write your activity and finish your activity. Fast, Simple and Easy to
        Use
      </Text>
      <Box w="80%" my={10}>
        <Button
          bg="error.500"
          onPress={() => navigation.push("Login")}
          _pressed={{ backgroundColor: "error.600" }}
          _hover={{ backgroundColor: "error.600" }}
          _text={{ color: "white", fontWeight: "700" }}
          w="100%"
          p={2}
        >
          Login
        </Button>
        <Button
          bg="muted.400"
          onPress={() => navigation.push("Register")}
          _pressed={{ backgroundColor: "muted.500" }}
          _hover={{ backgroundColor: "muted.500" }}
          _text={{ color: "white", fontWeight: "700" }}
          w="100%"
          p={2}
          my={3}
        >
          Register
        </Button>
      </Box>
    </Box>
  )
}
