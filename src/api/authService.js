import config from "./config";

const adminLogin = async (credentials) => {
  return await config.post("/adminLogin", credentials);
};

const parentLogin = async (credentials) => {
  return await config.post("/login", credentials);
};

export default { adminLogin, parentLogin };