import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export default function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
  // Ditambahkan tipe 'any' sementara agar VS Code tidak membaca error internal library
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    // Inisialisasi scanner menggunakan konfigurasi objek
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
    };

    const scanner = new Html5QrcodeScanner("reader", config, false);
    scannerRef.current = scanner;

    // Type casting ke unknown lalu divalidasi string agar disukai TypeScript strict mode
    scanner.render(
      (decodedText: unknown) => {
        if (typeof decodedText === "string") {
          onScanSuccess(decodedText);
        }
      },
      (error: unknown) => {
        // Abaikan warning log frame kamera agar tidak mengotori tab console browser
        console.warn(error);
      },
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error: unknown) => {
          console.error("Gagal mematikan kamera:", error);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="p-4 border rounded-xl bg-white max-w-md mx-auto shadow-sm text-center">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Arahkan Kamera ke Barcode</h3>

      {/* CSS internal ini berfungsi menghapus kotak log merah bawaan html5-qrcode dari interface web */}
      <style>{`
        #reader__status_span { display: none !important; }
        #reader div[style*="background: rgb(248, 215, 218)"] { display: none !important; }
        #reader div[style*="background: rgb(255, 243, 205)"] { display: none !important; }
      `}</style>

      <div id="reader" className="w-full overflow-hidden rounded-lg"></div>
    </div>
  );
}
