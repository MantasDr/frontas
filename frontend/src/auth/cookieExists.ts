import Cookies from "js-cookie";

export default () => Boolean(Cookies.get("connect.sid"));
