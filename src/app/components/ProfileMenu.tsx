import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Upload from "@mui/icons-material/Upload";
import Logout from "@mui/icons-material/Logout";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
  const { logout, user } = useAuthStore();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleClick = (callback: () => void) => {
    return () => {
      setAnchorEl(null); // closes the menu
      callback(); // performs the action
    };
  };

  const open = Boolean(anchorEl);
  const router = useRouter();

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
        onMouseLeave={handleMouseLeave}
      >
        <Tooltip title="Account settings">
          <IconButton
            onMouseEnter={handleMouseEnter}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              style={{ backgroundColor: "#ffb300" }}
              sx={{ width: 32, height: 32 }}
            >
              J
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          disableScrollLock
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleMouseLeave}
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
                  bgcolor: "yellow",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <p
            style={{
              marginLeft: "15px",
              marginBottom: "10px",
              marginTop: "5px",
            }}
          >
            <strong> {user?.username}</strong>
          </p>
          <MenuItem onClick={handleClick(() => router.push("/profile"))}>
            Profile
          </MenuItem>
          <MenuItem onClick={handleMouseLeave}>My account</MenuItem>
          <Divider />

          <MenuItem onClick={handleMouseLeave}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={handleClick(() => router.push("/upload"))}>
            <ListItemIcon>
              <Upload fontSize="small" />
            </ListItemIcon>
            Upload
          </MenuItem>
          <MenuItem onClick={handleClick(logout)}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </React.Fragment>
  );
}
