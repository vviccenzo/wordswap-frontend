import { useUser } from '../context/UserContext.tsx';
import { IRequest } from '../utils/IRequest.ts';
import doRequest from '../utils/Request.ts';

const useRequest = () => {
    const { token } = useUser();

    const request = async (requestOptions: Omit<IRequest, 'token'>) => {
        await doRequest({
            ...requestOptions,
            token
        });
    };

    return { request };
};

export default useRequest;
