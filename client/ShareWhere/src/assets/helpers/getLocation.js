export const getLocation = async () => {
    return new Promise((resolve, reject) => {
        const checkAndRequestLocation = async () => {
            try {
                const permission = await navigator.permissions.query({ name: 'geolocation' });

                if (permission.state === 'granted') {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            });
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                } else if (permission.state === 'prompt') {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            });
                        },
                        async (error) => {
                            if (error.code === error.PERMISSION_DENIED) {
                                const data = await getGeneralLocation();
                                if (data && data.city) {
                                    resolve(data); // Resolve with approximate location
                                } else {
                                    // If getGeneralLocation fails due to API limit, use infinite location prompt.
                                    resolve(await getLocationInfinite());
                                }
                            } else {
                                reject(error);
                            }
                        }
                    );
                } else {
                    const data = await getGeneralLocation();
                    if (data && data.city) {
                        resolve(data); // Resolve with approximate location
                    } else {
                        // If getGeneralLocation fails due to API limit, use infinite location prompt.
                        resolve(await getLocationInfinite());
                    }
                }
            } catch (error) {
                console.error(error);
                reject(error);
            }
        };
        checkAndRequestLocation();
    });
};

export const getLocationInfinite = async () => {
    return new Promise((resolve, reject) => {
        const attemptLocation = async () => {
            try {
                const permission = await navigator.permissions.query({ name: 'geolocation' });

                if (permission.state === 'granted') {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            });
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                } else if (permission.state === 'prompt') {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            });
                        },
                        (error) => {
                            if (error.code === error.PERMISSION_DENIED) {
                                alert("Please allow location access in your browser settings then refresh page for accurate location.");
                                attemptLocation(); // Retry after alert
                            } else {
                                reject(error);
                            }
                        }
                    );
                } else {
                    alert("Please allow location access in your browser settings then refresh page for accurate location.");
                    attemptLocation(); // Retry after alert
                }
            } catch (error) {
                console.error(error);
                reject(error);
            }
        };

        attemptLocation();
    });
};

export async function getGeneralLocation() {
    try {
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${import.meta.env.VITE_IP_GEOLOCATION_API}`);
        const data = await response.json();
        
        if (data && data.city) {
            return {
                city: data.city,
                latitude: data.latitude,
                longitude: data.longitude,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting general location:', error);
        return null;
    }
}