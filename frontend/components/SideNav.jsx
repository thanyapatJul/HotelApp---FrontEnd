import { useState } from "react";
import { Box, VStack, Button, Text, Flex, Spacer, IconButton } from "@chakra-ui/react";
import { FaHome, FaUser, FaHotel, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { SiHotelsdotcom } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const SideNav = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();

  return (
    <Box
      w={isExpanded ? "250px" : "80px"}
      h="100vh"
      bg="gray.900"
      color="gray.200"
      p={5}
      position="fixed"
      top={0}
      left={0}
      display="flex"
      flexDirection="column"
      transition="width 0.3s ease-in-out"
      alignItems={isExpanded ? "flex-start" : "center"}
    >
      <Flex align="center" justify={isExpanded ? "space-between" : "center"} mb={10} w="full">
        {isExpanded && <Text fontSize="xl" fontWeight="bold" color="white">Hotel Booking</Text>}
        <IconButton
          aria-label="Toggle Sidebar"
          icon={isExpanded ? <FaTimes /> : <FaBars />}
          variant="ghost"
          color="gray.300"
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </Flex>
      
      <Flex direction="column" flex="1" align={isExpanded ? "flex-start" : "center"} w="full">
        <VStack spacing={5} align={isExpanded ? "stretch" : "center"} w="full">
          <Button 
            leftIcon={<FaHome />} 
            variant="ghost" 
            w="full" 
            color="gray.300"
            justifyContent={isExpanded ? "flex-start" : "center"}
            _hover={{ bg: "gray.700", color: "white" }}
            onClick={() => navigate("/homepage")}
          >
            {isExpanded && "Home"}
          </Button>
        </VStack>

        <Spacer />

        <Button
          leftIcon={<FaSignOutAlt />}
          colorScheme="red"
          variant="ghost"
          w="full"
          justifyContent={isExpanded ? "flex-start" : "center"}
          _hover={{ bg: "red.600", color: "white" }}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          {isExpanded && "Logout"}
        </Button>
      </Flex>
    </Box>
  );
};

export default SideNav;
