import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAllNotifications = createAsyncThunk<Notification[]>("fetchAllNotifications", async () => {
    const response = await fetchWithAuth("http://localhost:8080/api/v1/notifications/");
    const data = await response.json();
    return data;
});

interface Notification {
    senderId: number,
    receiverId: number,
    subjectId: number,
    readStatus: boolean,
    title: String,
    description: String
}

interface NotificationState {
    notifications: Notification[],
    count: number,
    loading: boolean,
    error: boolean
}

const initialState: NotificationState = {
    notifications: [],
    count: 0,
    loading: false,
    error: false
}

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        // Reducer to add a notification
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.count += 1; // Increase the count as a new notification is added
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllNotifications.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchAllNotifications.fulfilled, (state, action) => {
            state.loading = false;
            state.error = false;
            state.notifications = action.payload;
            state.count = action.payload.length;
        });
        builder.addCase(fetchAllNotifications.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            console.log(action.payload);
        });
    }
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;