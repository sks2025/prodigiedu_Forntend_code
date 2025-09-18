import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./home.css"
import headerlogo from '../assets/Prodigi.png'
import { FaUserCircle } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import settings from "../images/settings.png";
import AccountHistory from "../images/clock.png";
import LogOut from "../images/sign-out.png";
import Help from "../images/help.png";
import { toast } from 'react-toastify';
import headerlogos from "../images/logos2.svg"
import namelogo from "../images/logoprodigi.png"
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AppsIcon from "@mui/icons-material/Apps";
import { FaRegUser } from "react-icons/fa";


const Studentheaderhome = () => {
  // Example: Assume token in localStorage means user is logged in
  const isLoggedIn = !!localStorage.getItem('student_token');

  // State for MUI Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  // Logout handler
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('student_token');
      await fetch('https://api.prodigiedu.com/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
    } catch (err) {
      // Optionally handle error
    }
    localStorage.removeItem('student_token');
    handleClose();
    // toast.success('Logout successful!');
    navigate('/');
  };

  return (
    <div>
      <header>
        <nav className="student-navbar">
          <div className="navbar-row">
            <div className="logo">
              <Link style={{ textDecoration: "none" }} to="/">
                <img src={namelogo} alt="" className="navbar-logo-img" />
              </Link>
            </div>
            {isMobile && (
              <div className="hamburger-wrapper">
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleDrawerOpen}
                  className="hamburger-btn"
                >
                  <AppsIcon fontSize="large" />
                </IconButton>
              </div>
            )}
          </div>
          {isMobile ? (
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={handleDrawerClose}
              PaperProps={{ sx: { width: '80vw', maxWidth: 320, p: 0 } }}
            >
              <div className="drawer-header-row">
                <img src={namelogo} alt="logo" className="drawer-logo" />
                <IconButton onClick={handleDrawerClose} aria-label="close drawer" className="drawer-close-btn">
                  <span style={{ fontSize: 28, fontWeight: 700 }}>&times;</span>
                </IconButton>
              </div>
              <div className="drawer-links">
                <Link to="/" className="active" onClick={handleDrawerClose}>Home</Link>
                <Link to="/schoolHome" onClick={handleDrawerClose}>Schools</Link>
                <Link to="/organiser" onClick={handleDrawerClose}>Organiser</Link>
                <Link to="/compition" onClick={handleDrawerClose}>Competitions</Link>
                {isLoggedIn ? (
                  <>

                    <div
                      className="avatar"
                      style={{ cursor: "pointer" }}
                      onClick={handleClick}
                    >
                      <FaUserCircle />
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
                        <img src={settings} alt="" /> &nbsp;&nbsp; <Link to="/student/persnol-setting" style={{ textDecoration: 'none', color: 'inherit' }}>Account Settings</Link>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <FaRegUser />
                        </ListItemIcon>
                        <Link to="/student/persnol-setting" className="" style={{ display: "flex", alignItems: "center", }}>

                          <span>Profile</span>
                        </Link>
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
                        <Link to="/student/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Student Dashboard</Link>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <img src={LogOut} alt="logout" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Link to="/student/login" className="login" onClick={handleDrawerClose}>Login</Link>
                    <Link to="/student/register/mobile" className="signup drawer-signup-btn" onClick={handleDrawerClose}>Sign up</Link>
                  </>
                )}
              </div>
            </Drawer>
          ) : (
            <div className="nav-links">
              <Link to="/" className="active">Home</Link>
              <Link to="/schoolHome">Schools</Link>
              <Link to="/organiser">Organiser</Link>
              <Link to="/compition">Competitions</Link>
              {isLoggedIn ? (
                <>

                  <div
                    className="avatar"
                    style={{ cursor: "pointer" }}
                    onClick={handleClick}
                  >
                    <FaUserCircle />
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
                      <img src={settings} alt="" /> &nbsp;&nbsp; <Link to="/student/persnol-setting" style={{ textDecoration: 'none', color: 'inherit' }}>Account Settings</Link>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                      <FaRegUser />
                      </ListItemIcon>
                      <Link to="/student/persnol-setting" className="" style={{ display: "flex", alignItems: "center", }}>

                        <span>Profile</span>
                      </Link>
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
                      <Link to="/student/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Student Dashboard</Link>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <img src={LogOut} alt="logout" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Link to="/student/login" className="login">Login</Link>
                  <Link to="/student/register/mobile" className="signup">Sign up</Link>
                </>
              )}
            </div>
          )}
        </nav>
      </header>
    </div>
  )
}

export default Studentheaderhome