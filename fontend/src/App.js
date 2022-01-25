import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import "./App.css";
import NavbarComponent from "./component/NavbarComponent";

function App() {
  const responseSuccessGoogle = (res) => {
    console.log(res);
    axios({
      method: "POST",
      url: "http://localhost:5000/api/google-login",
      data: { tokenId: res.tokenId },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const responseFacebook = (res) => {
    console.log(res);
    axios({
      method: "POST",
      url: "http://localhost:5000/api/facebook-login",
      data: { accessToken: res.accessToken, userID: res.userID },
    })
      .then((response) => {
        console.log("login fb: ", response);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const responseErrorGoogle = (res) => {
    console.log(res);
  };
  return (
    <div className="App">
      <NavbarComponent />
      <Container className="mt-3">
        <h3 className="text-center my-3"> login With Google and Facebook</h3>
        <Row>
          <Col>
            <div style={{ width: "50", height: "50" }}>
              <GoogleLogin
                clientId="829363947247-2n7d9ui3t25r7ep3cba83jd0kg9rph65.apps.googleusercontent.com"
                buttonText="Login with google"
                onSuccess={responseSuccessGoogle}
                onFailure={responseErrorGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </div>
            <div style={{ width: "10", height: "10" }}>
              <FacebookLogin
                appId="258772136330368"
                autoLoad={true}
                callback={responseFacebook}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
