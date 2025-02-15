import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHotel } from "../../context/HotelContext";
import "./HotelList.css";

const HotelList = () => {
  const { state, fetchHotels, deleteHotel } = useHotel();

  useEffect(() => {
    fetchHotels()
  }, []);

  const handleDelete = async (hotelId) => {
    try {
      await deleteHotel(hotelId);
      fetchHotels();
    } catch (err) {
      console.error("Error deleting hotel:", err);
    }
  };

  const renderRoomSummary = (habitaciones) => {
    if (!habitaciones) {
      return <p>No hay habitaciones configuradas</p>;
    }
    return habitaciones.map((room, index) => (
      <div key={index} className="room-detail">
        <span className="room-quantity">{room.total}</span>
        <span className="room-type">{room.tipoHabitacionn}</span>
        <span className="room-accommodation">{room.tipoAcomodacion}</span>
      </div>
    ));
  };

  return (
    <div className="hotel-list">
      <header className="list-header">
        <h2>Hoteles Registrados</h2>
        <Link to="/agregar-hotel" className="btn-add">
          Agregar Nuevo Hotel
        </Link>
      </header>

      <pre>{state.loading}</pre>
      {state.loading ? (
        <p>Cargando hoteles...</p>
      ) : (
        state.hotels.length < 1 ? (
          <div className="empty-state">
          <p>No hay hoteles registrados</p>
          <p>Comienza agregando un nuevo hotel</p>
        </div>
        ) : (
        <div className="hotels-grid">
          {state.hotels.map((hotel) => (
            <article key={hotel.id} className="hotel-card">
              <header className="hotel-card-header">
                <h3>{hotel.nombre}</h3>
                <span className="hotel-nit">NIT: {hotel.nit}</span>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(hotel.id)}
                  aria-label="Eliminar hotel"
                >
                  ×
                </button>
              </header>

              <div className="hotel-info">
                <p>
                  <strong>Dirección:</strong> {hotel.direccion}
                </p>
                <p>
                  <strong>Ciudad:</strong> {hotel.ciudad}
                </p>
                <p>
                  <strong>Total Habitaciones:</strong>{" "}
                  {hotel.numeroHabitaciones}
                </p>
              </div>

              <div className="hotel-rooms">
                <h4>Distribución de Habitaciones</h4>
                <div className="rooms-grid">
                  {renderRoomSummary(hotel.infoHabitaciones)}
                </div>
              </div>
            </article>
          ))}
        </div>
        )
      )}
    </div>
  );
};

export default HotelList;
