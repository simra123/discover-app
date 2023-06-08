import { Spinner, Button } from "reactstrap";
//reuseable loading button

interface buttonProps {
  loading?: boolean;
  onClick?: (value: any) => void;
  type?: string;
  text?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}
const LoadingButton = ({
  loading,
  onClick,
  text,
  color,
  style,
  className,
}: buttonProps) => {
  return (
    <>
      <Button
        type={"submit"}
        name="button"
        style={style}
        onClick={onClick}
        className={className ? className : "w-100"}
        color={color ? color : "primary"}
        disabled={loading}
      >
        {loading ? <Spinner size="sm" color={"light"} /> : text ? text : "Send"}
      </Button>
    </>
  );
};
export default LoadingButton;
