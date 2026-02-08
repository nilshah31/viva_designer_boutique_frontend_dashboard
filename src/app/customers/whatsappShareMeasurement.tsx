"use client";

import { Customer } from "./customers";

// Helper function to generate measurements message
function generateMeasurementsMessage(customer: Customer, measurements?: any): string {
  let blouse = measurements?.blouseTop || {};
  let lehenga = measurements?.lehengaPant || {};

  const getValue = (val?: number) => (val !== undefined && val !== null ? val : "N/A");

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

  return message;
}

// Fetch measurements if not provided
async function getMeasurements(customer: Customer, measurements?: any): Promise<any> {
  // If measurements provided and has data, use them
  if (measurements && (measurements.blouseTop || measurements.lehengaPant)) {
    return measurements;
  }

  // Otherwise fetch from API
  try {
    const res = await fetch(`/api/measurements?customerId=${customer.id}`);
    if (res.ok) {
      const response = await res.json();
      return response.data || {};
    }
  } catch (error) {
    console.error("Error fetching measurements:", error);
  }

  return {};
}

// Share with WhatsApp
export async function shareToWhatsApp(
  customer: Customer,
  measurements?: any,
) {
  // Fetch measurements if not available
  const measurementData = await getMeasurements(customer, measurements);
  const message = generateMeasurementsMessage(customer, measurementData);
  const encodedMessage = encodeURIComponent(message.trim());

  // Detect device type
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);

  try {
    if (isAndroid) {
      window.location.href = `intent://send?text=${encodedMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
    } else if (isIOS) {
      window.open(`whatsapp://send?text=${encodedMessage}`, "_blank");
    } else {
      setTimeout(() => {
        window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, "_blank");
      }, 100);
    }
  } catch (error) {
    console.error("Error opening WhatsApp:", error);
    window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, "_blank");
  }
}

// Share with WhatsApp Business
export async function shareToWhatsAppBusiness(
  customer: Customer,
  measurements?: any,
) {
  // Fetch measurements if not available
  const measurementData = await getMeasurements(customer, measurements);
  const message = generateMeasurementsMessage(customer, measurementData);
  const encodedMessage = encodeURIComponent(message.trim());

  // Detect device type
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);

  try {
    if (isAndroid) {
      window.location.href = `intent://send?text=${encodedMessage}#Intent;scheme=whatsapp;package=com.whatsapp.w4b;end`;
    } else if (isIOS) {
      window.open(`whatsapp://send?text=${encodedMessage}`, "_blank");
    } else {
      setTimeout(() => {
        window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, "_blank");
      }, 100);
    }
  } catch (error) {
    console.error("Error opening WhatsApp Business:", error);
    window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, "_blank");
  }
}
