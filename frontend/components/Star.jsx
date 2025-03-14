import { Box, Text } from "@chakra-ui/react";
import { Star } from "lucide-react";

const StarRating = ({ rating }) => {
  return (
    <Box display="flex" alignItems="center">
      {Array.from({ length: 5 }).map((_, index) => (
        <Box key={index} position="relative" width="20px">
          <Star size={20} stroke="gold" fill="none" />
          {index < Math.floor(rating) && (
            <Star
              size={20}
              fill="gold"
              stroke="gold"
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          )}
          {index === Math.floor(rating) && rating % 1 !== 0 && (
            <Box position="absolute" top={0} left={0} width="50%" overflow="hidden">
              <Star size={20} fill="gold" stroke="gold" />
            </Box>
          )}
        </Box>
      ))}
      <Text ml={2}>{rating.toFixed(1)} / 5</Text>
    </Box>
  );
};

export default StarRating;
