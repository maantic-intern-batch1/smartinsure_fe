import React from 'react'


function ReportTabs(buttonNames) {
    if (!Array.isArray(buttonNames)) {
        console.error("buttonNames is not an array:", buttonNames);
        return <div>Error: buttonNames is not an array</div>;
      }
  return (
    <div className='flex justify-center'>
      
      <div className='flex overflow-auto w-3/4 mt-28'>
        {buttonNames.map((reportName) => (
          <button
            key={reportName}
            title={reportName}
            className='rounded-lg p-2 bg-color-turq hover:bg-color-blue m-2 whitespace-nowrap text-white'
          >
            {reportName}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ReportTabs
