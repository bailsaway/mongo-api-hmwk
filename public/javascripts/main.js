const BASE_URL = "http://localhost:3333";

const getList = document.getElementById("garage-list");

//GET list of all vehicles
try {
  const response = await fetch(BASE_URL + "/api/v1/garage/");
  if (!response.ok) throw response;
  const data = await response.json();
  data.forEach((element) => {
    let li = document.createElement("li");
    li.appendChild(
      document.createTextNode(
        `Vehicle ID: ${element._id}, Type: ${element.type}, Make: ${element.make}, Model: ${element.model}, Colour: ${element.colour}, BHP: ${element.bhp}, Year: ${element.year}`
      )
    );
    getList.appendChild(li);
  });
} catch (err) {
  console.log("err", err);
}

//function to make formData convered to json
function createFormJSON(domForm) {
  const newFormData = new FormData(domForm);
  let domFormBody = JSON.stringify(Object.fromEntries(newFormData));
  return domFormBody;
}

//post form to add vehicle to garage
const postForm = document.getElementById("postForm");
const postBtn = document.getElementById("postbtn");

// POST method to /api/v1/garage/
const asyncPostCall = async () => {
  let body1 = createFormJSON(postForm);
  try {
    const response = await fetch("http://localhost:3333/api/v1/garage/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body1,
    });
    const data = await response.json();
    console.log("Post call response", data);
  } catch (error) {
    console.log("Post error", error);
  }
};

//post data event listener
postBtn.addEventListener("click", (event) => {
  event.preventDefault();
  asyncPostCall();
  location.reload(true);
});

//DOM delete form
const delForm = document.getElementById("delForm");
const delBtn = document.getElementById("delBtn");

//DELETE method to /api/v1/garage/
const asyncDeleteCall = async () => {
  let form = JSON.parse(createFormJSON(delForm));
  let id = form._id;
  try {
    const response = await fetch(
      `http://localhost:3333/api/v1/garage/?id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("Del call response", data);
  } catch (error) {
    console.log("Del error", error);
  }
};

delBtn.addEventListener("click", (event) => {
  event.preventDefault;
  asyncDeleteCall();
  location.reload(true);
});

//DOM Put Form
const putForm = document.getElementById("putForm");
const putBtn = document.getElementById("putBtn");

//function to delete _id from form body
function deleteIdFromForm(domForm) {
  const formToAlter = new FormData(domForm);
  formToAlter.delete("_id"); //delete _id from body to post
  let domFormBody = JSON.stringify(Object.fromEntries(formToAlter));
  return domFormBody;
}

//PUT update to vehicle by ID
const asyncPutUpdate = async () => {
  let form = JSON.parse(createFormJSON(putForm));
  let id = form._id;
  let body1 = deleteIdFromForm(putForm);
  try {
    const response = await fetch(`http://localhost:3333/api/v1/garage/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body1,
    });
    const data = await response.json();
    console.log("Put call response", data);
  } catch (error) {
    console.log("Put error", error);
  }
};

putBtn.addEventListener("click", (event) => {
  event.preventDefault;
  asyncPutUpdate();
  location.load(true);
});
