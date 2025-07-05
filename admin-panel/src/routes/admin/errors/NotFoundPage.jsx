import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

const NotFoundPage = () => {

    var { logo } = useSelector(store => store.theme.settings);
    return (
        <div className="container" data-layout="container">
            <div className="row flex-center min-vh-100 py-6 text-center">
                <div className="col-sm-10 col-md-8 col-lg-6 col-xxl-5">
                    <Link className="d-flex flex-center mb-4" to='/dashboard'>
                        <img className="me-2" src={logo} alt="" width={250} />
                    </Link>
                    <div className="card">
                        <div className="card-body p-4 p-sm-5">
                            <div className="fw-black lh-1 text-300 fs-error">404</div>
                            <p className="lead mt-4 text-800 font-sans-serif fw-semi-bold w-md-75 w-xl-100 mx-auto">The page you're looking for is not found.</p>
                            <hr />
                            <p>Make sure the address is correct and that the page hasn't moved. If you think this is a mistake,
                            </p>
                            <Link className="btn btn-primary btn-sm mt-3" to='/dashboard'><span className="fas fa-home me-2" />Take me home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage