class APIS {
  apis() {
    return {
     login: {
        method: "post",
        path: "/user/login",
      },
    };
  }
}

export default new APIS();
