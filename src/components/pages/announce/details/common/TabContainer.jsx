import {Typography} from "@mui/material";

function TabContainer({children}) {
  return (
    <Typography className="p-1" component="div">
      {children}
    </Typography>
  );
}

export default TabContainer;
