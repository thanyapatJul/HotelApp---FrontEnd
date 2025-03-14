import {
  Box,
  Text,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import moment from "moment";

const BookingInvoiceModal = ({
  isOpen,
  onClose,
  hotel,
  selectedDates,
  checkInTime,
  setCheckInTime,
  checkOutTime,
  setCheckOutTime,
  name,
  setName,
  telephone,
  setTelephone,
  email,
  setEmail,
  confirmBooking,
}) => {
  const toast = useToast();

  // Validation errors state
  const [errors, setErrors] = useState({
    name: "",
    telephone: "",
    email: "",
  });

  // Validation function
  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", telephone: "", email: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (!telephone.trim() || telephone.length < 10) {
      newErrors.telephone =
        "Valid telephone number is required (min 10 digits).";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirmBooking = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Combine date and time
    const formattedCheckIn = moment(
      `${selectedDates?.checkIn} ${checkInTime}`,
      "YYYY-MM-DD HH:mm"
    ).format("YYYY-MM-DD HH:mm");

    const formattedCheckOut = moment(
      `${selectedDates?.checkOut} ${checkOutTime}`,
      "YYYY-MM-DD HH:mm"
    ).format("YYYY-MM-DD HH:mm");

    confirmBooking({
      name,
      telephone,
      email,
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
      hotel,
      totalPrice,
    });
    console.log(confirmBooking)
  };

  const nights = moment(selectedDates?.checkOut, "YYYY-MM-DD").diff(
    moment(selectedDates?.checkIn, "YYYY-MM-DD"),
    "days"
  );
  const totalPrice = hotel?.PricePerNight * nights || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">📜 Booking Invoice</ModalHeader>
        <Divider />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Hotel Details */}
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                🏨 {hotel?.Name}
              </Text>
              <Text>📍 Location: {hotel?.Location}</Text>
            </Box>

            <HStack spacing={4}>
              <Box
                border="2px"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
                w="full"
              >
                <Text fontSize="lg">📅 Check-In Date:</Text>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  w="full"
                >
                  <Badge fontSize="md" p={2} borderRadius="md">
                    {moment(selectedDates?.checkIn).format("DD-MM-YYYY")}
                  </Badge>
                </Box>
                <FormControl mt={3}>
                  <FormLabel>Check-In Time</FormLabel>
                  <Input
                    min="00:00"
                    max="23:59"
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                  />
                </FormControl>
              </Box>

              <Box
                border="2px"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
                w="full"
              >
                <Text fontSize="lg">📅 Check-Out Date: </Text>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  w="full"
                >
                  <Badge fontSize="md" p={2} borderRadius="md">
                    {moment(selectedDates?.checkOut).format("DD-MM-YYYY")}
                  </Badge>
                </Box>
                <FormControl mt={3}>
                  <FormLabel>Check-Out Time</FormLabel>
                  <Input
                    type="time"
                    min="00:01"
                    max="23:59"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                  />
                </FormControl>
              </Box>
            </HStack>
            <Box
              border="2px"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
              borderStyle="dashed"
              w="full"
              textAlign="center"
            >
              <Text fontSize="lg" fontWeight="semibold">
                Total: {totalPrice.toLocaleString()} THB
              </Text>
            </Box>

            <Box>
              <Text fontSize="lg" fontWeight="bold" mt={4}>
                👤 Guest Information
              </Text>
              <FormControl mt={3} isInvalid={errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Text color="red.500" fontSize="sm">
                  {errors.name}
                </Text>
              </FormControl>

              <FormControl mt={3} isInvalid={errors.telephone}>
                <FormLabel>Telephone</FormLabel>
                <Input
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
                <Text color="red.500" fontSize="sm">
                  {errors.telephone}
                </Text>
              </FormControl>

              <FormControl mt={3} isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Text color="red.500" fontSize="sm">
                  {errors.email}
                </Text>
              </FormControl>
            </Box>
          </VStack>
        </ModalBody>

        <Divider />


        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleConfirmBooking}>
            ✅ Confirm Booking
          </Button>
          <Button colorScheme="red" onClick={onClose}>
            ❌ Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookingInvoiceModal;
