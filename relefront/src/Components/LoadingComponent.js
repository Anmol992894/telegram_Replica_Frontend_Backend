import React from 'react';

// Loading component to display a spinner while content is loading
function Loading() {
    return (
        <div className="pt-5 mt-5 container d-flex flex-column justify-content-center align-items-center" style={{ width: "100%", height: "100%" }}>
            {/* Spinner */}
            <div className="pt-5 mt-3 text-center fs-1">
                <div style={{height:"200px", width:"200px"}} className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    );
}

export default Loading;
