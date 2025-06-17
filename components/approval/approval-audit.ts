export const getClientInfo = async () => {
    try {
        // Get IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ip_address = ipData.ip;

        // Get geolocation
        const geoResponse = await fetch(`http://ip-api.com/json/${ip_address}`);
        const geoData = await geoResponse.json();

        // Get device type
        const device_type = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

        return {
            ip_address,
            latitude: geoData.lat?.toString(),
            longitude: geoData.lon?.toString(),
            time_zone: geoData.timezone,
            geo_location: `${geoData.city}, ${geoData.region}, ${geoData.country}`,
            device_type
        };
    } catch (error) {
        console.error('Error getting client info:', error);
        return {};
    }
};  