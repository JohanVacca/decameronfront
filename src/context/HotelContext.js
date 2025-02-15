import React, { createContext, useContext, useReducer } from "react";
import { HotelService } from "../services/HotelService";

const HotelContext = createContext();

const initialState = {
  hotels: [],
  types_of_accommodation: [],
  type_of_rooms: [],
  loading: false,
  error: null,
};

const hotelReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_STARTED":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_HOTELS_SUCCESS":
      return {
        ...state,
        loading: false,
        hotels: action.payload,
        error: null,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "FETCH_HOTELS_PARAMETRICS_SUCCESS":
      return {
        ...state,
        loading: false,
        types_of_accommodation: action.payload.types_of_accommodation,
        type_of_rooms: action.payload.type_of_rooms,
        error: null,
      };
    case "ADD_HOTEL":
      return {
        ...state,
        hotels: [...state.hotels, action.payload],
        error: null,
      };
    case "DELETE_HOTEL":
      return {
        ...state,
        hotels: state.hotels.filter((hotel) => hotel.id !== action.payload),
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const HotelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(hotelReducer, initialState);

  const fetchHotels = async () => {
    dispatch({ type: "FETCH_STARTED" });
    try {
      const response = await HotelService.getAll();
      dispatch({
        type: "FETCH_HOTELS_SUCCESS",
        payload: response.response.data,
      });
    } catch (err) {
      dispatch({ type: "FETCH_FAILURE", payload: err });
      throw err;
    }
  };

  const fetchParametrics = async () => {
    dispatch({ type: "FETCH_STARTED" });
    try {
      const response = await HotelService.getHotelParametrics();
      dispatch({
        type: "FETCH_HOTELS_PARAMETRICS_SUCCESS",
        payload: {
          types_of_accommodation: response.response.data.tiposAcomodacion,
          type_of_rooms: response.response.data.tiposHabitacion,
        },
      });
    } catch (err) {
      dispatch({ type: "FETCH_FAILURE", payload: err });
      throw err;
    }
  };

  const addHotel = async (hotelData) => {
    dispatch({ type: "FETCH_STARTED" });
    try {
      const response = await HotelService.createHotel(hotelData);
      dispatch({ type: "ADD_HOTEL", payload: response.response.data });
      return response.response.data;
    } catch (err) {
      dispatch({ type: "FETCH_FAILURE", payload: err });
      throw err;
    }
  };

  const deleteHotel = async (hotelId) => {
    dispatch({ type: "FETCH_STARTED" });
    try {
      await HotelService.deleteHotel(hotelId);
      dispatch({ type: "DELETE_HOTEL", payload: hotelId });
    } catch (err) {
      dispatch({ type: "FETCH_FAILURE", payload: err });
      throw err;
    }
  };

  const value = {
    state,
    dispatch,
    fetchHotels,
    fetchParametrics,
    addHotel,
    deleteHotel
  };

  return (
    <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel debe usarse dentro de un HotelProvider");
  }
  return context;
};
