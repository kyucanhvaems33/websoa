const submitBtn = document.getElementById("submit");
const userId = sessionStorage.getItem("id");
const avatar = document.getElementById("avatar");
const task = document.getElementById("task");
const file = document.getElementById("file");

if (!("id" in sessionStorage)) {
  window.location.href = "../index.html";
} else {
  fetch(`https://todolistthangbui.herokuapp.com/api/apiv1/avatar/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
    },
  })
    .then((res) => {
      if (res.status == 200) return res.blob();
      else {
        avatar.src = "../defaultAvatar.jpg";
        // throw err;
      }
    })
    .then((blob) => {
      avatar.src = URL.createObjectURL(blob);
      sessionStorage.setItem("img", URL.createObjectURL(blob));
    })
    .catch((err) => console.log("error get avatar"));
  avatar.addEventListener("error", () => {
    this.src = "../defaultAvatar.jpg";
  });

  submitBtn.addEventListener("click", () => {
    if (task.value.trim() == "") {
      alert("Vui lòng nhập vào nhiệm vụ");
    } else {
      fetch(`https://todolistthangbui.herokuapp.com/api/apiv1/task/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
        body: `{
                "task" : "${task.value}"
            }`,
      })
        .then(async (res) => {
          return (result = {
            status: res.status,
            json: await res.json(),
          });
        })
        .then((result) => {
          // console.log(result.json);
          if (result.status == 200) {
            if (file && file.value) {
              const form = new FormData();
              form.append("file", file.files[0]);
              fetch(
                `https://todolistthangbui.herokuapp.com/api/apiv1/task/file/${result.json.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
                  },
                  method: "POST",
                  body: form,
                }
              ).then((res) => {
                if (res.status == 200) {
                  alert("Thêm công việc thành công");
                  getAllTask();
                  task.value = "";
                  file.value = null;
                }
              });
            } else {
              alert("Thêm công việc thành công");
              getAllTask();
            }
          } else {
            alert("Thêm công việc thất bại");
          }
        });
    }
  });

  async function getAllTask() {
    var allTask = await fetch(
      `https://todolistthangbui.herokuapp.com/api/apiv1/tasks/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
      }
    )
      .then((res) => {
        if (res.status == 401) {
          window.location.href = "../index.html";
        }
        return res.json();
      })
      .catch((err) => 0);
    // var date = new Date(allTask[6].created_at).toString();
    // var date = moment.utc(allTask[6].created_at).toDate();
    // date = moment(date).format('HH:mm DD-MM-YYYY')
    if (allTask != 0) {
      var renderHTML = allTask.map((item) => {
        let createdAt = moment.utc(item.created_at).toDate();
        createdAt = moment(createdAt).format("HH:mm DD-MM-YYYY");

        let finishedAt = "";
        if (item.finished_at != null) {
          finishedAt = moment.utc(item.finished_at).toDate();
          finishedAt = moment(finishedAt).format("HH:mm DD-MM-YYYY");
        }
        var url;
        let linkfile;
        if (item.path_file != null) {
          linkfile = true;
          // linkfile = `https://todolistthangbui.herokuapp.com/api/apiv1/task/file/${item.id}`
          // linkfile = `https://todolistthangbui.herokuapp.com/api/apiv1/task/file/${item.id}`
          // url = fetch(`https://todolistthangbui.herokuapp.com/api/apiv1/task/file/${item.id}`,{
          //     method: "GET",
          //     headers: {
          //         Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          //     }
          // })
          // .then(response => response.blob())
          // .then( result =>  URL.createObjectURL(result))
        } else {
          // linkfile = 'không có tệp đính kèm'
          linkfile = false;
        }
        // console.log(url);
        let json = JSON.stringify(item);
        return `
              <div id = "${item.id}" class = "wrapper">
                  <div class = "leftWrapper">
                      <h3>${item.task}</h3>
                      <p>Tệp đính kèm: ${
                        linkfile
                          ? `<button onclick = "download('${item.id}')">Tải xuống</button>`
                          : "Không có tệp đính kèm"
                      }</p>
                      <div>
                          <p>Ngày tạo: ${createdAt}</p>
                          <p>Ngày kết thúc: ${finishedAt}</p>
                          <p>${item.status?'Đã hoàn thành':'Đang thực hiện'}</p>
                      </div>
                  </div>
                  <div class = "rightWrapper">
                      <button onclick = "itemEdit('${encodeURIComponent(JSON.stringify(item))}')">Sửa</button>
                      <button onclick = "deletetask('${item.id}')">Xoá</button>
                  </div>
              </div>
          `;
      });
      console.log(renderHTML);
      document.getElementById("content").innerHTML = renderHTML.join("");
    } else document.getElementById("content").innerHTML = "Empty";
  }
  getAllTask();

  const logout = document.getElementById("logout");

  logout.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "../index.html";
  });

  function deletetask(id) {
    fetch(`https://todolistthangbui.herokuapp.com/api/apiv1/task/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    }).then((res) => {
      if (res.status == 200) {
        alert("Xoá thành công");
        getAllTask();
      }
    });
  }

  function download(id) {
    fetch(`https://todolistthangbui.herokuapp.com/api/apiv1/task/file/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    })
      .then((response) => response.blob())
      .then((result) => URL.createObjectURL(result))
      .catch((err) => console.log("aaaa"));
  }

  ////Thay đổi thông tin người dùng
  const editName = document.getElementById("editName");
  const editDate = document.getElementById("editDate");
  const avatar1 = document.getElementById("avatar1");
  const checkbox = document.getElementById("checkbox");
  const inputAvatar = document.getElementById("inputAvatar");

  checkbox.addEventListener("change", (event) => {
    if (event.currentTarget.checked) {
      editName.value = sessionStorage.getItem("name");
      editDate.value = sessionStorage.getItem("dob");
      if (sessionStorage.getItem("img")) {
        avatar1.src = sessionStorage.getItem("img");
      } else {
        avatar1.src = "../defaultAvatar.jpg";
      }
    } else {
      inputAvatar.value = null;
      if (sessionStorage.getItem("img")) {
        avatar1.src = sessionStorage.getItem("img");
      } else {
        avatar1.src = "../defaultAvatar.jpg";
      }
    }
  });

  function cancel() {
    checkbox.checked = false;
    inputAvatar.value = null;
    if (sessionStorage.getItem("img")) {
      avatar1.src = sessionStorage.getItem("img");
    } else {
      avatar1.src = "../defaultAvatar.jpg";
    }
  }

  const save = document.getElementById("save");

  inputAvatar.onchange = function (evt) {
    avatar1.src = URL.createObjectURL(inputAvatar.files[0]);
  };

  save.addEventListener("click", () => {
    fetch(
      `https://todolistthangbui.herokuapp.com/api/apiv1/user/${sessionStorage.getItem(
        "id"
      )}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
        body: `{
        "name":"${editName.value}",
        "dob":"${editDate.value}"
        }
      `,
      }
    ).then(async (res) => {
      if (res.status == 401) expire();
      if (res.status == 200) {
        if (inputAvatar && inputAvatar.value) {
          const form = new FormData();
          form.append("file", inputAvatar.files[0]);
          const res2 = await fetch(
            `https://todolistthangbui.herokuapp.com/api/apiv1/avatar/${sessionStorage.getItem(
              "id"
            )}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
              },
              body: form,
            }
          ).then((res) => {
            if (res.status == 200) {
              document.getElementById("checkbox").checked = false;
              sessionStorage.setItem("name", editName.value);
              sessionStorage.setItem("dob", editDate.value);
              sessionStorage.setItem(
                "img",
                URL.createObjectURL(inputAvatar.files[0])
              );
              avatar.src = sessionStorage.getItem("img");
              alert("Sửa thông tin thành công");
            }
            if (res.status == 401) expire();
          });
        } else {
          alert("Sửa thông tin thành công");
        }
      }
    });
  });

  function expire() {
    sessionStorage.clear();
    window.location.href = "../index.html";
  }

  const modalEdit = document.getElementById("modalEdit");
  const modal1 = document.getElementById("modal1");
  function itemEdit(item) {
    modal1.style.display = "block";
    item = JSON.parse(decodeURIComponent(item));
    // console.log(item);
    // let createdAt = moment.utc(item.created_at).toDate();
    // createdAt = moment(createdAt).format("HH:mm DD-MM-YYYY");

    // let finishedAt = "";
    // if (item.finished_at != null) {
    //   finishedAt = moment.utc(item.finished_at).toDate();
    //   finishedAt = moment(finishedAt).format("HH:mm DD-MM-YYYY");
    // }
    modalEdit.innerHTML = `
    <div class = "leftWrapper">
        <input type = "text" id = "editTask" value = '${item.task}'>
        <p>Tệp đính kèm: <input type = "file" id = "editFile" accept = ".doc,.docx,.xlsx,.pdf,.csv,image/*"></p>
        <div>
            <select id = "status" >
                <option value = "1" ${
                  item.status ? "selected" : ""
                }>Đã hoàn thành</option>
                <option value = "0"${
                  item.status ? "" : "selected"
                }>Đang thực hiện</option>
            </select>
        </div>
    </div>
    <div class = "rightWrapper">
        <button onclick = "saveEdit('${item.id}', '${item.path_file}')">Lưu</button>
        <button onclick = "cancelEdit()">Huỷ</button>
    </div>
    `;

    modalEdit.style.display = "flex";
  }

  window.onclick = function(event) {
    if (event.target == modal1) {
      modal1.style.display = "none";
      modalEdit.style.display = "none";
    }
  }

  function cancelEdit(){
    modal1.style.display = "none";
    modalEdit.style.display = "none";
  }

  function saveEdit(id,path_file){
    const editTask = document.getElementById("editTask");
    const editFile = document.getElementById("editFile");
    const status = document.getElementById("status");
    
    var check,path;

    if(path_file == 'null') path = null;
    else path = path_file

    if(status.options[status.selectedIndex].text == "Đang thực hiện") check = false
    else check = true;
    // console.log(editTask.value);
    fetch(`https://todolistthangbui.herokuapp.com/api/apiv1/task/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
        body: `{
                "task" : "${editTask.value}",
                "status": ${check}
            }`,
      })
      .then(res => {
        if(res.status == 200)
        {
          if (editFile && editFile.value) {
            const form = new FormData();
            form.append("File", editFile.files[0]);
            fetch(
              `https://todolistthangbui.herokuapp.com/api/apiv1/task/file/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
                },
                method: "POST",
                body: form,
              }
            ).then((res) => {
              if (res.status == 200) {
                alert("Sửa công việc thành công");
                getAllTask();
                cancelEdit();
              }
            });
          }else{
            alert("sửa công việc thành công");
                getAllTask();
                cancelEdit();
          }
        } 
      });
   }
}
