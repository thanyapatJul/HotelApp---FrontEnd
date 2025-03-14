import { useEffect, useState } from "react";
import api from "../../src/api";
import { Image as ChakraImage, HStack } from "@chakra-ui/react";
import StarRating from "../../components/Star"
import {
  useToast,
  Box,
  Text,
  SimpleGrid,
  Button,
  VStack,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [hotels, setHotels] = useState([]);

  const [filteredHotels, setFilteredHotels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const [priceRange, setPriceRange] = useState([500, 3000]);

  const navigate = useNavigate();
  const toast = useToast();

  const fetchUser = async () => {
    try {
      const response = await api.get("/checksession");
      setUser(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await api.get("/hotel/hotellist");
      setHotels(response.data);

      // Extract distinct locations
      const uniqueLocations = Array.from(
        new Set(response.data.map((hotel) => hotel.Location))
      ).sort(); 

      setLocations(uniqueLocations);
      setFilteredHotels(response.data);
    } catch (error) {
      console.error(
        "Error fetching hotels:",
        error.response?.data || error.message
      );
      toast({
        title: "Error",
        description: "Could not load hotels.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // for fetching
  useEffect(() => {
    fetchUser();
    fetchHotels();
  }, []);


  // for filter
  useEffect(() => {
    let filtered = hotels.filter(
      (hotel) =>
        (!selectedLocation || hotel.Location === selectedLocation) &&
        hotel.PricePerNight >= priceRange[0] &&
        hotel.PricePerNight <= priceRange[1]
    );
    setFilteredHotels(filtered);
  }, [selectedLocation, priceRange, hotels]);

  return (
    <VStack spacing={4} p={6}>



      <HStack spacing={6} w="full" mb={10}>
        <Box width="30%">
          <Text fontSize="sm" fontWeight="bold">
            Location:
          </Text>
          <Select
            placeholder="All Locations"
            onChange={(e) => setSelectedLocation(e.target.value)}
            value={selectedLocation}
            width="full"
          >
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </Select>
        </Box>

        <Box flex={1}>
          <Text fontSize="sm" fontWeight="bold">
            Price Range: {priceRange[0]} - {priceRange[1]} THB
          </Text>

          <RangeSlider
            aria-label={["min-price", "max-price"]}
            min={500}
            max={10000}
            step={100}
            value={priceRange}
            onChange={(val) => setPriceRange(val)} 
          >

            <RangeSliderTrack bg="gray.200">
              <RangeSliderFilledTrack bg="blue.500" />
            </RangeSliderTrack>


            <RangeSliderThumb index={0} boxSize={4} />

            <RangeSliderThumb index={1} boxSize={4} />
          </RangeSlider>
        </Box>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
        {filteredHotels.map((hotel) => (
          <Card key={hotel.ID} boxShadow="md" borderRadius="lg" bg="white">
            {hotel.Images.length > 0 && (
              <ChakraImage
                src={`http://localhost:8080/${hotel.Images[0]}`}
                alt={hotel.Name}
                objectFit="cover"
                width="100%"
                height="300px"
                borderTopRadius="lg"
              />
            )}
            <CardBody>
              <Heading fontSize="lg">{hotel.Name}</Heading>

              <StarRating rating={hotel.Rating} />


              <HStack spacing="20px" align="center" mt={3}>
                {" "}
                <Text>📍 {hotel.Location}</Text>
                <Text>🛏 {hotel.Rooms} Total rooms </Text>
                <Text>💰 {hotel.PricePerNight} THB per night</Text>
              </HStack>
            </CardBody>
            <CardFooter>
              <Button
                colorScheme="blue"
                w="full"
                onClick={() => navigate(`/book/${hotel.ID}`)} 
              >
                Book Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default HomePage;
