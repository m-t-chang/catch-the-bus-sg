import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import LocationDataContext from "../contexts/LocationDataContext";

export default function NavBar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const locationData = useContext(LocationDataContext);

    const navMenu = (
        <Box
            sx={{
                width: 250,
            }}
            role="presentation"
            onClick={() => setDrawerOpen(false)}
            onKeyDown={() => setDrawerOpen(false)}
        >
            <List>
                <ListItem>
                    <Typography variant="h6">Catch the Bus SG</Typography>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Inbox"} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <MailIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Spam"} />
                </ListItem>
            </List>
            Github Link
            <br />
            Location: {JSON.stringify(locationData)}
        </Box>
    );

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => setDrawerOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            Catch the Bus SG
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Drawer
                anchor={"left"}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                {navMenu}
            </Drawer>
        </>
    );
}
