import { Spinner } from "reactstrap";

const Loader = ({ isLoading }: any) => {
  return (
    <>
      {isLoading && (
        <div
          style={{
            margin: "40px auto",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Spinner style={{ height: "4rem", width: "4rem" }} color="dark">
            Loading...
          </Spinner>
        </div>
      )}
    </>
  );
};
export default Loader;
