const ContactUs = () => {
  return (
    <div className="text-color ms-5 me-5 mr-5 mt-3">
      <h4 className="mb-3">Contact Us</h4>
      <b>
        We value your feedback, questions, and inquiries. Whether you need
        assistance with job applications, have a suggestion, or simply want to connect,
        our team is here to help.
        <br /><br />
        Feel free to reach out through the provided contact form, or get in touch via email or phone.
        We’ll respond promptly to ensure your experience with us is nothing short of exceptional.
        <br /><br />
        <strong>Email:</strong>{" "}
        <a href="mailto:support@onlinejobportal.com" className="text-decoration-none">
          support@onlinejobportal.com
        </a>
        <br />
        <strong>Phone:</strong> +91-9876543210
        <br /><br />
        Your satisfaction is our priority, and we look forward to hearing from you.
      </b>
    </div>
  );
};

export default ContactUs;
