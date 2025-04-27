export const subInvoice = (invoiceData: any) => {
  const {
    customerName,
    customerEmail,
    invoiceNumber,
    date,
    amount,
    totalAmount,
    companyAddress,
    serviceDescription,
    paymentMethod,
    status,
  } = invoiceData;

  const emailTemplate = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              color: #333;
              margin: 0;
              padding: 20px;
              min-height: 100vh;
            }
            .invoice-container {
              max-width: 700px;
              margin: 20px auto;
              padding: 30px;
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
            }
            .logo-container {
              display: flex;
              align-items: center;
            }
            .logo-container img {
              max-width: 80px;
              margin-right: 15px;
            }
            .company-name {
              font-size: 18px;
              font-weight: bold;
              color: #2c3e50;
            }
            .invoice-info {
              text-align: right;
            }
            .invoice-title {
              font-size: 28px;
              color: #2c3e50;
              margin: 0;
            }
            .invoice-number {
              font-weight: bold;
              color: #555;
            }
            .invoice-date {
              color: #777;
            }
            .invoice-details, .payment-method {
              margin-bottom: 25px;
            }
            .invoice-details h3, .payment-method h3 {
              color: #2c3e50;
              margin-bottom: 15px;
              font-size: 18px;
              border-bottom: 2px solid #eee;
              padding-bottom: 5px;
            }
            .invoice-details p, .payment-method p {
              margin: 8px 0;
              line-height: 1.5;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            table th {
              background-color: #f8f9fa;
              color: #2c3e50;
              font-weight: 600;
              padding: 12px 15px;
              text-align: left;
              border: 1px solid #ddd;
            }
            table td {
              padding: 12px 15px;
              border: 1px solid #ddd;
            }
            .total {
              font-size: 18px;
              font-weight: bold;
              text-align: right;
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
            }
            .status {
              display: inline-block;
              padding: 5px 10px;
              border-radius: 20px;
              font-weight: bold;
              color: #28a745;
            }
            .footer {
              font-size: 12px;
              color: #888;
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            .download-btn {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #3498db;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              transition: background-color 0.3s;
            }
            .download-btn:hover {
              background-color: #2980b9;
            }
            .address {
              color: #777;
              font-style: italic;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="logo-container">
                <div>
                  <div class="company-name">Exceledge cpa ltd</div>
                  <div class="address">${companyAddress}</div>
                </div>
              </div>
              <div class="invoice-info">
                <h1 class="invoice-title">INVOICE</h1>
                <div class="invoice-number">#${invoiceNumber}</div>
                <div class="invoice-date">${date}</div>
              </div>
            </div>
    
            <div class="invoice-details">
              <h3>Bill To:</h3>
              <p><strong>${customerName}</strong></p>
              <p>${customerEmail}</p>
              <p>${invoiceData.customerPhone || "N/A"}</p>
            </div>
    
            <div class="payment-method">
              <h3>Payment Information:</h3>
              <p>Method: ${paymentMethod}</p>
              <p>Status: <span class="status">${status}</span></p>
            </div>
    
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${serviceDescription}</td>
                  <td>${amount} RWF</td>
                </tr>
              </tbody>
            </table>
    
            <div class="total">
              Total: ${totalAmount} RWF
            </div>
    
            <div class="footer">
              <p>Thank you for your business. Please contact us at <a href="mailto:${
                invoiceData.supportEmail
              }">${invoiceData.supportEmail}</a> with any questions.</p>
              <p>This is an automated invoice. No signature required.</p>
             <p>Visit your profile to download this invoice:<a href="https://exceledgecpa.com/profile">https://exceledgecpa.com/profile</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  return emailTemplate;
};
