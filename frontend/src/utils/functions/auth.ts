// import des bibliothèques
import { jwtDecode } from 'jwt-decode';

export const jwtService = {
    verifyToken: (token: string) => {
        return jwtDecode(token);
    },
};
