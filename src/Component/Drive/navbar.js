import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NavbarComponent() {
    return (
        <Navbar bg="primary" variant="dark" expand={false}>
            <Navbar.Brand as={Link} to="/">
                SCC Drive
            </Navbar.Brand>
            <Nav>
                <Nav.Link as={Link} to="/user">
                    Profile
                </Nav.Link>
            </Nav>

            <Nav>
                <Nav.Link as={Link} to="/shared">
                    Shared
                </Nav.Link>
            </Nav>

            <Nav>

                <Nav.Link as={Link} to="/create">
                    Document
                </Nav.Link>
            </Nav>
        </Navbar>
    )
}
