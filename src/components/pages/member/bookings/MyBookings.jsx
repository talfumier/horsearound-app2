import MyBookingsTable from "./MyBookingsTable.jsx";

function MyBookings({
  bookings,
  selected,
  spinner,
  onHandleBookingChange,
  onHandleParticipantsChange,
  onHandleToggle,
}) {
  return (
    <>
      <MyBookingsTable
        bookings={bookings}
        selected={selected}
        spinner={spinner}
        onHandleBookingChange={onHandleBookingChange}
        onHandleParticipantsChange={onHandleParticipantsChange}
        onHandleToggle={onHandleToggle}
      ></MyBookingsTable>
    </>
  );
}

export default MyBookings;
