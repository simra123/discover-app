import { Container, Card, FormGroup, Label, Input, CardBody } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.webp";
import { useMutation } from "@tanstack/react-query";
import HttpHandler from "../http/CoreHttpHandler";
import { LoadingButton, ToastError, ToastSuccess } from "../components";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { AxiosResponse, AxiosError } from "axios";
type Response = {
  success: string;
};

type Error = {
  error: string;
};

type ValuesType = {
  email: string;
  password: string;
};
const LoginPage = ({ setUser }: any) => {
  const navigate = useNavigate();
  const { mutate } = useMutation<
    AxiosResponse<Response>,
    AxiosError<Error>,
    ValuesType
  >({
    mutationFn: (cred: ValuesType) => {
      return HttpHandler.makeRequest("user/login", "POST", cred);
    },
  });
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const hansdleSubmit = (
    values: any,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ): void => {
    mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: (data) => {
          setSubmitting(false);
          localStorage.setItem(
            "isUserLogged",
            JSON.stringify(data?.data.access_token),
          );
          setUser(JSON.stringify(data?.data?.access_token));
          ToastSuccess("login successfully");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        },
        onError: (data) => {
          console.log(data);
          ToastError(
            data?.response! ? data?.response!?.data?.error : data?.message!,
          );
          setSubmitting(false);
        },
      },
    );
  };

  return (
    <div className="page-background">
      <Container>
        {" "}
        <div className="login">
          <img className="mb-4" width={200} height={"auto"} src={Logo} />
          <Card>
            <CardBody>
              <h4>Login into your account</h4>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={hansdleSubmit}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label for="email">Email</Label>

                      <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        as={Input}
                      />
                      <small className="text-danger ">
                        {" "}
                        <ErrorMessage name="email" />
                      </small>
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        as={Input}
                      />
                      <small className="text-danger ">
                        <ErrorMessage name="password" />
                      </small>
                    </FormGroup>
                    <LoadingButton
                      color="primary"
                      type="btn"
                      loading={isSubmitting}
                      className="login-btn w-100"
                      text="LOGIN"
                    />
                  </Form>
                )}
              </Formik>

              <small className="d-flex my-2">
                Dont have an account?
                <span className="ms-auto">
                  <Link to="/register"> Sign up </Link>
                </span>
              </small>
            </CardBody>
          </Card>{" "}
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
