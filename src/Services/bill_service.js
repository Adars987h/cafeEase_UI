import { myAxios } from "./helper";

export const viewBill = async (orderId) => {
    try {
        const response = await myAxios.get('/bill/'+orderId, {
            responseType: 'blob', // Important: This tells Axios to treat the response as binary data
        });

        // Return the PDF Blob to the calling function
        return new Blob([response.data], { type: 'application/pdf' }, {filename: "Bill-"+orderId});
    } catch (error) {
        console.error('Error opening the PDF file', error);
    }
};

export const downloadBill = async (orderId) => {
    try {
        const response = await myAxios.get('/bill/'+orderId, {
            responseType: 'blob', // Important: This tells Axios to treat the response as binary data
        });

        // Create a Blob from the PDF response
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(pdfBlob);

        // Create a hidden link element
        const link = document.createElement('a');
        link.href = url;

        // Extract the filename from headers (if available)
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'downloadedFile.pdf'; // Default filename
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch && filenameMatch.length === 2) {
                filename = filenameMatch[1];
            }
        }
        link.setAttribute('download', filename);

        // Append to the body and click programmatically
        document.body.appendChild(link);
        link.click();

        // Clean up the Blob URL and remove the link
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading the PDF file', error);
    }
};