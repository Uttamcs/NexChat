import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    
    // Create temporary message with loading state
    const tempMessage = {
      _id: Date.now().toString(),
      text: messageData.text,
      image: messageData.image,
      senderId: useAuthStore.getState().authUser._id,
      receiverId: selectedUser._id,
      createdAt: new Date().toISOString(),
      isLoading: true
    };
    
    // Add message immediately to UI
    set({ messages: [...messages, tempMessage] });
    
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      // Replace temp message with real message
      set({ 
        messages: messages.map(msg => 
          msg._id === tempMessage._id ? res.data : msg
        ).concat(res.data._id !== tempMessage._id ? [res.data] : [])
      });
    } catch (error) {
      // Remove temp message on error
      set({ messages: messages.filter(msg => msg._id !== tempMessage._id) });
      toast.error(error.response.data.message);
    }
  },

  deleteMessage: async (messageId) => {
    const { messages } = get();
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set({ messages: messages.filter(msg => msg._id !== messageId) });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    socket.on("messageDeleted", (messageId) => {
      set({
        messages: get().messages.filter(msg => msg._id !== messageId),
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeleted");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
