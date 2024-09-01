import ProgressBar from 'react-bootstrap/ProgressBar';

function StorageBar({storage, maxStorage}) {
  let percentage = (storage*100) / maxStorage
  return (
    <div>
      <ProgressBar 
        variant={percentage >= 80?"danger": percentage > 60?"warning":"success"}
        // variant='success'
        now={percentage}
        style={{height: '8px', transition: 'all 0.5s'}}
      />
    </div>
  );
}

export default StorageBar;