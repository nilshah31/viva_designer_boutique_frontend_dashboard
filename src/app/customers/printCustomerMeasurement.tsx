import { Customer } from "./customers";
import { CustomerMeasurement } from '@/app/components/ui/modals/customerMeasurement';

export default async function printCustomerMeasurement(
  customer: Customer,
  measurements?: CustomerMeasurement,
) {
  let blouse = {};
  let lehenga = {};

  if (measurements) {
    // Use provided measurements from parent component
    blouse = measurements.blouseTop || {};
    lehenga = measurements.lehengaPant || {};
  } else {
    // Fallback to fetching from API if not provided
    const res = await fetch(`/api/measurements?customerId=${customer.id}`);
    const json = await res.json();
    blouse = json.data?.blouseTop || {};
    lehenga = json.data?.lehengaPant || {};
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const getValue = (val?: number) => (val !== undefined ? val : "");

  printWindow.document.write(`
    <html>
      <head>
        <title>Measurement Sheet</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
          }
          h1 {
            text-align: center;
            margin-bottom: 10px;
          }
          .header {
            margin-bottom: 20px;
          }
          .row {
            display: flex;
            margin-bottom: 10px;
          }
          .label {
            width: 150px;
            font-weight: bold;
          }

          .tables-wrapper {
            display: flex;
            gap: 30px;
            margin-top: 25px;
          }

          .table-box {
            width: 50%;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }

          th, td {
            border: 1px solid #000;
            padding: 6px 8px;
            text-align: left;
          }

          th {
            background: #f0f0f0;
            text-align: center;
          }

          h3 {
            text-align: center;
            margin-bottom: 6px;
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

        <script>
          window.print();
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
