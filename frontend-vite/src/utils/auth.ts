export const decodeToken = (token: string) => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        console.error('Error decoding token: ', error);
        return null;
    }
}