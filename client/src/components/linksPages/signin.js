import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../../styles/LoginForm.css'
import { Link, NavLink } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container,Row,Col,Form,Button } from 'react-bootstrap';
import { config } from '../../env';

const LOGIN_URL = 'https://datafoundation.iiit.ac.in/api/login';

function Signin(props) {

    const navigate = useNavigate()
    const [state , setState] = useState({
        email : "",
        password : "",
        successMessage: null
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        const payload={
            "email":state.email,
            "password":state.password,
        }

        axios.post(LOGIN_URL, payload)
            .then((response) => {
                console.log(response)
                if (response.data.error === "false") {
                    localStorage.setItem('dfs-user', JSON.stringify(response.data.data));
                    localStorage.setItem('Login',true);
                    props.setIsAdmin(response.data.data.user.user_role == "admin"?true:false)
                    props.setUser("true")
                    props.setRequireLogin(false)
                }
                else {
                    localStorage.removeItem('dfs-user')
                    localStorage.setItem('Login', false)
                    props.setUser("false")
                    props.setIsAdmin(false)
                }
                props.setAdminDashboard(false)
            })
            .catch(error => {
                console.log(error)
            });
    }

    return(
        <>
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col lg={4} md={6} sm={8} xs={10} className="border py-5 px-3 shadow p-3 mb-5 bg-white rounded">
                    <h2>Login</h2>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" id="email" placeholder="Enter email" value={state.email} onChange={handleChange }/>
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control id="password" type="password" placeholder="Password" value={state.password} onChange={handleChange }/>
                    </Form.Group>
                   
                    <Button variant="primary" type="submit" onClick={handleSubmitClick}>
                        Login
                    </Button>
                </Form>
                <hr></hr>
                <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">  
                     {state.successMessage}
                    </div>
                        <p>Do not have an account? Click <Link to='/'>here</Link> to register.</p>
                </Col>
            </Row>
        </Container>
        
        </>
    )
    
}

export default Signin;