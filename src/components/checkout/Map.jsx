import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function Map({ storeCoordinates, buyerCoordinates, routeCoordinates }) {
    const map = useMap();

    useEffect(() => {

        if (
            storeCoordinates?.latitude &&
            storeCoordinates?.longitude &&
            buyerCoordinates?.latitude &&
            buyerCoordinates?.longitude
        ) {
            const bounds = L.latLngBounds([
                [storeCoordinates.latitude, storeCoordinates.longitude],
                [buyerCoordinates.latitude, buyerCoordinates.longitude],
            ]);
            if (routeCoordinates?.length > 0) {
                routeCoordinates.forEach((coord) => {
                    if (coord?.latitude && coord?.longitude) {
                        bounds.extend([coord.latitude, coord.longitude]);
                    }
                });
            }
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, storeCoordinates, buyerCoordinates, routeCoordinates]);

    return (
        <>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {storeCoordinates?.latitude && storeCoordinates?.longitude && (
                <Marker
                    position={[storeCoordinates.latitude, storeCoordinates.longitude]}
                    title="Store Location"
                />
            )}
            {buyerCoordinates?.latitude && buyerCoordinates?.longitude && (
                <Marker
                    position={[buyerCoordinates.latitude, buyerCoordinates.longitude]}
                    title="Buyer Location"
                />
            )}
            {routeCoordinates?.length > 0 && (
                <Polyline
                    positions={routeCoordinates
                        .filter((coord) => coord?.latitude && coord?.longitude)
                        .map((coord) => [coord.latitude, coord.longitude])}
                    color="blue"
                    weight={4}
                />
            )}
        </>
    );
}

function MapWrapper({ storeCoordinates, buyerCoordinates, routeCoordinates }) {
    if (
        !storeCoordinates?.latitude ||
        !storeCoordinates?.longitude ||
        !buyerCoordinates?.latitude ||
        !buyerCoordinates?.longitude
    ) {
        return (
            <div className="w-full h-64 sm:h-80 lg:h-96 mt-4 rounded-lg overflow-hidden shadow flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">Đang tải bản đồ hoặc địa chỉ không hợp lệ</p>
            </div>
        );
    }

    return (
        <div className="w-full h-64 sm:h-80 lg:h-96 mt-4 rounded-lg overflow-hidden shadow">
            <MapContainer
                style={{ height: '100%', width: '100%' }}
                zoom={13}
                scrollWheelZoom={false}
            >
                <Map
                    storeCoordinates={storeCoordinates}
                    buyerCoordinates={buyerCoordinates}
                    routeCoordinates={routeCoordinates}
                />
            </MapContainer>
        </div>
    );
}

export default MapWrapper;