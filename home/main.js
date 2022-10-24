var loginBtn = document.getElementById("btn_login");
var registerBtn = document.getElementById("btn_register");

// LOGIN

loginBtn.addEventListener("click", () => {
  var user = document.getElementById("username");
  var password = document.getElementById("password");

  if (user.value.trim() === "" || password.value === "") {
    alert("Nhập email hoặc mật khẩu");
  } else {
    fetch("https://todolistthangbui.herokuapp.com/api/apiv1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{
                "email": "${user.value}",
                "password" : "${password.value}"
            }`,
      // body: {
      //     email: user.value,
      //     password: password.value
      // }
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (!json.status) alert("Tài khoản hoặc mật khẩu sai");
        else 
        {
          // if(alert("Đăng nhập thành công!")){
            sessionStorage.setItem("id", json.id);
            sessionStorage.setItem("name", json.name);
            sessionStorage.setItem("dob", json.dob);
            sessionStorage.setItem("jwt", json.token);
            window.location.href = "../task.html";
          // };
        }
      });
  }
});

// Register
var img;
var urlAvatar;
var inputAvatar = document.getElementById("upAvatar");
inputAvatar.onchange = function (evt) {
  // const [file] = inputAvatar.files
  // [img] = inputAvatar.files
  // if (file) {
  document.getElementById("avatar").src = URL.createObjectURL(
    inputAvatar.files[0]
  );
  // urlAvatar = URL.createObjectURL(file);
  // }
};

registerBtn.addEventListener("click", async () => {
  var email = document.getElementById("usernameRegister");
  var password = document.getElementById("passwordRegister");
  var name = document.getElementById("name");
  var dob = document.getElementById("dob");
  var age = document.getElementById("age");

  var res1 = await fetch(
    "https://todolistthangbui.herokuapp.com/api/apiv1/register",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: `{
            "name": "${name.value}",
            "age": 99,
            "dob": "${dob.value}",
            "email": "${email.value}",
            "password": "${password.value}"
        }`,
    }
  ).then((res) => {
    if(res.status == 200){
        alert('Đăng ký thành công');
        return res.json();
    }
  })
  if (inputAvatar && inputAvatar.value) {
    const form = new FormData();
    form.append("file", inputAvatar.files[0]);
    const res2 = await fetch(
      `https://todolistthangbui.herokuapp.com/api/apiv1/avatar/${res1.id}`,
      {
        method: "POST",
        body: form,
      }
    ).then((res) => res.json());
  }
});

// registerBtn.addEventListener('click',async () =>{
//     const res1 = await fetch('https://todolistthangbui.herokuapp.com/api/apiv1/register',{
//         method: 'POST',
//         headers:{
//             'Content-Type': 'application/json'
//         },
//         body: `{
//             "name":"string",
//             "age":0,
//             "dob":"string",
//             "email":"user@example.com",
//             "password":"string"
//         }`
//     })
// })
