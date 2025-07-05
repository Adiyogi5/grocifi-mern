import React from 'react'
import FooterLinks from '../../sections/FooterLinks'
import { useSelector } from 'react-redux';

const Footer = () => {

    const { copyright } = useSelector(store => store.theme.settings);
    return (
        <>
            <div data-elementor-type="page" className="elementor elementor-6475">
                <FooterLinks />
            </div>
            <footer className="footer-area style-3" style={{ backgroundImage: 'url( )', backgroundColor: '#764979' }}>
                <div className="footer-bottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <p className="copyright">
                                    {copyright}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer