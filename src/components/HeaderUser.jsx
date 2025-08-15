import React from "react";
import "./UserLogin.css";
import { FaUserCircle } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import settings from "../images/settings.png";
import AccountHistory from "../images/clock.png";
import LogOut from "../images/sign-out.png";
import Help from "../images/help.png";
import { NavLink } from "react-router-dom";

const HeaderUser = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <div className="navbar">
        <div className="logo">
          <div className="square" />
          <span>Prodigi</span>
        </div>
        <div className="nav-links">
          <span className="nav-item active">
            <span className="nav-icon">
              <GoHome />
            </span>
           <NavLink to="/organiser/dashboard">
             <span>Home</span>
           </NavLink>
          </span>
          <span className="nav-item">Competitions</span>
          <span className="nav-item">My Prep</span>
          <div
            className="avatar"
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            <FaUserCircle />
          </div>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={handleClose}
          className="flex flex-column justify-content-start align-items-start"
        >
          Admin Name
          <p className="text-themcolor">Oberoi International School</p>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <img src={settings} alt="" /> &nbsp;&nbsp; Account Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <img src={AccountHistory} alt="help" />
          </ListItemIcon>
          Account History
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <img src={Help} alt="help" />
          </ListItemIcon>
          Help Center
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <img src={LogOut} alt="logout" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default HeaderUser;
