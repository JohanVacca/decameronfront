export const validateRoomsHotel = (hotelData, state) => {
  const totalConfigured = hotelData.habitaciones.reduce(
    (sum, room) => sum + parseInt(room.cantidad),
    0
  );

  if (totalConfigured > parseInt(hotelData.numeroHabitaciones)) {
    return "El número total de habitaciones configuradas excede el máximo permitido";
  }
  const roomConfigs = new Set();
  for (const room of hotelData.habitaciones) {
    const config = `${room.tipoHabitacionCodigo}-${room.tipoAcomodacionCodigo}`;
    if (roomConfigs.has(config)) {
      return "No pueden existir tipos de habitaciones y acomodaciones repetidas";
    }
    roomConfigs.add(config);
  }

  const allowedAccommodations = {
    "1": ["1", "2"],
    "2": ["3", "4"],
    "3": ["1", "2", "3"],
  };

  for (const room of hotelData.habitaciones) {
    const { tipoHabitacionCodigo, tipoAcomodacionCodigo } = room;
    if (!allowedAccommodations[tipoHabitacionCodigo]?.includes(tipoAcomodacionCodigo)) {
      const tipoHabitacionNombre = state.type_of_rooms.find(tipo => tipo.codigo === tipoHabitacionCodigo)?.descripcion || tipoHabitacionCodigo;
      const tipoAcomodacionNombre = state.types_of_accommodation.find(acomodacion => acomodacion.codigo === tipoAcomodacionCodigo)?.descripcion || tipoAcomodacionCodigo;
      return `La acomodación ${tipoAcomodacionNombre} no está permitida para el tipo ${tipoHabitacionNombre}`;
    }
  }

  return null;
};