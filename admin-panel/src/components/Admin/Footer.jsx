import { useSelector } from "react-redux";

const Footer = () => {
    const { copyright } = useSelector(store => store.theme.settings);

    return (
        <footer className="footer">
            <div className="row g-0 justify-content-between fs--1 mt-4 mb-3">
                <div className="col-12 col-sm-auto text-center">
                    <p className="mb-0 text-600">
                        {copyright}
                        <span className="d-none d-sm-inline-block"></span>
                    </p>
                </div>
                <div className="col-12 col-sm-auto text-center">
                    <p className="mb-0 text-600">
                        Delvelop By :{" "}
                        <a href="https://adiyogitechnosoft.com" target="_lucky">
                            Adiyogi Technosoft
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
