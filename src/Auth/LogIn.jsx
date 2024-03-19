import { React, useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import s from './LogIn.module.scss'
import Loader from '../Components/Loader';


const LogIn = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [alert, setAlert] = useState(false);
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        if (!emailError || !passwordError) {
            setSuccess(true)
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    navigate('/mind-merge/minds');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(error);
                    setAlert(true);
                    setSuccess(false)
                });
        }
    };

    const emailValidation = (e) => {
        const pattern = /^[^]+@[^]+\.[a-z]{2,3}$/;
        const emailValue = e.target.value;
        setEmail(emailValue);

        if (emailValue === '' || !emailValue.match(pattern)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address');
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }
    };

    const passwordValidation = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);

        if (passwordValue === '' || passwordValue.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('You must have at least 6 characters');
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
    };

    return (
        <div>
            {success ? <Loader /> : null}
            <div className={s.mainContainer}>
            <h1 className={s.welcomeBackText}>Welcome Back!</h1>
            <p className={s.infoEnterText}>Please enter your information.</p>
            <div className={s.inputContainer}>
                <p className={s.inputLabel}>Email</p>
                <input placeholder='Username' type="text"
                    error={emailError}
                    helperText={emailErrorMessage}
                    onChange={emailValidation}
                    value={email}
                    className={s.inputContainerTextFeild}
                />
                <p className={s.inputLabel}>Password</p>
                <input placeholder='Password' type="password"
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    onChange={passwordValidation}
                    className={s.inputContainerTextFeild} />
                <button onClick={submit} className={s.enterBtn}>Log In</button>
            </div>
            <p className={s.suggestion}>
                Don't have an account? <span onClick={() => { navigate('/mind-merge/sign-up') }}>Sign Up</span>
            </p>
        </div>
        </div>
    );
};

export default LogIn;
