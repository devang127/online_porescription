import QRCode from 'qrcode';


export const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data);
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR Code:', error);
    throw error;
  }
};