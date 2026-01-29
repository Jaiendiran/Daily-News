import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";


const Header = () => {
    return (
        <div className="container">
            <Navbar className="yellowtail">
                <LinkContainer to="/">
                    <Navbar.Brand>The Daily News</Navbar.Brand>
                </LinkContainer>
            </Navbar>
            <Nav>
                <Nav.Item>
                    <LinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                    <LinkContainer to="/contact">
                        <Nav.Link>Contact</Nav.Link>
                    </LinkContainer>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default Header;