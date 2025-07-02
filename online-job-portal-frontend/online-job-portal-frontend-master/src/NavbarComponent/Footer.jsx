import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="container my-5">
        <footer className="text-center text-lg-start text-color">
          <div className="container-fluid p-4 pb-0">
            <section>
              <div className="row">
                <div className="col-lg-12 col-md-12 mb-4 mb-md-0 text-center">
                  <h5 className="text-uppercase text-color-second">
                    Online Job Portal
                  </h5>
                  <p>
                    Welcome to our Online Job Portal, where career dreams come to life.
                    Our user-friendly platform simplifies job searching, offering a seamless
                    experience for both job seekers and employers.
                  </p>
                </div>
              </div>
            </section>

            <hr className="mb-4" />

            <section>
              <p className="d-flex justify-content-center align-items-center">
                <span className="me-3 text-color">Login from here</span>
                <Link to="/user/login" className="active">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-rounded bg-color custom-bg-text"
                  >
                    Log in
                  </button>
                </Link>
              </p>
            </section>

            <hr className="mb-4" />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
