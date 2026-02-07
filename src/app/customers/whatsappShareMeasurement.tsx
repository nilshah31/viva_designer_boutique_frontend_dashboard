import { Customer } from "./customers";
import { CustomerMeasurement } from '@/app/components/ui/modals/customerMeasurement';

export default async function whatsappShareMeasurement(
  customer: Customer,
  measurements?: CustomerMeasurement,
) {
  let blouse: Record<string, any> = {};
  let lehenga: Record<string, any> = {};

  if (measurements) {
    blouse = measurements.blouseTop || {};
    lehenga = measurements.lehengaPant || {};
  } else {
    const res = await fetch(`/api/measurements?customerId=${customer.id}`);
    const json = await res.json();
    blouse = json.data?.blouseTop || {};
    lehenga = json.data?.lehengaPant || {};
  }

  const getValue = (val?: number) => (val !== undefined ? val : "");

  // Create HTML content
  const htmlContent = `
    <html>
      <head>
        <title>Measurement Sheet</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: white;
          }
          h1 {
            text-align: center;
            margin-bottom: 10px;
            font-size: 24px;
          }
          .header {
            margin-bottom: 15px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .row {
            display: flex;
            margin-bottom: 8px;
            font-size: 13px;
          }
          .label {
            width: 120px;
            font-weight: bold;
          }
          .tables-wrapper {
            display: flex;
            gap: 20px;
            justify-content: space-between;
          }
          .table-box {
            flex: 1;
          }
          h3 {
            text-align: center;
            margin-bottom: 10px;
            font-size: 14px;
            background: #f0f0f0;
            padding: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 5px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          @media print {
            body {
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        <h1>Viva Designer Boutique</h1>

        <div class="header">
          <div class="row">
            <div class="label">Customer Name:</div>
            <div>${customer.name}</div>
          </div>
          <div class="row">
            <div class="label">Mobile:</div>
            <div>${customer.mobile}</div>
          </div>
          <div class="row">
            <div class="label">Address:</div>
            <div>${customer.address || ""}</div>
          </div>
        </div>

        <div class="tables-wrapper">
          <!-- LEFT TABLE -->
          <div class="table-box">
            <h3>Blouse / Top</h3>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td>Blouse Length</td><td>${getValue(blouse.blouseLength)}</td></tr>
              <tr><td>Kurta Length</td><td>${getValue(blouse.kurtaLength)}</td></tr>
              <tr><td>Upper Chest</td><td>${getValue(blouse.upperChest)}</td></tr>
              <tr><td>Chest</td><td>${getValue(blouse.chest)}</td></tr>
              <tr><td>Waist</td><td>${getValue(blouse.waist)}</td></tr>
              <tr><td>Hip</td><td>${getValue(blouse.hip)}</td></tr>
              <tr><td>Shoulder</td><td>${getValue(blouse.shoulder)}</td></tr>
              <tr><td>Sleeve Length</td><td>${getValue(blouse.sleeveLength)}</td></tr>
              <tr><td>Mori</td><td>${getValue(blouse.mori)}</td></tr>
              <tr><td>By Shape</td><td>${getValue(blouse.byshape)}</td></tr>
              <tr><td>Armhole</td><td>${getValue(blouse.armhole)}</td></tr>
              <tr><td>Front Neck Depth</td><td>${getValue(blouse.frontNeckDepth)}</td></tr>
              <tr><td>Back Neck Depth</td><td>${getValue(blouse.backNeckDepth)}</td></tr>
              <tr><td>Dart Point</td><td>${getValue(blouse.dartPoint)}</td></tr>
            </table>
          </div>

          <!-- RIGHT TABLE -->
          <div class="table-box">
            <h3>Lehenga / Pant</h3>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td>Length</td><td>${getValue(lehenga.length)}</td></tr>
              <tr><td>Waist</td><td>${getValue(lehenga.waist)}</td></tr>
              <tr><td>Hip</td><td>${getValue(lehenga.hip)}</td></tr>
              <tr><td>Thigh</td><td>${getValue(lehenga.thigh)}</td></tr>
              <tr><td>Knee</td><td>${getValue(lehenga.knee)}</td></tr>
              <tr><td>Ankle</td><td>${getValue(lehenga.ankle)}</td></tr>
              <tr><td>Crotch</td><td>${getValue(lehenga.crotch)}</td></tr>
              <tr><td>Mori</td><td>${getValue(lehenga.mori)}</td></tr>
            </table>
          </div>
        </div>
      </body>
    </html>
  `;

  // Convert HTML to PDF using html2pdf library via script injection
  // We'll use a simpler approach: encode as data URL and let user save/share
  
  // Create a blob from the HTML
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Option 1: Open print dialog with option to save as PDF
  const printWindow = window.open(url, "_blank");
  if (printWindow) {
    printWindow.print();
  }
}

// Alternative: Share with WhatsApp directly (requires backend to host PDF)
export async function shareToWhatsApp(
  customer: Customer,
  measurements?: CustomerMeasurement,
) {
  // Generate measurement text for WhatsApp message
  let blouse: Record<string, any> = {};
  let lehenga: Record<string, any> = {};

  if (measurements) {
    blouse = measurements.blouseTop || {};
    lehenga = measurements.lehengaPant || {};
  }

  const getValue = (val?: number) => (val !== undefined ? val : "N/A");

  // Create a formatted text message
  const message = `*Viva Designer Boutique - Measurement Sheet*
📋 *Customer: ${customer.name}*

*Customer Details:*
Name: ${customer.name}
Mobile: ${customer.mobile}
Address: ${customer.address || "N/A"}

*Blouse / Top Measurements:*
• Blouse Length: ${getValue(blouse.blouseLength)}
• Kurta Length: ${getValue(blouse.kurtaLength)}
• Upper Chest: ${getValue(blouse.upperChest)}
• Chest: ${getValue(blouse.chest)}
• Waist: ${getValue(blouse.waist)}
• Hip: ${getValue(blouse.hip)}
• Shoulder: ${getValue(blouse.shoulder)}
• Sleeve Length: ${getValue(blouse.sleeveLength)}
• Mori: ${getValue(blouse.mori)}
• By Shape: ${getValue(blouse.byshape)}
• Armhole: ${getValue(blouse.armhole)}
• Front Neck Depth: ${getValue(blouse.frontNeckDepth)}
• Back Neck Depth: ${getValue(blouse.backNeckDepth)}
• Dart Point: ${getValue(blouse.dartPoint)}

*Lehenga / Pant Measurements:*
• Length: ${getValue(lehenga.length)}
• Waist: ${getValue(lehenga.waist)}
• Hip: ${getValue(lehenga.hip)}
• Thigh: ${getValue(lehenga.thigh)}
• Knee: ${getValue(lehenga.knee)}
• Ankle: ${getValue(lehenga.ankle)}
• Crotch: ${getValue(lehenga.crotch)}
• Mori: ${getValue(lehenga.mori)}`;

  // URL encode the message
  const encodedMessage = encodeURIComponent(message.trim());

  // Detect device type
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  const isMobile = isAndroid || isIOS;

  try {
    if (isAndroid) {
      // Android: Use intent URI for better compatibility with WhatsApp app
      // This will open WhatsApp if installed, or fall back to web
      window.location.href = `intent://send?text=${encodedMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
    } else if (isIOS) {
      // iOS: WhatsApp URL scheme
      window.open(`whatsapp://send?text=${encodedMessage}`, "_blank");
    } else {
      // Desktop/Tablet (Chrome): Use WhatsApp Web
      // Add small delay to ensure link opens in new tab properly
      setTimeout(() => {
        window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, "_blank");
      }, 100);
    }
  } catch (error) {
    console.error("Error opening WhatsApp:", error);
    // Fallback: Open WhatsApp Web
    window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, "_blank");
  }
}
