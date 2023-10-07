"use client";
import "../styles/auth.scss";
export default async function Login() {

  return (
    <div className="auth_container">
    <div className="auth_form">
      <h2>
          Login
      </h2>
      <form className="auth_form_form">
          <div className="auth_form_input">
              <label className="auth_form_input_label">Email</label>
              <input className="auth_form_input_inputbox" placeholder="Please enter email" />
          </div>
          <div className="auth_form_input">
              <label className="auth_form_input_label">Password</label>
              <input type="password" className="auth_form_input_inputbox" 
              placeholder="Please enter password" />
          </div> 
          <button className="auth_form_submit">
            Login
          </button>
      </form>
      <p className="auth_form_redirect">
        Don't have an account. <a href="/signup" className="auth_form_redirect_link">Join now!</a>
      </p>
    </div>
    </div>

  )
}
