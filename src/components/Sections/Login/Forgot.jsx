import React,{useState} from "react";
import { useFormik } from "formik";
import "./Forgot.css";
import {url} from '../env.js';

import axios from "axios";
import Swal from "sweetalert2";



export default function Forgot() {
  const [value,setValue]=useState()
  const [havingEmail,setHavingEmail]=useState(false)
  
  const validate = async (e) => {
    e.preventDefault()

    const errors = {};
  
    if (
     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) === true
    ) {
      setHavingEmail(true);
    } 
    else {
      setHavingEmail(false);
      
      let response = await axios.put(
        `${url}/api/forgetPasswordLink`,
        {
          email:value
         
          
        }
        
      ).then((response)=>{
      if(response){
        Swal.fire({
          position: "center",
          icon: "success",
          text: "Link is generated to given email for password reset",
          showConfirmButton: false,
          timer: 1600,
        });
        setHavingEmail(false);
      }

      else{
        Swal.fire({
          position: "center",
          icon: "error",
          text: "Email not found",
          showConfirmButton: false,
          timer: 1500,
         
        });
        setHavingEmail(false);
      }
      })
      .catch((err)=>{

        Swal.fire({
          position: "center",
          icon: "error",
          text: "Email not found",
          showConfirmButton: false,
          timer: 1500,
          
        });
        setHavingEmail(false);
      })
     

    }
  
    
  
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
  });


  return (
    <React.Fragment>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4 col-xl-5 col-xxl-4">
          <div className="text-center w-100 mt-4 mb-4 mt-md-4 mb-md-5 fw-light h5">
            <a className="ms-0 ms-md-1 d-inline-block" href="#" />
          </div>
          <div className="mb-4 text-center">
            <h1 className="h3 fw-light mb-3">Reset password</h1>
            <p className="message">
              Forgot your password? No problem. Just let us know your email
              address and we will email you a password reset link that will
              allow you to choose a new one.
            </p>
          </div>
          <form
            method="#"
            action="#"
            className="onsubmit-disable"
            onSubmit={(e)=>validate(e)}
          >
            <div className="card p-3 p-sm-4 justify-content-start">
              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-bold mb-2">
                  Your email:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  autoFocus
                  required
                  onChange={(e)=>setValue(e.target.value)}
                  
                />
                {havingEmail&& (
                  <span className="errorMessage">*Enter valid email adress</span>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-2 mt-1" >
                 Password reset link →
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
