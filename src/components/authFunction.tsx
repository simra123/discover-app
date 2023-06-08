import { ToastError } from ".";

export const AuthFunction = (data: any) => {
  if (data?.response?.data?.code == 401) {
    ToastError("Your Session has Expired");
    localStorage.removeItem("isUserLogged");
    setTimeout(() => {
      window.location.reload(false);
    }, 1000);
  } else {
    ToastError(data?.response! ? data?.response!?.data?.error : data?.message!);
  }
};
