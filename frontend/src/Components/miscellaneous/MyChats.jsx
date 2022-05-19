import React, { useState, useEffect } from "react";
import { ChatState } from "../context/chatProvider";
import ChatLoading from "./ChatLoading";
import { Button, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Text, Stack } from "@chakra-ui/react";
import { getSender } from "../config/ChatLogic";
import axios from "axios";
import GroupChatModal from "./GroupChatModal";
const MyChats = ({fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
 
     console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: `Failed to Load the Chats ${user.name}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
       
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
        <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
       </Box>
       <Box
         d="flex"
         flexDir="column"
         p={3}
         bg="#F8F8F8"
         w="100%"
         h="100%"
         borderRadius="lg"
         overflowY="hidden"
       >
        
      {
        chats.length > 0 ? (
          <Stack overflowY="scroll">
          {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
               
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )
      }
       </Box>
    </Box>
  );
};

export default MyChats;
