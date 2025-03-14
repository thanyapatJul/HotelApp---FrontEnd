import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../src/api";
import { FaArrowLeft } from "react-icons/fa";
import { Image as ChakraImage, HStack } from "@chakra-ui/react";
import StarRating from "../../components/Star";
import ReviewCard from "../../components/ReiewCard";
import AddReviewModal from "./ReviewModal";
import {
  Box,
  Text,
  VStack,
  useToast,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import BookingInvoiceModal from "./InvoiceModal";
const BookCalendar = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Modal state
  const [selectedDates, setSelectedDates] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isReviewOpen,
    onOpen: onReviewOpen,
    onClose: onReviewClose,
  } = useDisclosure();
  const toast = useToast();
  // Form state
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");

  // Time state
  const [checkInTime, setCheckInTime] = useState("10:00");
  const [checkOutTime, setCheckOutTime] = useState("10:00");

  const fetchHotelData = async () => {
    try {
      const response = await api.get(`/hotel/${hotelId}`);
      setHotel(response.data);
    } catch (error) {
      console.error(
        "Error fetching hotel:",
        error.response?.data || error.message
      );
    }
  };

  const fetchHotelReview = async () => {
    try {
      const response = await api.get(`/hotel/review/${hotelId}`);
      setReviews(response.data);
    } catch (error) {
      console.error(
        "Error fetching hotel:",
        error.response?.data || error.message
      );
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get(`/hotel/bookings/${hotelId}`);
      const formattedBookings = response.data.map((booking) => ({
        title: booking.isMine ? "My Booking" : "Booked",
        start: moment.utc(booking.checkIn).toISOString(),
        end: moment.utc(booking.checkOut).toISOString(),
        backgroundColor: booking.isMine ? "blue.400" : "gray",
        borderColor: booking.isMine ? "blue.400" : "gray",
        userId: booking.userId,
      }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error(
        "Error fetching bookings:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchHotelData();
    fetchBookings();
    fetchHotelReview();
  }, []);

  const confirmBooking = async () => {
    if (!selectedDates || !checkInTime || !checkOutTime) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates and times.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const checkInDateTime = `${selectedDates.checkIn} ${checkInTime}`;
      const checkOutDateTime = `${selectedDates.checkOut} ${checkOutTime}`;

      console.log("Raw Check-in DateTime:", checkInDateTime);
      console.log("Raw Check-out DateTime:", checkOutDateTime);

      // Convert to ISO 8601 format "2025-03-05T10:00:00.000Z"
      const formattedCheckIn = moment(
        checkInDateTime,
        "YYYY-MM-DD HH:mm"
      ).toISOString();

      const formattedCheckOut = moment(
        checkOutDateTime,
        "YYYY-MM-DD HH:mm"
      ).toISOString();

      console.log("Formatted Check-in:", formattedCheckIn);
      console.log("Formatted Check-out:", formattedCheckOut);

      await api.post(
        "/hotel/book",
        {
          hotelId: Number(hotelId),
          checkIn: formattedCheckIn,
          checkOut: formattedCheckOut,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Booking Confirmed",
        description: `Your booking from ${formattedCheckIn} to ${formattedCheckOut} is confirmed!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setBookings([
        ...bookings,
        {
          title: "My Booking",
          start: formattedCheckIn,
          end: formattedCheckOut,
          backgroundColor: "blue",
          borderColor: "blue",
          userId: localStorage.getItem("userId"),
        },
      ]);

      onClose();
    } catch (error) {
      console.error("Booking Error:", error.response?.data || error);
      toast({
        title: "Booking Failed",
        description: error.response?.data?.error || "Could not book hotel.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const checkRoomAvailability = (start, end) => {
    if (!hotel) return false;

    const overlappingBookings = bookings.filter(
      (booking) =>
        moment(start).isBefore(booking.end) &&
        moment(end).isAfter(booking.start)
    );

    return overlappingBookings.length < hotel.Rooms; // Booking room exceed the room limit
  };

  const handleDateSelect = (selectionInfo) => {
    const isAvailable = checkRoomAvailability(
      selectionInfo.startStr,
      selectionInfo.endStr
    );

    if (!isAvailable) {
      toast({
        title: "Booking Unavailable",
        description: "No rooms available for the selected dates.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSelectedDates({
      checkIn: moment.utc(selectionInfo.startStr).toISOString(),
      checkOut: moment
        .utc(selectionInfo.endStr)
        .subtract(1, "days")
        .toISOString(),
    });
    onOpen();
  };

  return (
    <VStack spacing={4} p={6} width="100%" height="100vh">
      {hotel ? (
        <Box
          position="relative"
          p={6}
          bg="gray.100"
          w="full"
          textAlign="left"
          borderRadius="lg"
        >
          <Button
            position="absolute"
            size="xs"
            colorScheme="blue"
            onClick={() => navigate("/")}
            leftIcon={<FaArrowLeft />}
          >
            Back
          </Button>

          <HStack
            alignItems="flex-start"
            spacing={6}
            mt={8}
            width="100%"
            flexWrap="wrap"
            justifyContent="flex-start"
          >
            <ChakraImage
              src={`http://localhost:8080/${hotel.Images[0]}`}
              alt={hotel.Name}
              objectFit="cover"
              width={{ base: "100%", md: "50%", lg: "40%" }}
              height={{ base: "200px", md: "300px", lg: "350px" }}
              borderRadius="lg"
            />
            <VStack align="start" spacing={2}>
              <Text fontSize="2xl" fontWeight="bold">
                {hotel.Name}
              </Text>
              <StarRating rating={hotel.Rating} />
              <Text>📍 {hotel.Location}</Text>
              <Text>💰 {hotel.PricePerNight} THB per night</Text>
              <Text>🛏 Max rooms per day: {hotel.Rooms}</Text>
            </VStack>
            <ReviewCard reviews={reviews} onOpen={onReviewOpen} />
          </HStack>
        </Box>
      ) : (
        <Text>Loading hotel details...</Text>
      )}

      <Box width="100%" height="100%" flexGrow={1}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          selectMirror={true}
          select={handleDateSelect}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={bookings}
          height="100%"
        />
      </Box>

      <BookingInvoiceModal
        isOpen={isOpen}
        onClose={onClose}
        hotel={hotel}
        selectedDates={selectedDates}
        checkInTime={checkInTime}
        setCheckInTime={setCheckInTime}
        checkOutTime={checkOutTime}
        setCheckOutTime={setCheckOutTime}
        name={name}
        setName={setName}
        telephone={telephone}
        setTelephone={setTelephone}
        email={email}
        setEmail={setEmail}
        confirmBooking={confirmBooking}
      />

      <AddReviewModal
        isOpen={isReviewOpen}
        onClose={onReviewClose}
        hotelId={hotelId}
        onReviewAdded={fetchHotelReview} 
      />
      
    </VStack>
  );
};

export default BookCalendar;
