import MyAnnouncesTable from "./MyAnnouncesTable.jsx";

function MyAnnounces({announces, selected, onHandleSaveDelete}) {
  return (
    <MyAnnouncesTable
      announces={announces}
      selected={selected}
      onHandleSaveDelete={onHandleSaveDelete}
    ></MyAnnouncesTable>
  );
}

export default MyAnnounces;
