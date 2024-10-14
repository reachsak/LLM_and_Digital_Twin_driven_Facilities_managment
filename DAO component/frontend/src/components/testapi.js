import axios from "axios";
function fetchAPI() {
  axios
    .get("http://localhost:5000/hello")
    .then((response) => console.log(response.data));
}
fetchAPI();
