import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    return (
        <div>
            <div id="primary" className="content-area yogastic-404-page yogastic-page-containerr">
                <main id="main" className="site-main">
                    <div className="blog-area-">
                        <div className="container">
                            <div className="row custom-gutter">
                                <div className="col-lg-8 offset-lg-2">
                                    <div className="blog-inner">
                                        <section className="error-404 not-found pd-bottom-115">
                                            <header className="page-header">
                                                <h1 className="error-heading">404</h1>
                                                <h2 className="error-sub-title">Page not found</h2>
                                                <p>Oops! The page you are looking for does not exist. It might have been moved or deleted. </p>
                                            </header>

                                            <div className="page-content error-page-inner">
                                                <Link href="/home" className="go-back-btnn text-white">Back To Home</Link>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default NotFoundPage