import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import OtpInput from '../../../components/OtpInput';

const ForgetPassword = () => {

    var { logo, application_name } = useSelector(store => store.theme.settings);
    const [otp, setOtp] = useState('')

    return (
        <main className="main" id="top">
            <div className="container" data-layout="container">
                <div className="row flex-center min-vh-100 py-6 text-center">
                    <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <Link className="d-flex flex-center mb-4" to='/admin/dashboard'>
                            <img className="me-2" src={logo} alt={application_name} style={{ width: 180, maxHeight: 45 }} />
                        </Link>
                        <div className="card">
                            <div className="card-body p-4 p-sm-5">
                                <h5 className="mb-0">Forgot your password?</h5>
                                <small>Enter your email and we'll send you a reset link.</small>
                                <form className="mt-4">
                                    <div className="mb-3">

                                        <input className="form-control" type="text" placeholder="Enter Mobile Number" maxLength={10} />
                                    </div>
                                    <button className="btn btn-primary d-block w-100 mt-3" type="submit" name="submit">Send reset link</button>
                                </form>

                                <div className="my-4">
                                    <OtpInput
                                        value={otp}
                                        onChange={setOtp}
                                        numInputs={4}
                                        inputType='number'
                                        skipDefaultStyles
                                        containerStyle={{ justifyContent: 'center', width: '100%', gap: 10 }}
                                        renderSeparator={null}
                                        renderInput={(props) => <input  {...props} className='form-control no-number form-control-lg max-width-60 px-3 text-center' />}
                                    />
                                </div>

                                <Link className="fs--1 text-600 mt-2 d-block" to='/home'>
                                    Go back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ForgetPassword