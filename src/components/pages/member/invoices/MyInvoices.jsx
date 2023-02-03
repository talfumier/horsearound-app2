import MyInvoicesTable from "./MyInvoicesTable.jsx";

function MyInvoices({bookings, selected, spinner, onHandleBookingChange}) {
  return (
    <>
      <MyInvoicesTable
        bookings={bookings}
        selected={selected}
        spinner={spinner}
        onHandleBookingChange={onHandleBookingChange}
      ></MyInvoicesTable>
    </>
  );
}

export default MyInvoices;
