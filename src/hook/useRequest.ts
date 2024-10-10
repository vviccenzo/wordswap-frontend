import { useUser } from '../context/UserContext';
import { IRequest } from '../utils/IRequest';
import doRequest from '../utils/Request';

export function useRequest() {

    const { token } = useUser();

    const request: any = async (requestOptions: Omit<IRequest, 'token'>) => {
        await doRequest({
            ...requestOptions,
            token
        });
    };

    return { request };
};