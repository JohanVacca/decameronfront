import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useHotel } from "../../context/HotelContext";
import { validateRoomsHotel } from "../../utils/validators";
import "./HotelForm.css";

const allowedAccommodations = {
  "1": ["1", "2"],
  "2": ["3", "4"],
  "3": ["1", "2", "3"],
};

const HotelForm = () => {
  const { fetchParametrics, addHotel, state } = useHotel();
  const history = useHistory();
  const [hotelData, setHotelData] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    nit: "",
    numeroHabitaciones: "",
    habitaciones: [],
  });
  const [currentRoom, setCurrentRoom] = useState({
    cantidad: 0,
    tipoHabitacionCodigo: state.type_of_rooms[0]?.codigo || "1",
    tipoAcomodacionCodigo: allowedAccommodations[state.type_of_rooms[0]?.codigo || "1"][0],
  });
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    fetchParametrics();
    if (
      state.type_of_rooms.length > 0 &&
      state.types_of_accommodation.length > 0
    ) {
      setCurrentRoom({
        cantidad: 0,
        tipoHabitacionCodigo: state.type_of_rooms[0]?.codigo || "1",
        tipoAcomodacionCodigo: allowedAccommodations[state.type_of_rooms[0]?.codigo || "1"][0],
      });
    }
  }, []);

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoom((prev) => ({
      ...prev,
      [name]: value,
      tipoAcomodacionCodigo: name === "tipoHabitacionCodigo" ? allowedAccommodations[value][0] : prev.tipoAcomodacionCodigo,
    }));
  };

  const addRoom = useCallback(() => {
    setHotelData((prev) => ({
      ...prev,
      habitaciones: [...prev.habitaciones, currentRoom],
    }));

    setCurrentRoom({
      cantidad: 0,
      tipoHabitacionCodigo: state.type_of_rooms[0]?.codigo || "1",
      tipoAcomodacionCodigo: allowedAccommodations[state.type_of_rooms[0]?.codigo || "1"][0],
    });
  }, [currentRoom, state.type_of_rooms]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationError = validateRoomsHotel(hotelData, state);
      if (validationError) {
        setValidationError(validationError);
        return;
      }

      addHotel(JSON.stringify(hotelData))
        .then((res) => {
          console.log(`addHotel | then | res `, res);
          history.push("/");
        })
        .catch((err) => {
          console.log(`addHotel | catch: `, typeof err);
          setValidationError(err + "");
        });
    },
    [hotelData, addHotel, history, state]
  );

  const removeRoom = useCallback((index) => {
    setHotelData((prev) => ({
      ...prev,
      habitaciones: prev.habitaciones.filter((_, i) => i !== index),
    }));
  }, []);

  return (
    <div className="hotel-form">
      <h2>Registrar Nuevo Hotel</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={hotelData.nombre}
            onChange={handleHotelChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={hotelData.direccion}
            onChange={handleHotelChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ciudad">Ciudad:</label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            value={hotelData.ciudad}
            onChange={handleHotelChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nit">NIT:</label>
          <input
            type="text"
            id="nit"
            name="nit"
            value={hotelData.nit}
            onChange={handleHotelChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="numeroHabitaciones">
            Número total de habitaciones:
          </label>
          <input
            type="number"
            id="numeroHabitaciones"
            name="numeroHabitaciones"
            value={hotelData.numeroHabitaciones}
            onChange={handleHotelChange}
            required
          />
        </div>

        <div className="room-section">
          <h3>Agregar Habitaciones</h3>
          <div className="form-group">
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={currentRoom.cantidad}
              onChange={handleRoomChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipoHabitacionCodigo">Tipo de Habitación:</label>
            <select
              id="tipoHabitacionCodigo"
              name="tipoHabitacionCodigo"
              value={currentRoom.tipoHabitacionCodigo}
              onChange={handleRoomChange}
            >
              {state.type_of_rooms.map((tipo) => (
                <option key={tipo.codigo} value={tipo.codigo}>
                  {tipo.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tipoAcomodacionCodigo">Acomodación:</label>
            <select
              id="tipoAcomodacionCodigo"
              name="tipoAcomodacionCodigo"
              value={currentRoom.tipoAcomodacionCodigo}
              onChange={handleRoomChange}
            >
              {allowedAccommodations[currentRoom.tipoHabitacionCodigo].map((codigo) => (
                <option key={codigo} value={codigo}>
                  {state.types_of_accommodation.find((acomodacion) => acomodacion.codigo === codigo)?.descripcion}
                </option>
              ))}
            </select>
          </div>

          <button type="button" onClick={addRoom} className="btn-secondary">
            Agregar Habitaciones
          </button>
        </div>

        <div className="rooms-summary">
          <h3>Habitaciones Configuradas</h3>
          {hotelData.habitaciones.length === 0 ? (
            <p className="no-rooms">No hay habitaciones configuradas</p>
          ) : (
            <ul className="rooms-list">
              {hotelData.habitaciones.map((room, index) => (
                <li key={index} className="room-item">
                  <div className="room-info">
                    <span className="room-quantity">{room.cantidad}</span>
                    <span className="room-type">
                      habitaciones{" "}
                      {
                        state.type_of_rooms.find(
                          (tipo) => tipo.codigo === room.tipoHabitacionCodigo
                        )?.descripcion
                      }
                    </span>
                    <span className="room-accommodation">
                      con acomodación{" "}
                      {
                        state.types_of_accommodation.find(
                          (acomodacion) =>
                            acomodacion.codigo === room.tipoAcomodacionCodigo
                        )?.descripcion
                      }
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRoom(index)}
                    className="btn-remove"
                    aria-label="Eliminar habitación"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {validationError && (
          <div className="validation-error">{validationError}</div>
        )}

        {state.loading && <div className="loading">Cargando...</div>}
        <button disabled={state.loading} type="submit" className="btn-primary">
          Registrar Hotel
        </button>
      </form>
    </div>
  );
};

export default HotelForm;
