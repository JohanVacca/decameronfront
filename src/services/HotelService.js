import { environment } from "../environments/environment";

const handleResponses = async(response) => {
    if(!response.ok) {
        const res = await response.json();
        throw new Error(res.status.message || 'Error inesperado');
    }
    return response.json();
}


export const HotelService = {
    getAll: async () => {
        try {
            const response = await fetch(`${environment.API_URL}/hotel?per_page=10`);
            return handleResponses(response);
        } catch(error) {
            throw error;
        }
    },
    getHotelParametrics: async () => {
        try {
            const response = await fetch(`${environment.API_URL}/parametricas`);
            return handleResponses(response);
        } catch(error) {
            throw error
        }
    },
    createHotel: async (hotelInfo) => {
        try {
            const response = await fetch(`${environment.API_URL}/hotel/store`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: hotelInfo
            });
            return handleResponses(response);
        } catch(error) {
            throw error
        }
    },
    deleteHotel: async (hotelId) => {
        try {
            const response = await fetch(`${environment.API_URL}/hotel/${hotelId}`, {
                method: 'DELETE'
            });
            return handleResponses(response);
        } catch(error) {
            throw error
        }
    }
}