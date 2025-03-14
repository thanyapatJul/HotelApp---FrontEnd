import { Box, Text, Button, HStack } from "@chakra-ui/react";
import StarRating from "./Star";

const ReviewCard = ({ reviews, onOpen }) => {
  return (
    <Box
      width={{ base: "100%", md: "45%", lg: "30%" }}
      bg="gray.50"
      p={4}
      borderRadius="lg"
      shadow="md"
    >
      <HStack>
        <Text fontSize="xl" fontWeight="bold">
          Reviews
        </Text>
        <Button ms={2} size="xs" colorScheme="blue" onClick={onOpen}>
          + Add Review
        </Button>
      </HStack>

      <Box
        maxHeight="280"
        minHeight="150px"
        overflowY="auto"
      >
        {reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Box key={index} p={3} borderBottom="1px solid #ddd">
              <Text fontWeight="bold">{review.username}</Text>
              <StarRating rating={review.rating} />
              <Text mt={2}>{review.comment}</Text>
            </Box>
          ))
        ) : (
          <Text>No reviews yet.</Text>
        )}
      </Box>
    </Box>
  );
};

export default ReviewCard;
