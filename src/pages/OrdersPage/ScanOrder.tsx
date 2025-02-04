import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useNavigate } from 'react-router-dom';

function ScanOrder() {
    const navigate = useNavigate();

    const handleScan = (detectedCodes: IDetectedBarcode[]) => {
        if (detectedCodes.length > 0) {
            const rawValue = detectedCodes[0].rawValue; 

            try {
                const url = new URL(rawValue);
                const orderId = url.searchParams.get("orderId");

                if (orderId) {
                    navigate(`./${orderId}`); 
                } else {
                    alert("Order ID not found in the QR code!");
                }
            } catch (error) {
                console.error("Invalid QR Code URL:", rawValue);
                alert("Invalid QR Code scanned.");
            }
        }
    };

    return (
        <div style={{ width: "300px" }}>
            <Scanner onScan={handleScan} />
        </div>
    );
}

export default ScanOrder;
