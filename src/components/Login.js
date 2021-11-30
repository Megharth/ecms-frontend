import React from 'react';
import { Card, CardContent, CardActions, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';

import '../css/Login.css'

const Login = () => (
    <div className="login">
        <Card className="login-card">
            <div className="login-header">Login</div>
            <CardContent className="input-flex">
                <div className="input-group">
                    <div className="login-input">
                        <TextField variant="standard" label="Username" />
                    </div>
                    <div className="login-input">
                        <TextField variant="standard" label="Password" />
                    </div>
                </div>
                <div className="radio-group">
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Role</FormLabel>
                        <RadioGroup 
                            aria-label="role"
                            defaultValue="user"
                            name="role-radio-buttons"
                        >
                            <FormControlLabel value="user" control={<Radio />} label="User"/>
                            <FormControlLabel value="admin" control={<Radio />} label="Admin"/>
                        </RadioGroup>
                    </FormControl>
                </div>
            </CardContent>
            <CardActions>
                <Button className="login-btn" variant="contained">Login</Button>
            </CardActions>
        </Card>
    </div>
);

export default Login;