import MyBookingsTable from "./MyBookingsTable.jsx";

function MyBookings({bookings, selected, spinner, onHandleBookingChange}) {
  return (
    <>
      <MyBookingsTable
        bookings={bookings}
        selected={selected}
        spinner={spinner}
        onHandleBookingChange={onHandleBookingChange}
      ></MyBookingsTable>
    </>
  );
}

export default MyBookings;
