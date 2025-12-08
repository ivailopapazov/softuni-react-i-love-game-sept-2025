import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";

const baseUrl = 'http://127.0.0.1:5001/i-love-game-setp-2025/us-central1/server';

export default function useRequest(url, initialState) {
    const { user, isAuthenticated } = useContext(UserContext);
    const [data, setData] = useState(initialState);

    // TODO Fix infinite loop problem on mount request with useEffect
    const request = async (url, method, data, config = {}) => {
        let options = {};

        if (method) {
            options.method = method;
        }

        if (data) {
            options.headers = {
                'content-type': 'application/json',
            };

            options.body = JSON.stringify(data);
        }

        if (config.accessToken || isAuthenticated) {
            options.headers = {
                ...options.headers,
                'X-Authorization': config.accessToken || user.accessToken,
            }
        }

        const response = await fetch(`${baseUrl}${url}`, options);

        if (!response.ok) {
            throw response.statusText;
        }

        if (response.status === 204) {
            return {};
        }

        const result = await response.json();

        return result;
    };

    useEffect(() => {
        if (!url) return;

        request(url)
            .then(result => setData(result))
            .catch(err => alert(err));
    }, [url]);

    return {
        request,
        data,
        setData,
    }
}
