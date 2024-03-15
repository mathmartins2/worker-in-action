import { saveAs } from 'file-saver';
import { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

const ReportPage = () => {
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [counter, setCounter] = useState(0);

  const worker = new Worker(new URL('./excelWorker.ts', import.meta.url), { type: "module" });

  const handleDownloadReport = () => {
    setShowProgress(true);

    worker.postMessage({ type: 'INIT' });

    worker.onmessage = (event) => {
      if (event.data.type === 'PROGRESS') {
        setProgress(event.data.data);
      }
      
      if (event.data.type === 'EXCEL_READY') {
        saveAs(event.data.data, 'report.xlsx');
        setShowProgress(false);
        worker.terminate();
      }
    };
  };

  return (
    <div >
      <button style={{
        margin: '20px',
      }} onClick={handleDownloadReport}>Download Report</button>
      {showProgress && (
        <LinearProgress variant="determinate" value={progress} />
      )}
      {progress === 100 && <div>report download in progress</div>}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={() => setCounter(counter + 1)}>Increment Counter</button>
        <p>Counter value: {counter}</p>
      </div>
    </div>
  );
};

export default ReportPage;
