import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { auth, storage, db } from '../firebaseConfig';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Avatar } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import s from './LogIn.module.scss'
import { PiPlus } from "react-icons/pi";
import Loader from '../Components/Loader';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import * as HiIcons from 'react-icons/hi';


function SignUp() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [firstName, setFirstName] = useState(''); 
  const [firstNameError, setFirstNameError] = useState(false); 
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState(''); 
  const [lastName, setLastName] = useState(''); 
  const [lastNameError, setLastNameError] = useState(false); 
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState(''); 
  const [alert, setAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(0)
  const [welcomeText, setWelcomeText] = useState("Hey! What's your name?")
  const [infoEnterText, setInfoEnterText] = useState("Please enter your both first and last name")

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!emailError && !passwordError && !firstNameError && !lastNameError) {
      try {
        setSuccess(true)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const date = new Date().getTime();
        const storageRef = ref(storage, `${date}`);
        await uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            await updateProfile(user, {
              photoURL: downloadURL,
            });

            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
              uid: user.uid,
              firstName,
              lastName,
              email,
              password,
              photoURL: downloadURL,
            });

            navigate('/mind-merge/minds');
          });
        });
      } catch (error) {
        console.error("Error creating user:", error);
        setAlert(true)
        setAlertMessage('The user with this email already exists, try again.')
        setSuccess(false)
      }
    } else {
      if (emailError) {
        setAlert(true);
        setAlertMessage('Email address is not valid or already being used.');
        setSuccess(false)

      } else {
        setAlert(false);
        setAlertMessage('');
      }
      if (passwordError) {
        setAlert(true);
        setAlertMessage('Please enter a valid password.');
        setSuccess(false)
      } else {
        setAlert(false);
        setAlertMessage('');
      }
      if (firstNameError || lastNameError) {
        setAlert(true);
        setAlertMessage('Please enter a name.');
        setSuccess(false)
      } else {
        setAlert(false);
        setAlertMessage('');
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileURL(URL.createObjectURL(selectedFile));
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

  const firstNameValidation = (e) => {
    const firstNameValue = e.target.value;
    setFirstName(firstNameValue);

    if (firstNameValue === '') {
      setFirstNameError(true);
      setFirstNameErrorMessage('You must enter your first name.');
    } else {
      setFirstNameError(false);
      setFirstNameErrorMessage('');
    }
  };

  const lastNameValidation = (e) => {
    const lastNameValue = e.target.value;
    setLastName(lastNameValue);

    if (lastNameValue === '') {
      setLastNameError(true);
      setLastNameErrorMessage('You must enter your last name.');
    } else {
      setLastNameError(false);
      setLastNameErrorMessage('');
    }
  };

  const logIn = () => {
    navigate('/mind-merge/log-in')
  }

  const steps = [
    ' ', '', '  '
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  useEffect(() => {
    if (step === 1) {
      setWelcomeText('Email & Password');
      setInfoEnterText('Please enter a valid email & password');
    }
    if (step === 2) {
      setWelcomeText('Upload a photo');
      setInfoEnterText('Please upload an avatar photo');
    }
  }, [step]);


  return (
    <div className={s.mainContainer}>
      <h1 className={s.welcomeBackText}>{welcomeText}</h1>
      <p className={s.infoEnterText}>{infoEnterText}</p>
      <div className={s.inputContainer}>
        {step === 0 ? (
          <>
          <p className={s.inputLabel}>First Name</p>
          <input
            type="text"
            placeholder="Enter first name"
            className={s.inputContainerTextFeild}
            error={firstNameError}
            onChange={firstNameValidation}
            value={firstName}
          />
          <p className={s.inputLabel}>Last Name</p>
          <input
            type="text"
            placeholder="Enter last name"
            className={s.inputContainerTextFeild}
            error={lastNameError}
            onChange={lastNameValidation}
            value={lastName}
          />
        </>
        ) : null || step === 1 ? (
          <>
            <p className={s.inputLabel}>Email</p>
            <input type="text" placeholder='Enter email'
              className={s.inputContainerTextFeild}
              error={emailError.toString()}
              onChange={emailValidation}
              value={email}
            />
            <p className={s.inputLabel}>Password</p>
            <input type="password" placeholder='Enter password'
              className={s.inputContainerTextFeild}
              error={passwordError}
              onChange={passwordValidation}
              value={password}
            />
          </>
        ) : null || step === 2 ? (
          <div className={s.avatarContainer}>
            <label htmlFor="fileInput">
            <Avatar sx={{ width: "250px", height: "250px", position: "relative" }} src={fileURL} className={s.photoUpload}></Avatar>
            </label>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="fileInput"
              />
              <label htmlFor="fileInput" className={s.photoUploadButton}>
                <HiIcons.HiOutlinePencil/>
              </label>
            </div>
          </div>
        ) : null}
        <button onClick={step !== 2 ? handleNext : submit} className={s.nextBtn}>{step !== 2 ? 'Next' : 'Submit'}</button>
        <div>
          <Stepper activeStep={step} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
