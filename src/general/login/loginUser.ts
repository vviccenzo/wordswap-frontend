import { useUser } from "../../context/UserContext";
import { HttpMethods } from "../../utils/IRequest";
import doRequest from "../../utils/Request";

export const loginUser = async (username: string, password: string) => {
    const { setToken, setIsLogged, setUser } = useUser();

    const response: any = await doRequest({
        method: HttpMethods.POST,
        url: `/auth/login?user=${username}&password=${password}`,
    });

    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.userInfo));

    setUser(response.userInfo);
    setToken(response.token);
    setIsLogged(true);
};
