import Container from "@mui/material/Container";

import Body from "./components/Body";
import LoadingScreen from "./components/LoadingScreen";
import NavBar from "./components/NavBar";

function App() {
    return (
        <Container maxWidth="xs" sx={{ padding: 0 }}>
            <LoadingScreen />
            <NavBar />
            <Body />
        </Container>
    );
}

export default App;
