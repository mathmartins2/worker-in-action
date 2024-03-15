import ExcelJS from 'exceljs';

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Report');

worksheet.columns = [
  { header: 'Entity ID', key: 'entity_id', width: 36 },
  { header: 'Entity Name', key: 'entity_name', width: 30 },
];

self.onmessage = (event) => {
  if (event.data.type === 'INIT') {
    const eventSource = new EventSource('http://localhost:3000/report/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      worksheet.addRow(data.data).commit();
      if (data.progressPercent % 10 === 0) {
        console.log('Progress:', data.progressPercent);
        self.postMessage({ type: 'PROGRESS', data: data.progressPercent });
      }
    };

    eventSource.addEventListener('stream-end', () => {
      console.log('Stream ended');
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        self.postMessage({ type: 'EXCEL_READY', data: blob });
      });
      eventSource.close();
    });

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
    };
  }
  console.log(event.data);
};
