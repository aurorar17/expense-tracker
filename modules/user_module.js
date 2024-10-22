const mapFiller = (data) => {
  document.querySelector("#user-name").innerHTML =
    data.fname + " " + data.lname;
  //   document.querySelector("#user-email").innerHTML = data.email;
};

load("http://127.0.0.1:5500/const/user_data.json", mapFiller);
