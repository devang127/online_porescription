import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeComponent = ({ value }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Scan this QR Code to Make Payment</h2>
      <QRCodeCanvas value={value} size={200} level={'H'} />
    </div>
  );
};

export default QRCodeComponent;