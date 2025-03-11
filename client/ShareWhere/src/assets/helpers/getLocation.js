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
                                alert("Allow location access in browser settings for exact location. Now using approximate location.");
                                const data = await getGeneralLocation();
                                resolve(data); // Resolve with approximate location
                            } else {
                                reject(error);
                            }
                        }
                    );
                } else {
                    alert("Allow location access in browser settings for exact location. Now using approximate location.");
                    const data = await getGeneralLocation();
                    resolve(data); // Resolve with approximate location
                }
            } catch (error) {
                console.error(error);
                reject(error);
            }
        };
        checkAndRequestLocation();
    });
};


export async function getGeneralLocation() {
    try {
      const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${import.meta.env.VITE_IP_GEOLOCATION_API}`); // Replace with a reliable IP geolocation API
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