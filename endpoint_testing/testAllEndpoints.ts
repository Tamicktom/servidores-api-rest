//* Libraries imports
import axios from "axios";
import z from "zod";

const randomUser = {
  name: generateRandomName(),
  email: generateRandomEmail(),
  password: "123zxcZXC@"
}

function generateRandomName() {
  let randomName = ""
  for (let i = 0; i < 10; i++) {
    randomName += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  return randomName;
}

function generateRandomEmail() {
  let beforeAt = ""
  for (let i = 0; i < 10; i++) {
    beforeAt += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  return `${beforeAt}@gmail.com`;
}

//* local variables
const user: User = {
  id: "",
  name: "",
  email: ""
}

let token: string = "";

console.log("Test all EndPoints!");

console.log("It should be possible to create an account");

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email("Invalid email address"),
});

type User = z.infer<typeof userSchema>;

async function createUser() {
  const body = {
    name: randomUser.name,
    email: randomUser.email,
    password: randomUser.password
  }
  axios.post("http://localhost:3333/user", body)
    .then((response) => {
      console.log(response.data);
      const tmpUser = userSchema.parse(response.data);
      user.id = tmpUser.id;
      user.name = tmpUser.name;
      user.email = tmpUser.email;
      console.log("User created!");
    }).catch((error) => {
      console.error("Error creating user");
      console.log(error);
    });
}


console.log("It should be possible to get session token");

const sessionSchema = z.object({
  token: z.string(),
  user: userSchema
});

async function getSessionToken() {
  const body = {
    email: user.email,
    password: randomUser.password,
    name: user.name
  }
  axios.post("http://localhost:3333/session", body)
    .then((response) => {
      console.log(response.data);
      const tmpSession = sessionSchema.parse(response.data);
      token = tmpSession.token;
      console.log("Session token created!");
    }).catch((error) => {
      console.error("Error creating session token");
      console.log(error);
    });
}


console.log("It should be possible to get user info");

const userInfoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email("Invalid email address"),
});

async function getUserInfo() {
  axios.get("http://localhost:3333/userinfo", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      const tmpUserInfo = userInfoSchema.parse(response.data);
      console.log("User info retrieved!");
    }).catch((error) => {
      console.error("Error retrieving user info");
      console.log(error);
    });
}


console.log("It should be possible to add a category");

const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

async function addCategory() {
  const body = {
    name: "Category Test"
  }
  axios.post("http://localhost:3333/category", body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      const tmpCategory = categorySchema.parse(response.data);
      console.log("Category added!");
    }).catch((error) => {
      console.error("Error adding category");
      console.log(error);
    });
}


console.log("It should be possible to get all categories");

const categoriesSchema = z.array(categorySchema);

async function getAllCategories() {
  axios.get("http://localhost:3333/category", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      const tmpCategories = categoriesSchema.parse(response.data);
      console.log("Categories retrieved!");
    }).catch((error) => {
      console.error("Error retrieving categories");
      console.log(error);
    });
}

createUser().then(() => {
  setTimeout(() => {
    getSessionToken().then(() => {
      setTimeout(() => {
        getUserInfo()
        addCategory();
        getAllCategories();
      }, 500);
    });
  }, 500);
});

