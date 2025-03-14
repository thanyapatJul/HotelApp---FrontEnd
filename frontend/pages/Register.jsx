import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast({
        title: "Error",
        description: "Username, email, and password are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post("http://localhost:8080/register", { username, email, password }); // ✅ Send email
      toast({
        title: "Success",
        description: "Registration successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "User already exists.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="50px" p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading as="h2" size="lg" textAlign="center" mb={4}>
        Register
      </Heading>
      <form onSubmit={handleRegister}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input 
              type="text" 
              placeholder="Enter username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel> {/* ✅ Add Email Field */}
            <Input 
              type="email" 
              placeholder="Enter email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input 
              type="password" 
              placeholder="Enter password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            Register
          </Button>
          <Button variant="link" colorScheme="blue" onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
