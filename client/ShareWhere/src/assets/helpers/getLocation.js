export const getLocation = async () => {
            
    try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });

        if (permission.state === 'granted') {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        resolve({ lat, lng });
                    },
                    (error) => reject(error),
                );
            });
        } else {
            return Promise.reject(new Error("Location access denied"));
        }
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};