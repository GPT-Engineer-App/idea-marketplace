import React, { useState, useEffect } from "react";
import { Box, Button, Container, Flex, Heading, Input, Stack, Text, Textarea, useToast, VStack } from "@chakra-ui/react";
import { FaPlus, FaLightbulb } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState({ title: "", description: "" });
  const toast = useToast();

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    const fetchedIdeas = await client.getWithPrefix("idea:");
    if (fetchedIdeas) {
      setIdeas(fetchedIdeas.map((idea) => idea.value));
    }
  };

  const handleInputChange = (e, field) => {
    setNewIdea({ ...newIdea, [field]: e.target.value });
  };

  const submitIdea = async () => {
    const key = `idea:${new Date().toISOString()}`;
    const success = await client.set(key, newIdea);
    if (success) {
      toast({
        title: "Idea added",
        description: "We've added your business idea!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setNewIdea({ title: "", description: "" });
      fetchIdeas();
    } else {
      toast({
        title: "Error",
        description: "There was a problem adding your idea.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" p={5}>
      <VStack spacing={8}>
        <Heading as="h1" size="xl">
          Business Idea Marketplace
        </Heading>
        <Flex width="full" justifyContent="space-between">
          <Stack spacing={4} width="full" maxW="md">
            <Input placeholder="Title of your idea" value={newIdea.title} onChange={(e) => handleInputChange(e, "title")} />
            <Textarea placeholder="Describe your idea" value={newIdea.description} onChange={(e) => handleInputChange(e, "description")} />
            <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={submitIdea}>
              Add Idea
            </Button>
          </Stack>
          <Box flex="1" ml={10}>
            {ideas.map((idea, index) => (
              <Box p={5} shadow="md" borderWidth="1px" key={index}>
                <Heading fontSize="xl">
                  {idea.title} <FaLightbulb />
                </Heading>
                <Text mt={4}>{idea.description}</Text>
              </Box>
            ))}
          </Box>
        </Flex>
      </VStack>
    </Container>
  );
};

export default Index;
