export const GoogleMapComponent = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <iframe
        title="42 KK 718 St, Kigali"
        width="100%"
        height="400"
        style={{ border: 0, borderRadius: "0.5rem" }}
        loading="lazy"
        allowFullScreen
        src="https://maps.google.com/maps?q=42+KK+718+St,+Kigali&z=16&output=embed"
      ></iframe>
    </div>
  );
};
