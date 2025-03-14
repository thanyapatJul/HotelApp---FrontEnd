import { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Textarea,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    useToast,
} from "@chakra-ui/react";
import api from "../../src/api";
import StarRating from "../../components/Star";

const AddReviewModal = ({ isOpen, onClose, hotelId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/hotel/review",
        { 
            hotelId: Number(hotelId), 
            rating: Number(rating),  
            comment: comment
          },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Review Submitted",
        description: "Your review has been posted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onReviewAdded(); // Refresh reviews
      onClose();
    } catch (error) {
      console.error("Review Submission Error:", error.response?.data || error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.error || "Could not submit review.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Your Review</ModalHeader>
        <ModalBody>
          <FormControl>

            <StarRating rating={rating} />
            <Slider
              min={0}
              max={5}
              step={0.5}  
              value={rating}
              onChange={(val) => setRating(val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>
          <FormControl mt={3}>
            <FormLabel>Comment</FormLabel>
            <Textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddReviewModal;
