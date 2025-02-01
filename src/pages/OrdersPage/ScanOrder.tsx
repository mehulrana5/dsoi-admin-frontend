import { Scanner } from '@yudiel/react-qr-scanner';

function ScanOrder() {
    return (
        <div style={{ width: "300px" }}>
            <Scanner onScan={(result) => alert(result)} />
        </div>
    );
}

export default ScanOrder
