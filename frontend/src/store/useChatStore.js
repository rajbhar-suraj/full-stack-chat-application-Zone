import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    users: [],
    messages: [],
    isUsersLoading: false,
    isMessagesLoading: false,
    selectedUser: null,

    //for sidebar
    getUsers: async () => {

        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get('/messages/users')
            set({ users: res.data })

        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data })

        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessages: async (messageData) => {
        //try hiding this later on
        const { selectedUser, messages } = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({ messages: [...messages, res.data] })
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages: () => {
        const { selectedUser} = get()
        if (!selectedUser) return

        const socket = useAuthStore.getState().socket;
        socket.on(("newMessages"), (newMessages) => {
            if(selectedUser._id !== newMessages.senderId) return

            set({
                messages: [...get().messages, newMessages]
            })
        })
    },

    unSubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessages")

    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

}))
